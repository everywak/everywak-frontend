import React, { Component, useCallback, useState, useEffect, useMemo, useRef, PureComponent } from 'react';

import useInputs from '../../hooks/useInputs';

import TwitchChatClientCore from './TwitchChatClientCore';
import Spinner from '../../common/Components/Spinner';
import InsertEmoticonRoundedIcon from '@material-ui/icons/InsertEmoticonRounded';
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import BasicButton from '../../common/Components/Button/BasicButton';
import TransparentButton from '../../common/Components/Button/TransparentButton';
import CircleImg from '../../common/Components/CircleImg';
import CheckBox from '../../common/Components/CheckBox/CheckBox';

import * as func from '../../common/funtions';
import { Waktaverse } from '../../common/constants';

import styles from './TwitchChatClient.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const waktaverseLoginNames = Waktaverse.map(member => member.login_name);

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
      showFilteredChatView: false,
      onlyModerator: false,
      onlySubscriber: false,
      maxShowLength: 70,
      blacklist: [],
      whitelist: [],
    },
    openedEmotePicker: false,
    onSettingPanel: false,
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
        this.updateChatBoxHeight();
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

  setOnSettingPanel = state => {
    this.setState({
      onSettingPanel: state,
    });
  }

  setChatOptions = options => {
    this.setState({
      chatOptions: {
        ...this.state.chatOptions,
        ...options,
      }
    })
  }

  /**
   * Put emote name into chatbox
   * @see TwitchChatClient.chatInput
   */
  appendToChatBox = str => {
    const element = this.chatInput.current;
    if (element) {
      element.value += str;
      this.updateChatBoxHeight();
    }
  }

  updateChatBoxHeight = () => {
    const element = this.chatInput.current;
    if (element) {
      element.style.height = '0px';
      element.style.height = `${element.scrollHeight + 4}px`;
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
    const { chatList, chatOptions, oauthState, emoteSets, openedEmotePicker, onSettingPanel } = this.state;

    return (
      <div className="TwitchChatClient content">
        {
          oauthState == TwitchChatClientCore.LOGINED ?
          <React.Fragment>
            <header className="twitchChatHeader">
              채팅
            </header>
            <TwitchChatList chatList={chatList} options={{...chatOptions}} />
            {chatOptions.showFilteredChatView && <TwitchChatList className='filteredChatList' chatList={chatList} options={{whitelist: waktaverseLoginNames}} />}
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
              <TransparentButton className="twitchChatBtnSettingMobile" onClick={e => this.setOnSettingPanel(!onSettingPanel)}>
                <MoreVertIcon fontSize="small" />
              </TransparentButton>
              <div className="twitchChatInputFooter">
                <div className="inputFooterLeftWrapper">&nbsp;</div>
                <div className="inputFooterRightWrapper">
                  <TransparentButton className="twitchChatBtnSetting" onClick={e => this.setOnSettingPanel(!onSettingPanel)}>
                    <SettingsRoundedIcon fontSize="small" />
                  </TransparentButton>
                  <BasicButton className="twitchChatBtnSend" onClick={this.sendChat}>채팅</BasicButton>
                </div>
              </div>
              {openedEmotePicker && <TwitchChatEmotePicker emotes={emoteSets} getTwitchApi={this.chatCore.getTwitchApi} appendToChatBox={this.appendToChatBox} setOnModal={this.closeEmotePicker} />}
              {onSettingPanel && <TwitchChatSettingPanel setOnModal={this.setOnSettingPanel} chatOptions={chatOptions} onChange={this.setChatOptions} />}
            </div>
          </React.Fragment> :
          <div className="twitchChatLogin">
            {
              oauthState == TwitchChatClientCore.LOGOUTED ?
              <React.Fragment>
                <span className="loginTitle">로그인해서 팬치들과 함께 해요.</span>
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

/**
 * @typedef TwitchChatListOptions
 * @property {boolean} onlyModerator
 * @property {boolean} onlySubscriber
 * @property {number} maxShowLength
 * @property {string[]} blacklist
 * @property {string[]} whitelist
 */
/**
 * 
 * @param {{className?: string, chatList: array, options: TwitchChatListOptions}} props 
 */
function TwitchChatList({
  className,
  chatList = [], 
  options = {},
}) {

  const refList = useRef();
  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [chatList, autoScroll]);

  /**
   * Scroll chatList to bottom.
   */
  const scrollToBottom = useCallback(() => {
    const element = refList.current;
    if (element, element.scrollTop < -3) {
      element.scrollTo({
        //behavior: 'smooth',
        top: 0,
      });
    }
  }, [autoScroll]);

  const [autoScroll, setAutoScroll] = useState(true);

  /**
   * Handle auto scroll
   */
  const onScroll = useCallback(e => {
    const isScrollEnd = e.target.scrollTop > -4;
    if (isScrollEnd) {
      setAutoScroll(true);
      scrollToBottom();
    } else if (autoScroll) {
      setAutoScroll(false);
    }
  }, [refList.current, autoScroll]);
  useEffect(() => {
    refList.current && refList.current.addEventListener('scroll', onScroll);

    return () => refList.current && refList.current.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  const _options = {
    onlyModerator: false,
    onlySubscriber: false,
    maxShowLength: 70,
    blacklist: [],
    whitelist: [],
    ...options
  };

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

  const filteredChatList = filterChatList(chatList, _options);
  const cList = filteredChatList.map(chat => 
    chat.type === 'USERCHAT' ? 
    <TwitchChatUserChat key={chat.key} chatItem={chat} /> :
    <li key={chat.key} className="twitchChatItem sysMessage">
      <span className="chatContent">{chat.content}</span>
    </li>
  ).reverse();

  return (
    <div className={cx('TwitchChatList', className)}>
      <ul className="TwitchChatListWrapper" ref={refList}>
        {cList}
      </ul>
      {!autoScroll && <BasicButton className="twitchChatScrollToBottom" onClick={e => { setAutoScroll(true);scrollToBottom() }}>여기를 눌러 자동 스크롤</BasicButton>}
    </div>
  )
}
/**
 * @typedef TwitchChatItemData
 * @property {'USERCHAT'|'SYSMSG'} type
 * @property {object} tags
 * @property {string} userID
 * @property {{
 * color: string, badges: array, displayName: string, userID: string
 * }} profile
 * @property {array} content
 * @property {string} rawContent
 * @property {string} key
 */
/**
 * Twitch chat item
 * @param {{chatItem: TwitchChatItemData}} props 
 */
const TwitchChatUserChat = React.memo(({chatItem}) => {

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

  return (
    <li className="twitchChatItem">
      <span className="chatProfile">{useMemo(() => geneProfile(chatItem.profile), [chatItem])}</span>
      <span>: </span>
      <span className="chatContent">{geneContent(chatItem.content)}</span>
    </li>
  );
});

/**
 * @typedef TwitchChatOptions
 * @property {boolean} showFilteredChatView
 * @property {boolean} onlyModerator
 * @property {boolean} onlySubscriber
 * @property {number} maxShowLength
 * @property {string[]} blacklist
 * @property {string[]} whitelist
 */
/**
 * 채팅 설정 패널
 * 
 * @param {{chatOptions: TwitchChatOptions, onChange: (options: TwitchChatOptions) => void, setOnModal: (state: boolean) => void}} props 
 */
function TwitchChatSettingPanel({ chatOptions, onChange, setOnModal, }) {

  const [$chatOptions, $onChange] = useInputs({
    showFilteredChatView: chatOptions.showFilteredChatView,
    onlyModerator: chatOptions.onlyModerator,
    onlySubscriber: chatOptions.onlySubscriber,
    maxShowLength: chatOptions.maxShowLength,
  });

  useEffect(() => {
    if (chatOptions.showFilteredChatView != $chatOptions.showFilteredChatView ||
      chatOptions.onlyModerator != $chatOptions.onlyModerator ||
      chatOptions.onlySubscriber != $chatOptions.onlySubscriber ||
      chatOptions.maxShowLength !== $chatOptions.maxShowLength
    ) {
      onChange($chatOptions);
    }
  }, [$chatOptions]);

  return (
    <div className='TwitchChatSettingPanel'>
      <div className="TwitchChatSettingPanelDim" onClick={e => setOnModal(false)}/>
      <div className="TwitchChatSettingPanelContent">
        <header>
          <div className="dummy"></div>
          <span className='title'>채팅창 설정</span>
          <TransparentButton className='twitchChatBtnClose' onClick={e => setOnModal(false)}>
            <CloseRoundedIcon fontSize='small' />
          </TransparentButton>
        </header>
        <CheckBox label="구독자 채팅만 보기" name='onlySubscriber' value={$chatOptions.onlySubscriber} onChange={$onChange} fillContainer />
        <CheckBox label="매니저 채팅만 보기" name='onlyModerator' value={$chatOptions.onlyModerator} onChange={$onChange} fillContainer />
        <CheckBox label="왁타버스 멤버 채팅창 표시" name='showFilteredChatView' value={$chatOptions.showFilteredChatView} onChange={$onChange} fillContainer />
      </div>
    </div>
  );
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
 * @param {{emotes: TwitchChatEmoteItem[], getTwitchApi: function, appendToChatBox: function, setOnModal: (state: boolean) => void}} props 
 */
function TwitchChatEmotePicker ({emotes, getTwitchApi, appendToChatBox, setOnModal}) {

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
      <div className="TwitchChatEmotePickerDim" onClick={e => setOnModal(false)}/>
      <div className="TwitchChatEmotePickerContent">
        {emoteList}
      </div>
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