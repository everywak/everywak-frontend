import React, { Component, useState, useEffect, useRef, PureComponent } from 'react';

import { Cookies } from 'react-cookie';

import Spinner from '../../common/Components/Spinner';
import InsertEmoticonRoundedIcon from '@material-ui/icons/InsertEmoticonRounded';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import BasicButton from '../../common/Components/Button/BasicButton';
import TransparentButton from '../../common/Components/Button/TransparentButton';
import CircleImg from '../../common/Components/CircleImg';

import TwitchApi from '../../services/TwitchApi';

import styles from './TwitchChatClient.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const cookies = new Cookies();

const setCookie = (name, value, option) => cookies.set(name, value, { ...option })
const getCookie = name => cookies.get(name)

class TwitchChatClient extends PureComponent {

  static LIGHT      = 100;
  static DARK       = 101;

  static CLOSED     = 0;
  static CONNECTED  = 1;
  static FAILED     = 3;
  static AUTHORIZED = 10;
  static JOINED     = 11;

  static LOGOUTED   = 0;
  static LOGINING   = 1;
  static LOGINED    = 2;

  static defaultProps = {
    clientId: '',
    channelName: '',
    redirectUri: '',
    colorTheme: TwitchChatClient.LIGHT,
  };

  state = {
    oauth: '',
    oauthState: TwitchChatClient.LOGOUTED,
    chatList: [],
    chatOptions: {
      onlyModerator: false,
      onlySubscriber: false,
      maxShowLength: 30,
      blacklist: [],
      whitelist: [],
    },
    openedEmotePicker: false,
  };

  constructor(props) {
    super(props);

    this.IRCStatus  = TwitchChatClient.CLOSED;
    this.connRetries = 0;

    this.selfInfo = '';
    this.userLoginId = '';

    this.badges = {};
    this.emoteSets = [];

    this.twitchApi = null;

    this.chatInput      = React.createRef();
  }

  componentDidMount() {
    const token = new URLSearchParams(this.props.location.hash.replace('#', '')).get('access_token');
    this.loadClientOAuth(token);
    
    this.props.history.push({
      pathname: '/live',
      hash: ''
    });
  }

  /**
   * Initialize Twitch API Adapter.
   * @see TwitchApi
   * @returns {TwitchApi}
   */
  getTwitchApi = () => {
    if (!this.twitchApi && this.props.clientId && this.getClientOAuth()) {
      this.twitchApi = new TwitchApi({
        clientId: this.props.clientId,
        token: this.getClientOAuth(),
      });
    }

    return this.twitchApi;
  }

  /**
   * Create a WebSocket to communicate with Twitch Chat Server.
   */
  connectTwitchIRC = () => {
    this.twitchIRC = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

    // bind event handler
    this.twitchIRC.onopen    = this.onOpen;
    this.twitchIRC.onclose   = this.onClose;
    this.twitchIRC.onmessage = this.onMessage;
    this.twitchIRC.onerror   = this.onError;

    // start loop pingpong
    this.loopPingPong = setInterval(() => this.sendMessage('PING :tmi.twitch.tv'), 300*1000);
  }

  /**
   * Get the client's OAuth token.
   * 
   */
  loadClientOAuth = token => {
    if (token) {
      setCookie('TWITCH_AUTH', token);
    }
    this.setState({
      oauthState: TwitchChatClient.LOGINING,
      oauth: getCookie('TWITCH_AUTH'),
    });
  }

  /**
   * Return the client's OAuth token.
   */
  getClientOAuth = () => this.state.oauth

  /**
   * Set IRC status
   * 
   * @param {Number} status
   * @see IRCStatus
   */
  setIRCStatus = status => {
    this.IRCStatus = status;
  }

  onOpen = e => {
    if (process.env.NODE_ENV == 'development') { console.log('Connected to Twitch Chat.'); }
    
    this.setIRCStatus(TwitchChatClient.CONNECTED);
    this.loginTwitchIRC();
  };

