import React, { Component } from 'react';

import { Cookies } from 'react-cookie';

import Spinner from '../../common/Components/Spinner';
import InsertEmoticonRoundedIcon from '@material-ui/icons/InsertEmoticonRounded';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';

import TwitchApi from '../../services/TwitchApi';

import styles from './TwitchChatClient.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const cookies = new Cookies();

const setCookie = (name, value, option) => cookies.set(name, value, { ...option })
const getCookie = name => cookies.get(name)

class TwitchChatClient extends Component {

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
    chatItemMaximumLength: 50,
    openedEmotePicker: false,
  };

  constructor(props) {
    super(props);

    this.IRCStatus  = TwitchChatClient.CLOSED;

    this.selfInfo = '';
    this.lastMessage = '';

    this.badges = {};
    this.emoteSets = [];

    this.twitchApi = null;

    this.twitchChatList = React.createRef();
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
            console.log('Channel chat joined.');
            const twitchApi = this.getTwitchApi();
            const user = await twitchApi.getUsers(this.props.channelName);
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
    switch(data[2]) {
      case 'PRIVMSG':
        this.receiveChat({tag: data[0], id: data[1], msg: data[3].split(':').length > 1 ? data[3].split(':')[1] : data[3]});
        break;
      case 'USERSTATE':
        this.updateSelfInfo(data);
        break;
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

    if (this.lastMessage) {
      this.receiveChat({tag: this.selfInfo + ';id=my-chat-' + (Math.random() * 9999999), id: data[3] + '!', msg: this.lastMessage, mine: true});
    }
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
      this.lastMessage = str;
      this.sendMessage(`PRIVMSG #${this.props.channelName} :${str}`);
      this.chatInput.current.value = '';
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
    }
  }

  /**
   * Append chatItem to chatList.
   * 
   * @see TwitchChatClient.receiveChat
   * @param {Object} chat A chat to append
   */
  appendToChatList = chat => {
    const { chatList, chatItemMaximumLength } = this.state;
    this.setState({
      chatList: [...chatList, chat].slice(Math.max(chatList.length + 1 - chatItemMaximumLength, 0)),
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
   * Scroll chatList to bottom.
   */
  scrollToBottom = () => {
    const element = this.twitchChatList.current;
    if (element) {
      element.scrollTo({
        behavior: 'smooth',
        top: element.scrollHeight,
      });
    }
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

  render() {
    const { clientId, redirectUri } = this.props;
    const { chatList, oauthState, openedEmotePicker } = this.state;
    const cList = chatList.map(c => 
      <li key={c.key} className="twitchChatItem">
        <span className="chatProfile">{c.profile}</span>
        <span>: </span>
        <span className="chatContent">{c.content}</span>
    </li>
    );

    return (
      <div className="TwitchChatClient content">
        {
          oauthState == TwitchChatClient.LOGINED ?
          <React.Fragment>
            <header className="twitchChatHeader">
              채팅
            </header>
            <ul className="twitchChatList" ref={this.twitchChatList}>
              {cList}
            </ul>
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
                <button className="twitchChatButton twitchChatBtnEmote" onClick={e => this.toggleEmotePicker()}>
                  <InsertEmoticonRoundedIcon fontSize="small" />
                </button>
              </div>
              <div className="twitchChatInputFooter">
                <div className="inputFooterLeftWrapper">&nbsp;</div>
                <div className="inputFooterRightWrapper">
                  <button className="twitchChatButton twitchChatBtnSetting">
                    <SettingsRoundedIcon fontSize="small" />
                  </button>
                  <button className="twitchChatButton twitchChatBtnSend" onClick={this.sendChat}>채팅</button>
                </div>
              </div>
              {openedEmotePicker && <TwitchChatEmotePicker emotes={this.emoteSets} twitchApi={this.getTwitchApi()} appendToChatBox={this.appendToChatBox} />}
            </div>
          </React.Fragment> :
          <div className="twitchChatLogin">
            {
              oauthState == TwitchChatClient.LOGOUTED ?
              <React.Fragment>
                <span className="loginTitle">트위치로 로그인해주세요.</span>
                <a className="twitchChatButton btnLoginTwitch" href={`https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=chat:edit chat:read channel:read:predictions`}>로그인</a>
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

class TwitchChatEmotePicker extends Component {

  static defaultProps = {
    emotes: [
      {
        id: "emotesv2_031bf329c21040a897d55ef471da3dd3",
        name: "Jebasted",
        images:
        {
          url_1x: "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_031bf329c21040a897d55ef471da3dd3/static/light/1.0",
          url_2x: "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_031bf329c21040a897d55ef471da3dd3/static/light/2.0",
          url_4x: "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_031bf329c21040a897d55ef471da3dd3/static/light/3.0",
        },
        emote_type: "globals",
        emote_set_id: "0",
        owner_id: "0",
        format: ["static"],
        scale: ["1.0","2.0","3.0"],
        theme_mode: ["light","dark"],
      },
    ],
    twitchApi: null,
    appendToChatBox: null,
  };

  state = {
    recents: [
      {
        id: "245",
        name: "ResidentSleeper",
      },
    ]
  }

  constructor() {
    super();

    this.groupedEmotes = {};
  }

  groupEmotes = emotes => {
    const grouped = {};

    grouped.recents = {
      name: 'Recent used',
      emotes: this.state.recents,
    }

    for(let emote of emotes) {

      // generate new emote set
      if (!grouped[emote.emote_set_id]) {
        grouped[emote.emote_set_id] = {
          name: emote.emote_set_id,
          emotes: [],
        }
      }
      const emoteSet = grouped[emote.emote_set_id];

      emoteSet.emotes.push(emote);
    }

    return grouped;
  }

  render() {
    const { emotes, appendToChatBox } = this.props;
    this.groupedEmotes = this.groupEmotes(emotes);
    const emoteList = 
      Object.entries(this.groupedEmotes).reverse().map(([emoteSetId, emoteSet]) => <TwitchChatEmoteSet emoteSet={emoteSet} appendToChatBox={appendToChatBox} />);

    return (
      <div className='TwitchChatEmotePicker'>
        {emoteList}
      </div>
    );
  }
}

class TwitchChatEmoteSet extends Component {
  static defaultProps = {
    emoteSet: {
      name: 'EmoteSet',
      emotes: [],
    },
    appendToChatBox: null,
  }

  render() {
    const { emoteSet, appendToChatBox } = this.props;

    return (
    <div className="TwitchChatEmoteSet">
      <div className="emoteSetName">{emoteSet.name}</div>
      <div className="emoteList">
        {emoteSet.emotes.map(em => <TwitchChatEmote key={`emote_${em.id}`} emoteId={em.id} emote={em} onclick={appendToChatBox} />)}
      </div>
    </div>
    );
  }
}

export default TwitchChatClient;