import React, { Component, useState, useEffect, useRef, PureComponent } from 'react';

import TwitchChatClientCore from './TwitchChatClientCore';
import Spinner from '../../common/Components/Spinner';
import InsertEmoticonRoundedIcon from '@material-ui/icons/InsertEmoticonRounded';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import BasicButton from '../../common/Components/Button/BasicButton';
import TransparentButton from '../../common/Components/Button/TransparentButton';
import CircleImg from '../../common/Components/CircleImg';

import * as func from '../../common/funtions';

import styles from './TwitchChatClient.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class TwitchChatClient extends PureComponent {

  static LIGHT = 100;
  static DARK  = 101;

  static defaultProps = {
    clientId: '',
    channelName: '',
    redirectUri: '',
    colorTheme: TwitchChatClient.LIGHT,
  };

  state = {
    oauthState: TwitchChatClientCore.LOGOUTED,
    chatList: [],
    chatOptions: {
      onlyModerator: false,
      onlySubscriber: false,
      maxShowLength: 70,
      blacklist: [],
      whitelist: [],
    },
    openedEmotePicker: false,
  };

  constructor(props) {
    super(props);

    this.chatCore = null;

    this.chatInput = React.createRef();
  }

  componentDidMount() {
    this.initTwitchChatCore();
  }

  initTwitchChatCore = () => {
    // create core instance
    this.chatCore = new TwitchChatClientCore({
      clientId: this.props.clientId, 
      channelName: this.props.channelName,
      onChangeOAuthState: this.onChangeOAuthState, 
      onChangeIRCState: this.onChangeIRCState,
      onUpdateEmoteSet: this.onUpdateEmoteSet, 
      onChat: this.onChat,
    });

    // get oauth token from cookie
    const { location, history } = this.props;
    const token = new URLSearchParams(location.hash.replace('#', '')).get('access_token');
    this.chatCore.loadClientOAuth(token);
    
    // remove token from url hash
    const { search, pathname } = location || {};
    func.setURLParams({
      history: history,
      pathname,
      query: func.getURLParams(search),
    })
  }
  
  cleanTwitchChatCore = () => {
    this.chatCore.close();
    this.chatCore = null;
  }

  onChangeOAuthState = state => {
    this.setState({
      oauthState: state,
    })
  }

  onChangeIRCState = state => {
  }

  onUpdateEmoteSet = emoteSets => {
    this.setState({
      emoteSets: emoteSets,
    });
  }

  onChat = e => {
    this.setState({
      chatList: e.chatList,
    });
  }

  sendChat = () => {
    if (this.chatInput.current) {
      const str = this.chatInput.current.value;
      if (this.chatCore.sendChat(str)) {
        this.chatInput.current.value = '';
      }
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
    if (prevProps.channelName != this.props.channelName) {
      this.chatCore.setChannelName(this.props.channelName);
    }
    
  }

  componentWillUnmount() {
    this.cleanTwitchChatCore();
  }

  render() {
    const { clientId, redirectUri } = this.props;
    const { chatList, chatOptions, oauthState, emoteSets, openedEmotePicker } = this.state;

    return (
      <div className="TwitchChatClient content">
        {
          oauthState == TwitchChatClientCore.LOGINED ?
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
                  onKeyPress={e => {if(e.key == 'Enter') { e.preventDefault(); this.sendChat() } }}
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
              {openedEmotePicker && <TwitchChatEmotePicker emotes={emoteSets} getTwitchApi={this.chatCore.getTwitchApi} appendToChatBox={this.appendToChatBox} />}
            </div>
          </React.Fragment> :
          <div className="twitchChatLogin">
            {
              oauthState == TwitchChatClientCore.LOGOUTED ?
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

let ignoreNextScroll = 0;

function TwitchChatList({
  chatList = [], 
  options = {},
}) {

  const refList = useRef();
  useEffect(() => {
    if (autoScroll) {
      setTimeout(scrollToBottom, 50);
    }
  }, [chatList, autoScroll]);

  /**
   * Scroll chatList to bottom.
   */
  function scrollToBottom() {
    const element = refList.current;
    if (element) {
      ignoreNextScroll = 5;
      element.scrollTo({
        //behavior: 'smooth',
        top: element.scrollHeight,
      });
    }
  }

  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {

    const onScroll = e => {
      if (!ignoreNextScroll) {
        const isScrollEnd = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
        if (!autoScroll && isScrollEnd) {
          setAutoScroll(true);
        } else {
          setAutoScroll(false);
        }
      } else {
        ignoreNextScroll = Math.max(ignoreNextScroll - 1, 0);
      }
    }
    refList.current && refList.current.addEventListener('scroll', onScroll);

    return () => refList.current && refList.current.removeEventListener('scroll', onScroll);
  }, [refList.current, autoScroll]);

  const _options = Object.assign({
    onlyModerator: false,
    onlySubscriber: false,
    maxShowLength: 70,
    blacklist: [],
    whitelist: [],
  }, options);

  function filterChatList(list, opt) {
    let filteredChatList = list;
    if(opt.whitelist.length > 0) {
      filteredChatList = filteredChatList.filter(item => item.type === 'SYSMSG' || opt.whitelist.includes(item.userId));
    }
    if(opt.blacklist.length > 0) {
      filteredChatList = filteredChatList.filter(item => item.type === 'SYSMSG' || !opt.blacklist.includes(item.userId));
    }
    if(opt.onlyModerator) {
      filteredChatList = filteredChatList.filter(item => item.type === 'SYSMSG' || item.tags.mod == '1' || opt.whitelist.includes(item.userId));
    }
    if(opt.onlySubscriber) {
      filteredChatList = filteredChatList.filter(item => item.type === 'SYSMSG' || item.tags.subscriber == '1');
    }

    return filteredChatList.slice(Math.max(filteredChatList.length + 1 - opt.maxShowLength, 0));
  }

  function geneProfile({ color, badges, displayName, userID }) {
    return (
    <span className="chatProfileWrapper" style={{color: color}}>
      {geneBadgeList(badges)}
      <span className="nickname">{displayName}</span><span className="userid">{displayName != userID ? `(${userID})` : ''}</span>
    </span>
    );
  }

  function geneBadgeList(badgeList) {
    return badgeList.map(badge => badge && <TwitchChatBadge key={badge.id} src_1x={badge.src_1x} src_2x={badge.src_2x} src_3x={badge.src_2x} />);
  }
  function geneContent(content) {
    return content.map(item => typeof item === 'string' ? item : <TwitchChatEmote emoteId={item.emoteId} />);
  }

  const filteredChatList = filterChatList(chatList, _options);
  const cList = filteredChatList.map(c => 
    c.type === 'USERCHAT' ? 
    <li key={c.key} className="twitchChatItem">
      <span className="chatProfile">{geneProfile(c.profile)}</span>
      <span>: </span>
      <span className="chatContent">{geneContent(c.content)}</span>
    </li> :
    <li key={c.key} className="twitchChatItem sysMessage">
      <span className="chatContent">{c.content}</span>
    </li>
  );

  return (
    <div className="TwitchChatList">
      <ul className="TwitchChatListWrapper" ref={refList}>
        {cList}
      </ul>
      {!autoScroll && <BasicButton className="twitchChatScrollToBottom" onClick={e => setAutoScroll(true)}>여기를 눌러 자동 스크롤</BasicButton>}
    </div>
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
 * @param {{emotes: TwitchChatEmoteItem[], getTwitchApi: function, appendToChatBox: function}} props 
 */
function TwitchChatEmotePicker ({emotes, getTwitchApi, appendToChatBox}) {

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
    ].map(([emoteSetId, emoteSet]) => <TwitchChatEmoteSet emoteSet={emoteSet} getTwitchApi={getTwitchApi} appendToChatBox={appendToChatBox} />);

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
 * @param {{emoteSet: EmoteSetItem, getTwitchApi: function, appendToChatBox: function}} props 
 */
function TwitchChatEmoteSet({emoteSet, getTwitchApi, appendToChatBox}) {

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

    const emoteOwnerData = await getTwitchApi().getChannelInfo(emoteSet.owner_id);

    if (emoteOwnerData.length === 0) {
      setEmoteSetInfo({
        iconImg: '',
        name: '알 수 없는 이모티콘',
      });
      return;
    }

    const emoteSetName = emoteOwnerData[0].broadcaster_name;
    const emoteOwnerProfile = await getTwitchApi().getUsers(emoteOwnerData[0].broadcaster_login);
    
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