  /**
   * Send request of login to Twitch chat.
   */
  loginTwitchIRC = () => {
    this.sendMessage(`PASS oauth:${this.getClientOAuth()}`);
    this.sendMessage('NICK TwitchChatClient');
    this.sendMessage('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
  }

  onClose = e => {
    console.log('Twitch IRC WebSocket is closed.');
    this.setState({
      oauthState: TwitchChatClient.LOGOUTED,
    });

    this.setIRCStatus(TwitchChatClient.CLOSED);
    clearInterval(this.loopPingPong);

    if (this.state.oauth != undefined && this.state.oauth != '') { // retry login now,2,4,8 secs..
      setTimeout(this.connectTwitchIRC, Math.pow(2, this.connRetries++) * 1000);
    }
  };

  onMessage = e => {
    const res = e.data.split('\r\n').map(str => {
      const arr = str.split(' ');
      const result = arr.splice(0, e.data.substr(0, 1) === '@' ? 3 : 2);

      result.push(arr.join(' '));
      return result;
    });
    if (process.env.NODE_ENV == 'development') { console.log('Twitch IRC WebSocket has sended a message.'); console.log(res); }

    res.map(async data => {
      switch(this.IRCStatus) {
        case TwitchChatClient.CONNECTED:
          if (data[2] === '* :Login authentication failed') {
            this.setIRCStatus(TwitchChatClient.FAILED);
            this.setState({
              oauthState: TwitchChatClient.LOGOUTED,
            });
            console.log('Login authentication failed.');
          }
          if (data[1] == '376') {
            this.setIRCStatus(TwitchChatClient.AUTHORIZED);
            this.sendMessage(`JOIN #${this.props.channelName}`);
            console.log('Login authentication completed successfully.');
          }
          break;

        case TwitchChatClient.AUTHORIZED:
          if (data[1] == 'JOIN') {
            this.setIRCStatus(TwitchChatClient.JOINED);
            this.setState({
              oauthState: TwitchChatClient.LOGINED,
            });

            // reset retry count
            this.connRetries = 0; 

            console.log('Channel chat joined.');
            const twitchApi = this.getTwitchApi();
            const user = await twitchApi.getUsers(this.props.channelName);
            // load chat's bagdes
            const badgesChannel = await twitchApi.getChannelChatBadges(user[0].id);
            const badgesGlobal = await twitchApi.getGlobalChatBadges();
            badgesGlobal.map(b => {
              b.versions.map(bg => {
                this.badges[b.set_id + '/' + bg.id] = {
                  id: b.set_id + '/' + bg.id,
                  image_url_1x: bg.image_url_1x,
                  image_url_2x: bg.image_url_2x,
                  image_url_4x: bg.image_url_4x,
                }
              });
            });
            badgesChannel.map(b => {
              b.versions.map(bg => {
                this.badges[b.set_id + '/' + bg.id] = {
                  image_url_1x: bg.image_url_1x,
                  image_url_2x: bg.image_url_2x,
                  image_url_4x: bg.image_url_4x,
                }
              });
            });

            // set my login id
            this.userLoginId = data[0].substr(1, data[0].indexOf('!') - 1);
          }
          break;
        case TwitchChatClient.JOINED:
          this.handleChatMessage(data);
          if (data[0] === 'PING') {
            this.sendMessage('PONG :tmi.twitch.tv');
          }
          break;
      }
    });
  };

  onError = e => {
    console.log('Cannot connect to Twitch chat server.');
    this.IRCStatus = TwitchChatClient.FAILED;
  };

  handleChatMessage = data => {
    if (process.env.NODE_ENV == 'development') { console.log(data); }

    if (data[2] == 'PRIVMSG') {
        this.receiveChat({tag: data[0], id: data[1], msg: data[3].split(':').length > 1 ? data[3].split(':')[1] : data[3]});
    } else if (data[2] && data[2].match(/^USERSTATE/)) {
        this.updateSelfInfo(data);
    }
  }

  /**
   * Update my chat profile.
   * 
   * @param {Array} data
   */
  updateSelfInfo = async data => {
    this.selfInfo = data[0];
    
    const tags = this.parseTag(this.selfInfo);
    await this.updateEmoteSet(tags['emote-sets']);
  }

  /**
   * Send a command to Twitch IRC.
   * 
   * @param {String} data
   */
  sendMessage = data => {
    if ([ TwitchChatClient.CONNECTED, TwitchChatClient.AUTHORIZED, TwitchChatClient.JOINED ].includes(this.IRCStatus)) {
      this.twitchIRC.send(data);
      return true;
    } else {
      return false;
    }
  };

  /**
   * Send a chat message to Twitch IRC.
   * 
   * @see chatInput
   */
  sendChat = e => {
    if (this.chatInput.current && this.IRCStatus === TwitchChatClient.JOINED) {
      const str = this.chatInput.current.value;
      this.sendMessage(`PRIVMSG #${this.props.channelName} :${str}`);
      this.chatInput.current.value = '';
      str != '' && this.receiveChat({tag: this.selfInfo + ';id=my-chat-' + (Math.random() * 9999999), id: `:${this.userLoginId}!`, msg: str, mine: true});
    }
  }

  /**
   * Handle a received chat message from Twitch IRC
   * 
   * @see handleChatMessage
   * @param {String} tag
   * @param {String} id
   * @param {String} msg
   */
  receiveChat = async ({ tag, id, msg, mine = false }) => {
    const tags = this.parseTag(tag);
    
    const badges    = this.parseBadge(tags.badges);
    const emotes    = this.parseEmote(tags.emotes);

    this.emoteSets.map(ems => {
      for(let i = 0; i < msg.length; i++) {
        const pos = msg.indexOf(ems.name, i);
        if(pos != -1) {
        emotes.push({
          id: ems.id, 
            pos: [[pos, pos + ems.name.length - 1]],
        });
          i += pos + ems.name.length - 1;
      }
      }
    })

    const content     = this.replaceEmote(msg, emotes);
    const displayName = tags['display-name'];
    const userID      = id.substr(1, id.indexOf('!') - 1);
    const color       = tags.color;
    const badgeList   = badges.map(bg => {
      if (bg) {
        return <TwitchChatBadge key={bg.id} src_1x={bg.image_url_1x} src_2x={bg.image_url_2x} src_3x={bg.image_url_4x} />;
      }
    }
    );

    const chat = {
      tags: tags,
      userId: userID,
      profile: <span className="chatProfileWrapper" style={{color: color}}>
        {badgeList}
        <span className="nickname">{displayName}</span><span className="userid">{displayName != userID ? `(${userID})` : ''}</span>
      </span>,
      content: content,
      rawContent: msg,
      key: tags.id,
    };

    // append chat to list
    this.appendToChatList(chat);
  }

  /**
   * Parse and save emoteSets that can be used in this chat.
   */
  updateEmoteSet = async emoteSetsRaw => {
    const emoteSets = this.parseEmoteSets(emoteSetsRaw);

    if (emoteSets.length > 0 && this.emoteSets.length === 0) {
      const twitchApi = this.getTwitchApi();
      const emoteSetsData = await twitchApi.getEmoteSets(emoteSets);
      this.emoteSets = emoteSetsData;
      this.forceUpdate();
    }
  }

  /**
   * Append chatItem to chatList.
   * 
   * @see TwitchChatClient.receiveChat
   * @param {Object} chat A chat to append
   */
  appendToChatList = chat => {
    const { chatList, } = this.state;
    this.setState({
      chatList: [...chatList, chat],
    });
  }

  /**
   * Parse tags ftom '@tag=value;tag=value'
   * 
   * @return {Object} tags
   */
  parseTag = tag => {
    const tags = {};
    tag.substr(1).split(';').map(t => {
      const [k, v] = t.split('=');
      tags[k] = v;
    });
    return tags;
  }

  /**
   * Parse emote info from tag data
   * 
   * @return {Array} emote data
   */
  parseEmote = data => {
    const emotes = [];

    if (!data) { return emotes; }
    
    // parse emote data
    data.replace(';', '') // id:pos/id:pos,pos/id:pos,pos
    .split('/').map(em => { // [ id:pos, id:pos,pos, id:pos,pos ]
      const [ id, pos ] = em.split(':');
      emotes.push({
        id: id, 
        pos: pos.split(',').map(p => {const [b, e] = p.split('-'); return [parseInt(b), parseInt(e)];}),
      });
    });
    return emotes;
  }

  /**
   * Parse emote sets from tag data
   * 
   * @return {Array} emote sets data
   */
  parseEmoteSets = data => {
    if (!data) { return []; }
    
    // parse emote sets data
    return data.replace(';', '').split(',');
  }

  /**
   * Parse badge info from tag data
   * 
   * @return {Array} badge data
   */
  parseBadge = data => {
    const badges = [];

    if (!data) { return badges; }
    
    // parse badge data
    data.split(',').map(bg => { // badge/id,badge/id,badge/id
      badges.push(this.badges[bg]);
    });
    return badges;
  }

  /**
   * Replace emote string to emote tag
   * 
   * @return {Array}
   */
  replaceEmote = (str, emotes) => {

    if (!emotes || emotes.length == 0) { return [str]; } // skip if not exist emotes

    const content = [];
    let cursor = 0, i = 0;
    for(i = 0; i < str.length; i++) {
      const emo = emotes.filter(em => em.pos.filter(p => p[0] === i)[0])[0];
      if (emo) {
        const pos = emo.pos.filter(p => p[0] === i)[0];
        content.push(str.substring(cursor, i)); // push prev
        content.push(<TwitchChatEmote emoteId={emo.id} />); // push emote
        i = pos[1]; //skip
        cursor = pos[1] + 1;
        continue;
      }
    }
    if (cursor != str.length) {
      content.push(str.substring(cursor, str.length)); // push last string
    }

    return content;
  }

  /**
   * Open EmotePicker
   */
  openEmotePicker = () => {
    this.setState({
      openedEmotePicker: true,
    });
  }

  /**
   * Close EmotePicker
   */
  closeEmotePicker = () => {
    this.setState({
      openedEmotePicker: false,
    });
  }

  /**
   * Toggle EmotePicker
   */
  toggleEmotePicker = () => {
    this.setState({
      openedEmotePicker: !this.state.openedEmotePicker,
    });
  }

  /**
   * Put emote name into chatbox
   * @see TwitchChatClient.chatInput
   */
  appendToChatBox = str => {
    if (this.chatInput.current) {
      this.chatInput.current.value += str;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.chatList != this.state.chatList) { // if a new chat exists
      setTimeout(this.scrollToBottom, 100);
    }
    if (prevState.oauth != this.getClientOAuth()) {
      this.loginTwitchIRC();
    }
    if (prevState.oauthState != this.state.oauthState &&
        this.state.oauthState === TwitchChatClient.LOGINING) {
      this.connectTwitchIRC();
    }
  }

  componentWillUnmount() {
    this.sendMessage(`PART #${this.props.channelName}`);
    this.twitchIRC.close();
  }

  render() {
    const { clientId, redirectUri } = this.props;
    const { chatList, chatOptions, oauthState, openedEmotePicker } = this.state;

    return (
      <div className="TwitchChatClient content">
        {
          oauthState == TwitchChatClient.LOGINED ?
          <React.Fragment>
            <header className="twitchChatHeader">
              채팅
            </header>
            <TwitchChatList chatList={chatList} options={chatOptions} />
            <div className="twitchChatBottom">
              <div className="twitchChatInputWrapper">
              <textarea 
                className="twitchChatInput" 
                ref={this.chatInput} 
                onKeyPress={e => {if(e.charCode == 13) { e.preventDefault(); this.sendChat() } }}
                onChange={e => {
                  e.target.style.height = '0px';
                    e.target.style.height = `${e.target.scrollHeight + 4}px`;
                }} />
                <TransparentButton className="twitchChatBtnEmote" onClick={e => this.toggleEmotePicker()}>
                  <InsertEmoticonRoundedIcon fontSize="small" />
                </TransparentButton>
              </div>
              <div className="twitchChatInputFooter">
                <div className="inputFooterLeftWrapper">&nbsp;</div>
                <div className="inputFooterRightWrapper">
                  <TransparentButton className="twitchChatBtnSetting">
                    <SettingsRoundedIcon fontSize="small" />
                  </TransparentButton>
                  <BasicButton className="twitchChatBtnSend" onClick={this.sendChat}>채팅</BasicButton>
                </div>
              </div>
              {openedEmotePicker && <TwitchChatEmotePicker emotes={this.emoteSets} twitchApi={this.getTwitchApi()} appendToChatBox={this.appendToChatBox} />}
            </div>
          </React.Fragment> :
          <div className="twitchChatLogin">
            {
              oauthState == TwitchChatClient.LOGOUTED ?
              <React.Fragment>
                <span className="loginTitle">로그인하여 팬치들과 함께 해요.</span>
                <a className="twitchChatButton btnLoginTwitch" href={`https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=chat:edit chat:read channel:read:predictions`}>Twitch로 로그인</a>
              </React.Fragment> :
              <React.Fragment>
                <Spinner caption="채팅방 접속중..." />
              </React.Fragment>
            }
          </div>
        }
      </div>
    );
  }
}

function TwitchChatList({
  chatList = [], 
  options = {},
}) {

  const refList = useRef();
  useEffect(() => {
    scrollToBottom();
  }, [chatList]);

  /**
   * Scroll chatList to bottom.
   */
  function scrollToBottom() {
    const element = refList.current;
    if (element) {
      element.scrollTo({
        //behavior: 'smooth',
        top: element.scrollHeight,
      });
    }
  }

  const _options = Object.assign({
    onlyModerator: false,
    onlySubscriber: false,
    maxShowLength: 30,
    blacklist: [],
    whitelist: [],
  }, options);

  function filterChatList(list, opt) {
    let filteredChatList = list;
    if(opt.whitelist.length > 0) {
      filteredChatList = filteredChatList.filter(item => opt.whitelist.includes(item.userId));
    }
    if(opt.blacklist.length > 0) {
      filteredChatList = filteredChatList.filter(item => !opt.blacklist.includes(item.userId));
    }
    if(opt.onlyModerator) {
      filteredChatList = filteredChatList.filter(item => item.tags.mod == '1' || opt.whitelist.includes(item.userId));
    }
    if(opt.onlySubscriber) {
      filteredChatList = filteredChatList.filter(item => item.tags.subscriber == '1');
    }

    return filteredChatList.slice(Math.max(filteredChatList.length + 1 - opt.maxShowLength, 0));
  }

  const filteredChatList = filterChatList(chatList, _options);
  const cList = filteredChatList.map(c => 
    <li key={c.key} className="twitchChatItem">
      <span className="chatProfile">{c.profile}</span>
      <span>: </span>
      <span className="chatContent">{c.content}</span>
  </li>
  );

  return (
    <ul className="TwitchChatList" ref={refList}>
      {cList}
    </ul>
  )
}

class TwitchChatEmote extends Component {

