import React, { Component } from 'react';
import { Fragment } from 'react';
import styles from './Live.scss';

import Footer from '../../common/Footer/Footer.js';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const domain = 'localhost';//'everywak-ajkkd.run.goorm.io';
const TOGGLE = -1;
const PORTRAIT = 0;
const LANDSCAPE = 1;
const DARK = 10;
const WHITE = 11;

const LiveContext = React.createContext({
  rotation: PORTRAIT,
  setRotation: () => {},
  chatStyle: DARK,
  expandHeader: false,
  toggleExpandHeader: () => {},
  expandScreen: false,
  toggleExpandScreen: () => {},
});

class Live extends Component {
  static defaultProps = {
    front: false
  };

  state = {
    rotation: PORTRAIT,
    setRotation: () => {},
    chatStyle: DARK,
    expandHeader: false,
    expandScreen: false,
  };

  constructor (props) {
    super(props);
    if (!props.front) {
      document.title = '에브리왁굳 : 생방송';
    }
    this.setRotation = val => {
      this.setState({rotation: val === TOGGLE ? !this.state.rotation : val});
    }
  };

  componentDidMount() {
	  if (!this.props.front) {
      this.setRotation(window.innerWidth < window.innerHeight ? PORTRAIT : LANDSCAPE);

      window.addEventListener('resize', () => {
        this.setRotation(window.innerWidth < window.innerHeight ? PORTRAIT : LANDSCAPE);
      });
    }
    this.setState({
      setRotation: this.setRotation,
    });
  }

  render() {
    const { front } = this.props;
    const { rotation } = this.state;
    
    return (
      <LiveContext.Provider value={this.state} >
        <div className={cx('Live', {'front': this.props.front}, {'landscape': rotation == LANDSCAPE}, {'portrait': rotation == PORTRAIT})}>
          {front ?
            <Fragment>
              <WakPlayer key="wakplayer" />
              <LiveSummary />
            </Fragment> :
            <Fragment>
              <div className="playerWrapper">
                <WakPlayer key="wakplayer" />
                <LiveSummary />
                <BroadcastInfo />
                <Footer />
              </div>
              <TwitchChat />
            </Fragment>
          }
        </div>
      </LiveContext.Provider>
    );
  }
}

class WakPlayer extends Component {

  render() {
	const src = `https://player.twitch.tv/?channel=woowakgood&parent=${domain}`;

    return (
      <div className="WakPlayer">
        <div className="content">
          <iframe className="stream" src={src} frameBorder="0" allowFullScreen={true} scrolling="no"/>
        </div>
      </div>
    );
  }
}

class LiveSummary extends Component {

  render() {
    const channelName = '우왁굳';
    const broadcastName = 'Twitch';

    return (
      <div className="LiveSummary">
        <div className="left">
          <div className="liveProfile" >
            <img src="" />
          </div>
          <div className="liveSummaryWrapper" >
            <span className="liveTitle">뭐? 뱅온이 없다고?</span>
            <span className="liveDateTime">13일 전</span>
            <span className="livePresented">
              <span className="channelName">{channelName}</span>
              &nbsp;on&nbsp;
              <span className="broadcastName">{broadcastName}</span>
            </span>
          </div>
        </div>
        <div className="right">
        player time
        </div>
      </div>
    );
  }
}

class BroadcastInfo extends Component {
  
  render() {

    return (
      <div className="BroadcastInfo">
        <div className="panelContainer">
          <a href="https://toon.at/donate/637445810791017450" target="_blank"><img src="https://everywak.kr/live/images/panel-donate2.png" alt="투네이션" /></a>
          <a href="https://cafe.naver.com/steamindiegame" target="_blank"><img src="https://everywak.kr/live/images/panel-wakki.png" alt="우왁끼" /></a>
        </div>
        <p class="footerTxt">
          에브리왁굳 우왁굳 생방송 페이지는 YouTube 및 Twitch의 서드파티 사이트로 YouTube 및 Twitch에서 운영하는 사이트가 아닙니다.<br/>
          'YouTube' 및 '유튜브'는 YouTube, LLC의 등록상표이며 'Twitch' 및 '트위치'는 Twitch Interactive, Inc.의 등록상표입니다.<br/>
          &nbsp;<br/>
          에브리왁굳 © 2020-2021. <a href="https://github.com/wei756" class="copyrighter_site_footer">Wei756</a>. All rights reserved.
        </p>
      </div>
    );
  }
}

class TwitchChat extends Component {

  static contextType = LiveContext;
  sizeController = React.createRef();
  sizeControlWrapper = React.createRef();
  sizeControlOverlay = React.createRef();

  state = {
    chatWidth: 320,
  }

  minChatWidth = 180;

  componentDidMount() {
    this.lastScrollX = 0;
    this.lastWidth = this.state.chatWidth;
    this.newWidth = this.state.chatWidth;
    this.dragged = false;
    document.addEventListener('mousemove', e => { if (this.dragged) { this.onDragCtrl(e); } });
    document.addEventListener('mouseup', this.onDragEndCtrl);
  }

  setChatWidth = w => { this.setState({chatWidth: w}); }

  onDragStartCtrl = e => {
    this.lastScrollX = e.pageX;
    this.lastWidth = this.state.chatWidth;
    this.setDragged(true);
    const ctrOverlay = this.sizeControlOverlay.current;
    ctrOverlay.style.width = this.lastWidth + 'px';
  };
  onDragCtrl = e => {
    e.preventDefault();
    const w = Math.max(this.lastWidth - (e.pageX - this.lastScrollX), this.minChatWidth) - this.lastWidth;
    this.newWidth = this.lastWidth + w;
    const ctrOverlay = this.sizeControlOverlay.current;
    ctrOverlay.style.width = this.newWidth + 'px';
    this.setControllerPos(-8 - w);
  };
  onDragEndCtrl = e => {
    if (this.dragged) {
      this.setChatWidth(this.newWidth);
      this.setControllerPos(false);
      this.setDragged(false);
    }
  };

  setDragged = bool => {
    this.dragged = bool;
    const ctrWrapper = this.sizeControlWrapper.current;
    if (bool) {
      if (!ctrWrapper.classList.contains('dragged')) {
        ctrWrapper.classList.add('dragged');
      }
    } else {
      if (ctrWrapper.classList.contains('dragged')) {
        ctrWrapper.classList.remove('dragged');
      }
    }
  };
  
  setControllerPos = l => {
    const ctr = this.sizeController.current;
    ctr.style.left = l ? l + 'px' : '';
  };

  render() {
    const { chatStyle, rotation } = this.context;
    const src = `https://www.twitch.tv/embed/woowakgood/chat?parent=${domain}${chatStyle === 'DARK' ? '&darkpopout' : ''}`;
    const style = rotation === LANDSCAPE ? { // landscape only
      width: `${this.state.chatWidth}px`
    } : {};

    return (
      <div className="TwitchChat" style={style}>
        <iframe className="content" src={src} frameBorder="0" />
        <div className="sizeController" ref={this.sizeController} onMouseDown={this.onDragStartCtrl} ></div>
        <div className="sizeControlWrapper" ref={this.sizeControlWrapper} >
          <div className="sizeControlOverlay" ref={this.sizeControlOverlay} ></div>
        </div>
      </div>
    );
  }
}

export default Live;