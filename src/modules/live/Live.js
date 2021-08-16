import React, { Component } from 'react';
import { Fragment } from 'react';
import styles from './Live.scss';

import { domain, TOGGLE, CLOSED, OPENED, EXPANDED, DARK, LIGHT, LANDSCAPE, PORTRAIT } from '../../common/constants';
import Footer from '../../common/Footer/Footer.js';
import Button from '../../common/Components/Button';
import RemoveRedEyeRoundedIcon from '@material-ui/icons/RemoveRedEyeRounded';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@material-ui/icons/ExpandLessRounded';
import { LiveContext } from './context';
import TwitchChat from './TwitchChat';
import WakPlayer from './WakPlayer';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

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
    playerOverlay: CLOSED,
    setPlayerOverlay: () => {},
  };

  constructor (props) {
    super(props);
    if (!props.front) {
      document.title = '에브리왁굳 : 생방송';
    }
    this.setRotation = val => {
      const rot = val === TOGGLE ? !this.state.rotation : val;
      this.setState({rotation: rot});
      if (rot === PORTRAIT) {
        document.getElementsByClassName('App')[0].classList.remove('live');
      } else if (rot === LANDSCAPE) {
        document.getElementsByClassName('App')[0].classList.add('live');
      }
    }
    this.setAutoRotation = () => { this.setRotation(window.innerWidth < window.innerHeight ? PORTRAIT : LANDSCAPE); };
    this.setPlayerOverlay = val => {
      this.setState({
        playerOverlay: val === TOGGLE ? !this.state.playerOverlay : val,
      });
    };
  };

  componentDidMount() {
	  if (!this.props.front) {
      this.setAutoRotation();

      window.addEventListener('resize', this.setAutoRotation);
    }
    this.setState({
      setRotation: this.setRotation,
      setPlayerOverlay: this.setPlayerOverlay,
    });
    this.forceUpdate();
    setTimeout(() => {
      this.setAutoRotation();
    }, 1);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.rotation !== nextState.rotation || 
          this.state.playerOverlay !== nextState.playerOverlay;
  }

  componentWillUnmount() {
    document.getElementsByClassName('App')[0].classList.remove('live');
    window.removeEventListener('resize', this.setAutoRotation);
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
              <div className={cx('playerWrapper', {opened: this.state.playerOverlay === OPENED, expanded: this.state.playerOverlay === EXPANDED})}>
                <WakPlayer key="wakplayer" />
                <LiveSummary />
                <BroadcastInfo />
                <Footer />
              </div>
              <TwitchChat location={this.props.location} history={this.props.history} />
            </Fragment>
          }
        </div>
      </LiveContext.Provider>
    );
  }
}

class LiveSummary extends Component {
  static contextType = LiveContext;

  render() {
    const channelName = '우왁굳';
    const broadcastName = 'Twitch';
    const { playerOverlay, setPlayerOverlay } = this.context;

    return (
      <div className={cx('LiveSummary', {opened: playerOverlay === OPENED, expanded: playerOverlay === EXPANDED})}>
        <div className="left">
          <div className="liveProfile">
            <div className="profileWrapper">
              <div className="imgWrapper">
                <img src="https://static-cdn.jtvnw.net/jtv_user_pictures/ebc60c08-721b-4572-8f51-8be7136a0c96-profile_image-300x300.png" alt="" className="profileImg"/>
              </div>
            </div>
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
          <div className="up">
            <ViewerCounter viewer={3123} />
            <StreamTime startedTime={1626760233748} />
          </div>
          <div className="down">
            <Button 
              className="btnOpenInfo"
              href="" 
              iconSrc={
                playerOverlay === EXPANDED ? 
                <ExpandLessRoundedIcon fontSize="medium" /> : 
                <ExpandMoreRoundedIcon fontSize="medium" />
              } 
              labelBGColor="transparent" 
              onclick={e => setPlayerOverlay(playerOverlay === EXPANDED ? CLOSED : EXPANDED)} />
          </div>
        </div>
      </div>
    );
  }
}

class ViewerCounter extends Component {
  static defaultProps = {
    viewer: 0,
  };

  render() {
    const formattedViewer = this.props.viewer.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');

    return (
      <div className="ViewerCounter">
        <RemoveRedEyeRoundedIcon  fontSize="small" />
        <span className="counterWrapper">
          {formattedViewer}
        </span>
      </div>
    );
  }
}

class StreamTime extends Component {
  static defaultProps = {
    startedTime: Date.now(),
  };

  state = {
    streamSeconds: 0,
  };

  componentDidMount() {
    this.loopTimer = setInterval(this.updateTimer, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.loopTimer);
  }

  updateTimer = () => {
    const currTime = Date.now();
    const streamSeconds = parseInt((currTime - this.props.startedTime) / 1000);
    if (this.state.streamSeconds != streamSeconds) {
      this.setState({
        streamSeconds: streamSeconds,
      });
    }
  }

  formatInt = n => {
    return ('0' + parseInt(n).toString()).slice(-2);
  }

  render() {
    const { streamSeconds } = this.state;
    const hours = parseInt(streamSeconds / 3600);
    const minutes = parseInt(streamSeconds / 60) % 60;
    const seconds = streamSeconds % 60;
    const formattedTime = `${hours}:${this.formatInt(minutes)}:${this.formatInt(seconds)}`;

    return (
      <div className="StreamTime">
        {formattedTime}
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
        <p className="footerTxt">
          에브리왁굳 우왁굳 생방송 페이지는 YouTube 및 Twitch의 서드파티 사이트로 YouTube 및 Twitch에서 운영하는 사이트가 아닙니다.<br/>
          'YouTube' 및 '유튜브'는 YouTube, LLC의 등록상표이며 'Twitch' 및 '트위치'는 Twitch Interactive, Inc.의 등록상표입니다.<br/>
          &nbsp;<br/>
          에브리왁굳 © 2020-2021. <a href="https://github.com/wei756" className="copyrighter_site_footer">Wei756</a>. All rights reserved.
        </p>
      </div>
    );
  }
}

export default Live;