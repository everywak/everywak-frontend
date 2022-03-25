import React, { Component } from 'react';

import WakPlayerVolumeBar from './WakPlayer/WakPlayerVolumeBar';

import { domain } from '../../common/constants';

import { TwitchPlayer } from 'react-twitch-embed';
import { LiveContext } from './context';

import styles from './WakPlayer.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class WakPlayer extends Component {

  static defaultProps = {
    channelId: '',
    onChangeOverlayState: ({expanded, opened}) => {},
  }

  state = {
    broadcaster: 'none',
    player: null,
    onlineState: true,
  };

  constructor (props) {
    super(props);
    this.embed = null;

    this.playerContext = new WakPlayerContext();
    this.playerContext.subscribe(this);
  }

  onTwitchReady = player => {
    if (this.state.broadcaster === 'twitch') {
      this.playerContext && this.playerContext.notify({
        type: 'READY_PLAYER',
        value: this.state.broadcaster,
        player: player
      })
      this.setState({
        player: player,
      })
      //console.log(player.getQualities());
    }
  }

  onTwitchPlay = () => {
    this.playerContext.notify({
      type: 'CHANGE_PLAYERSTATE',
      value: 'PLAY'
    })
  }
  onTwitchPlaying = () => {
    this.playerContext.notify({
      type: 'CHANGE_PLAYERSTATE',
      value: 'PLAYING'
    })
  }
  onTwitchPause = () => {
    this.playerContext && this.playerContext.notify({
      type: 'CHANGE_PLAYERSTATE',
      value: 'PAUSE'
    })
  }
  onTwitchOnline = () => {
    this.playerContext.notify({
      type: 'CHANGE_ONLINESTATE',
      value: 'ONLINE'
    })
  }
  onTwitchOffline = () => { // TODO: 오프라인시 임베드 제거하고 오프라인 이미지 표시하는 등 최적화 처리할 것
    this.playerContext.notify({
      type: 'CHANGE_ONLINESTATE',
      value: 'OFFLINE'
    })
  }

  componentDidMount() {
    this.setState({
      broadcaster: 'twitch',
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.broadcaster === 'twitch' &&
      (nextState.broadcaster !== this.state.broadcaster || 
      nextProps.channelId !== this.props.channelId)) {
      this.embed = <TwitchPlayer className="stream" channel={this.props.channelId} parent={[domain]} 
                      width="100%" height="100%" hideControls={true} muted={true} 
                      onReady={this.onTwitchReady} onPlay={this.onTwitchPlay} onPlaying={this.onTwitchPlaying} onPause={this.onTwitchPause} 
                      onOnline={this.onTwitchOnline} onOffline={this.onTwitchOffline} />
    }
    return nextState.broadcaster !== this.state.broadcaster || 
      nextState.player !== this.state.player || 
      nextState.onlineState !== this.state.onlineState ||
      nextProps.channelId !== this.props.channelId;
  }

  render() {
    const {
      onChangeOverlayState
    } = this.props;
    const {
      broadcaster, player, onlineState, 
    } = this.state;

    return (
      <div className="WakPlayer">
        <div className="content">
          {this.embed}
          <WakPlayerOverlay broadcaster={broadcaster} player={player} playerContext={this.playerContext} onChangeOverlayState={onChangeOverlayState} />
        </div>
      </div>
    );
  }
}

class WakPlayerOverlay extends Component {
  static contextType = LiveContext;

  static defaultProps = {
    broadcaster: 'none',
    player: null,
    playerContext: null,
    onChangeOverlayState: ({opened, expanded}) => {},
  };

  state = {
    playerState: 'STOP',
    settingPanel: 'CLOSED',
    qualities: [],
    quality: 'Auto', 
    volume: 50,
    muted: false,
    opened: false,
    expanded: false,
  };
  
  constructor (props) {
    super(props);

    this.overlayLife = 0;
    this.props.playerContext && this.props.playerContext.subscribe(this);
  }

  onNotified = e => {
    console.log(e)
    if (e.type == 'CHANGE_PLAYERSTATE' && e.value !== this.state.playerState) {
      console.log(e.value)
      this.setState({
        playerState: e.value
      });
    }
  }

  /**
   * 마우스 호버 후 자동 오버레이 숨김 구현을 위한 루프
   */
  loopOverlayLife = () => {
    if (this.overlayLife > 0 && this.overlayLife - 50 <= 0) {
      this.close();
    }
    this.overlayLife = this.state.settingPanel === 'CLOSED' ? Math.max(this.overlayLife - 50, 0) : 100;
  }