  static defaultProps = {
    emote: null,
    emoteId: '0',
    onclick: null,
  };

  onClick = e => {
    const { onclick, emote } = this.props;
    if (onclick) {
      onclick(emote.name + ' ');
    }
  }

  render() {
    const { emoteId } = this.props;

    return (
      <span className='TwitchChatEmote' onClick={this.onClick}>
        <img 
          src={`https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/light/1.0`} 
          srcSet={`https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/light/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/light/2.0 2x, https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/light/3.0 3x`} 
        />
      </span>
    );
  }
}

class TwitchChatBadge extends Component {

  static defaultProps = {
    src_1x: '',
    src_2x: '',
    src_4x: '',
  };

  render() {
    const { src_1x, src_2x, src_4x } = this.props;

    return (
      <span className='TwitchChatBadge'>
        <img 
          src={src_1x} 
          srcSet={`${src_1x} 1x, ${src_2x} 2x, ${src_4x} 3x`} 
        />
      </span>
    );
  }
}

/**
 * @typedef TwitchChatEmoteItem
 * @property {string} id
 * @property {string} name
 * @property {{
 * url_1x: string,
 * url_2x: string,
 * url_4x: string,
 * }} images
 * @property {string} emote_type
 * @property {string} emote_set_id
 * @property {string} owner_id
 * @property {string[]} format
 * @property {string[]} scale
 * @property {string[]} theme_mode
 */

/**
 * 
 * @param {{emotes: TwitchChatEmoteItem[], twitchApi: TwitchApi, appendToChatBox: function}} props 
 */
function TwitchChatEmotePicker ({emotes, twitchApi, appendToChatBox}) {

  const [recents, setRecents] = useState([
      {
        id: "245",
        name: "ResidentSleeper",
      },
  ]);
  const [groupedEmotes, setGroupedEmotes] = useState({});

  useEffect(() => {
    groupEmotes(emotes);
  }, [emotes]);

  function groupEmotes(emotes) {
    const grouped = {};

    for(let emote of emotes) {

      // generate new emote set
      if (!grouped[emote.emote_set_id]) {
        grouped[emote.emote_set_id] = {
          name: emote.emote_set_id,
          owner_id: emote.owner_id,
          emotes: [],
        }
      }
      const emoteSet = grouped[emote.emote_set_id];

      emoteSet.emotes.push(emote);
    }

    setGroupedEmotes(grouped);
  }

    const emoteList = 
    [
      [
        'recents', 
        {
          name: '자주 사용',
          owner_id: 'recents',
          emotes: recents,
        }
      ], 
      ...Object.entries(groupedEmotes).reverse()
    ].map(([emoteSetId, emoteSet]) => <TwitchChatEmoteSet emoteSet={emoteSet} twitchApi={twitchApi} appendToChatBox={appendToChatBox} />);

    return (
      <div className='TwitchChatEmotePicker'>
        {emoteList}
      </div>
    );
  }

/**
 * @typedef EmoteSetItem
 * @property {string} name
 * @property {string} owner_id
 * @property {TwitchChatEmoteItem[]} emotes
 */
/**
 * 
 * @param {{emoteSet: EmoteSetItem, twitchApi: TwitchApi, appendToChatBox: function}} props 
 */
function TwitchChatEmoteSet({emoteSet, twitchApi, appendToChatBox}) {

  const [emoteSetInfo, setEmoteSetInfo] = useState({
    iconImg: '',
    name: '',
  });


  useEffect(() => {
    getEmoteSetName();
  }, [emoteSet]);

  async function getEmoteSetName () {
    if (emoteSet.owner_id  === '0') {
      setEmoteSetInfo({
        iconImg: '',
        name: '글로벌',
      });
      return;
    }
    if (emoteSet.owner_id  === 'recents') {
      setEmoteSetInfo({
        iconImg: '',
        name: '자주 사용하는 이모티콘',
      });
      return;
    }

    const emoteOwnerData = await twitchApi.getChannelInfo(emoteSet.owner_id);

    if (emoteOwnerData.length === 0) {
      setEmoteSetInfo({
        iconImg: '',
        name: '알 수 없는 이모티콘',
      });
      return;
    }

    const emoteSetName = emoteOwnerData[0].broadcaster_name;
    const emoteOwnerProfile = await twitchApi.getUsers(emoteOwnerData[0].broadcaster_login);
    
    setEmoteSetInfo({
        name: emoteSetName,
      iconImg: emoteOwnerProfile.length > 0 ? emoteOwnerProfile[0].profile_image_url : '',
      });
    }

  const emoteList = emoteSet.emotes
    .map(em => <TwitchChatEmote key={`emote_${em.id}`} emoteId={em.id} emote={em} onclick={appendToChatBox} />);

    return (
    <div className="TwitchChatEmoteSet">
      <div className="emoteSetName">
        {
        emoteSetInfo.iconImg !== '' &&
        <CircleImg src={emoteSetInfo.iconImg} />
        }
      {emoteSetInfo.name}
      </div>
      <div className="emoteList">
      {emoteList}
      </div>
    </div>
    );
  }

export default TwitchChatClient;