  /**
   * 오버레이를 표시합니다.
   */
  open = () => {
    if (!this.state.opened) {
      this.setState({
        opened: true,
      });
    }
    this.overlayLife = 3000;
  }
  /**
   * 오버레이를 숨깁니다.
   */
  close = () => {
    if (this.state.opened) {
      this.setState({
        opened: false,
      });
    }
    this.overlayLife = 0;
  }

  onChangeOverlayState = () => {
    const {
      opened, expanded
    } = this.state;
    this.props.onChangeOverlayState && 
    this.props.onChangeOverlayState({
      opened: opened,
      expanded: expanded,
    });
  }

  /**
   * 스트림을 재생합니다.
   */
  play = () => {
    const {
      broadcaster, player,
    } = this.props;

    if (broadcaster !== 'none' && player) {
      player.play();
    }
  }
  /**
   * 스트림을 일시정지합니다.
   */
  pause = () => {
    const {
      broadcaster, player,
    } = this.props;

    if (broadcaster !== 'none' && player) {
      player.pause();
    }
  }
  /**
   * 스트림을 새로고침합니다.
   */
  refresh = () => {
    const {
      broadcaster, player,
    } = this.props;

    if (broadcaster !== 'none' && player) {
      player.pause();
      player.play();
    }
  }

  /**
   * 스트림 화질 목록을 불러옵니다.
   */
  getQualities = () => {
    if (this.props.player) {
      this.setState({
        qualities: this.props.player.getQualities(),
      });
      console.log(this.props.player.getQualities());
    }
  }
  /**
   * 스트림 화질을 설정합니다.
   * 
   * @param {string} val
   */
  setQuality = val => {
    if (this.props.player) {
      this.props.player.setQuality(val);
      this.setState({
        quality: val,
      })
    }
    this.setSettingPanel('MAIN');
  }

  /**
   * 플레이어 터치 시 이벤트를 핸들링합니다.
   */
  onTouch = e => {
    if (!(e.target == e.currentTarget || e.target.className === 'bottom')) {return;}
    const touchedState = this.state.opened;
    setTimeout(() => {
      if (touchedState !== this.state.opened) {return;}

      if (!this.state.opened) {
        this.open();
      } else if (this.state.opened && this.state.settingPanel == 'CLOSED') {
        this.close();
      }
    }, 200);
  }

  onChangeVolumeHandler = val => {
    this.setVolume(val);
  }
  
  /**
   * 스트림의 볼륨을 설정합니다.
   * 
   * @param {number} val 0~100 사이 정수
   */
  setVolume = val => {
    const newVolume = parseInt(val);
    if (this.state.volume !== newVolume) {
      this.setState({
        volume: newVolume
      });
    }
  }
  
  /**
   * 스트림을 음소거합니다.
   * 
   * @param {boolean} newMuted
   */
  setMuted = newMuted => {
    if (this.state.muted !== newMuted) {
      this.setState({
        muted: newMuted
      });
    }
  }
  
  /**
   * 스트림의 음소거 상태를 전환합니다.
   * 
   * @param {boolean} newMuted
   */
  toggleMuted = () => {
    this.setState({
      muted: !this.state.muted
    });
  }

  setSettingPanel = panel => {
    const prevPanel = this.state.settingPanel;
    if (prevPanel !== panel && prevPanel === 'CLOSED') {
      this.getQualities();
    }
    console.log(panel);
    this.setState({
      settingPanel: panel,
    })
  }
  
  componentDidMount() {
    this.loopOverlay = setInterval(this.loopOverlayLife, 50);
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      player
    } = this.props;

    if (player) {
      if (prevState.volume !== this.state.volume) { // 볼륨 변화 처리 
        player.setVolume(this.state.volume / 100);
      }
      if (prevState.muted !== this.state.muted) { // 음소거 변화 처리
        player.setMuted(this.state.muted);
      }
      if (prevProps.player !== this.props.player) { // player ready
        this.setState({
          qualities: player.getQualities(),
          volume: parseInt(player.getVolume() * 100),
          muted: player.getMuted(),
        });
      }
    }

    // 오버레이 상태 변경 감지
    if (prevState.opened !== this.state.opened ||
      prevState.expanded !== this.state.expanded) {
        
      this.onChangeOverlayState();
    }

  }

  componentWillUnmount() {
    clearInterval(this.loopOverlay);
  }

  render() {
    const {  } = this.props;
    const {
      volPressed, settingPanel, quality, qualities, volume, muted, playerState, opened, expanded,
    } = this.state;

    const qualityList = {
      'Auto': '자동',
      'chunked': '원본 화질',
      '1080p60 (source)': '1080p60 (원본)',
      '1080p60': '1080p60',
      '720p60': '720p60',
      '720p60 (source)': '720p60 (원본)',
      '720p': '720p',
      '480p': '480p',
      '360p': '360p',
      '160p': '160p',
    }
    const videoQualityList = qualities.map(q => <li className="item vq" data-vq={q.name.indexOf('(source)') === -1 ? q.name : 'chunked'} onClick={e => this.setQuality(e.currentTarget.dataset.vq)}>{qualityList[q.name] || q.name}</li>);

    return (
      <div className={cx('WakPlayerOverlay', 'overlayArea', {opened: (opened || expanded || volPressed || settingPanel !== 'CLOSED')})} 
        onMouseMove={this.open} 
        onMouseLeave={this.close} >
        <div className="controller" onTouchEnd={this.onTouch}>
          <div className="bottom">
            <div className="bottomLeft">
              <span className={cx('ctlBtn', 'playpause', {paused: !(playerState === 'PLAYING' || playerState === 'PLAY')})} onClick={e => {playerState === 'PLAYING' ? this.pause() : this.play()}}>
                <svg viewBox="0 0 24 24" fill="white" width="24px" height="24px" className="play"><path d="M0 0h24v24H0z" fill="none"/><path d="M8 5v14l11-7z"/></svg>
                <svg viewBox="0 0 24 24" fill="white" width="24px" height="24px" className="pause"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              </span>
              <span className="ctlBtn sync" onClick={this.refresh}>
                <svg viewBox="0 0 24 24" fill="white" width="24px" height="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
              </span>
              <span className={cx('ctlBtn', 'volume')} onClick={this.toggleMuted}>
                {
                  muted || volume === 0 ?
                  <svg viewBox="0 0 24 24" fill="white" width="24px" height="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg> :
                  volume <= 50 ? 
                  <svg viewBox="0 0 24 24" fill="white" width="24px" height="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg> :
                  <svg viewBox="0 0 24 24" fill="white" width="24px" height="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                }
              </span>
              <WakPlayerVolumeBar value={muted ? 0 : volume} onChangeValue={this.onChangeVolumeHandler} onChangePressed={val => {}} />
            </div>
            <div className="bottomRight">
              <span className="ctlBtn setting" onClick={e => { this.setSettingPanel(settingPanel === 'CLOSED' ? 'MAIN' : 'CLOSED') }}>
              <svg enableBackground="new 0 0 24 24" viewBox="-2 -2 28 28" fill="white" width="24px" height="24px"><g><path d="M0,0h24v24H0V0z" fill="none"/><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></g></svg>
              </span>
              <span className="ctlBtn expand">
                <svg viewBox="-2 -2 24 24" fill="white" width="24px" height="24px" className="svgExpand"><g><path d="M2 15V5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2zm2 0V5h7v10H4zm9 0h3V5h-3v10z" fillRule="evenodd" clipRule="evenodd"></path></g></svg>
                <svg viewBox="-2 -2 24 24" fill="white" width="24px" height="24px" className="svgContract"><g><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h7V3H4zM16 3h-3v14h3a2 2 0 002-2V5a2 2 0 00-2-2z"></path></g></svg>
              </span>
              <span className="ctlBtn fullscreen">
                <svg viewBox="0 0 24 24" fill="white" width="24px" height="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
              </span>
              <div className={cx('popup', 'settingPopup', {opened: settingPanel !== 'CLOSED'})}>
                <ul className="itemList">
                  <li className="item videoQuality subList" onClick={e => this.setSettingPanel('VIDEO_QUALITY')}>
                    화질
                    <span className="subText">{qualityList[quality]}</span>
                  </li>
                  <li className="item playSpeed subList" style={{display: 'none'}}>
                    재생 속도
                    <span className="subText">1x</span>
                  </li>
                </ul>
              </div>
              <div className={cx('popup', 'videoQualityPopup', {opened: settingPanel === 'VIDEO_QUALITY'})}>
                <ul className="itemList">
                  {videoQualityList}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class WakPlayerContext {

  subscribers = [];

  subscribe = target => {
    this.subscribers.push(target);
  }

  unsubscribe = target => {
    this.subscribers = this.subscribers.filter(sub => sub !== target);
  }

  /**
   * @param {{type: string}} e
   */
  notify = e => {
    this.subscribers.map(sub => sub.onNotified && sub.onNotified(e));
  }
}

export default WakPlayer;