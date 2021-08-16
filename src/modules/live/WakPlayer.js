import React, { Component } from 'react';
import styles from './WakPlayer.scss';

import { domain, TOGGLE, CLOSED, OPENED, EXPANDED, DARK, LIGHT, LANDSCAPE, PORTRAIT } from '../../common/constants';

import { TwitchPlayer } from 'react-twitch-embed';
import { LiveContext } from './context';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class WakPlayer extends Component {
  static STOP = 0;
  static PAUSE = 1;
  static PLAYING = 2;

  state = {
    broadcaster: 'none',
    player: null,
    playerState: 'STOP',
    qualities: [],
    volume: .5,
    muted: false,
  };

  constructor (props) {
    super(props);
    this.embed = null;
  }

  onReady = player => {
    if (this.state.broadcaster === 'twitch') {
      this.setState({
        player: player,
        qualities: player.getQualities(),
        volume: player.getVolume(),
        muted: player.getMuted(),
      });
      console.log(player.getQualities());
    }
  }

  onPlay = () => {
    this.setState({
      playerState: 'PLAY',
    });
  }
  onPlaying = () => {
    this.setState({
      playerState: 'PLAYING',
    });
  }
  onPause = () => {
    this.setState({
      playerState: 'PAUSE',
    });
  }

  onOnline = () => {
    //TODO: is online
  }
  onOffline = () => {
    //TODO: is offline
  }

  setVolume = val => {
    if (this.state.player) {
      this.state.player.setVolume(Math.min(Math.max(val, 0), 1));
    }
    this.setState({
      volume: Math.min(Math.max(val, 0), 1),
    });
  }
  setMuted = val => {
    if (this.state.player) {
      this.state.player.setMuted(val);
    }
    this.setState({
      muted: val,
    });
  }
  getQualities = () => {
    if (this.state.player) {
      this.setState({
        qualities: this.state.player.getQualities(),
      });
      console.log(this.state.player.getQualities());
    }
  }
  setQuality = val => {
    if (this.state.player) {
      this.state.player.setQuality(val);
    }
  }

  componentDidMount() {
    this.setState({
      broadcaster: 'twitch',
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.broadcaster !== this.state.broadcaster && 
      nextState.broadcaster === 'twitch') {
      this.embed = <TwitchPlayer className="stream" channel="woowakgood" parent={[domain]} 
                      width="100%" height="100%" hideControls={true} muted={false} 
                      onReady={this.onReady} onPlay={this.onPlay} onPlaying={this.onPlaying} onPause={this.onPause} 
                      onOnline={this.onOnline} onOffline={this.onOffline} />
    }
    return nextState.broadcaster !== this.state.broadcaster || 
      nextState.player !== this.state.player || 
      nextState.playerState !== this.state.playerState ||
      nextState.qualities !== this.state.qualities ||
      nextState.volume !== this.state.volume ||
      nextState.muted !== this.state.muted;
  }
  
  render() {
    const { broadcaster, player, playerState, qualities, volume, muted } = this.state;

    return (
      <div className="WakPlayer">
        <div className="content">
          {this.embed}
          <WakPlayerOverlay broadcaster={broadcaster} player={player} playerState={playerState} qualities={qualities} volume={volume} muted={muted} setVolume={this.setVolume} getQualities={this.getQualities} setQuality={this.setQuality} />
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
    playerState: 'STOP',
    qualities: [],
    volume: .5,
    muted: false,
    setVolume: () => {},
    expanded: false,
    getQualities: () => {},
    setQuality: () => {},
  };

  state = {
    volPressed: false,
    settingPanel: 'CLOSED',
    quality: 'Auto', 
  };
  
  constructor (props) {
    super(props);

    this.overlayLife = 0;
    this.loopOverlay = setInterval(this.loopOverlayLife, 50);
    this.volSlider = React.createRef();
    this.volSliderBar = React.createRef();
    this.volSliderBtn = React.createRef();
    
  }

  loopOverlayLife = () => {
    if (this.overlayLife > 0 && this.overlayLife - 50 <= 0) {
      this.closeOverlay();
    }
    this.overlayLife = this.state.settingPanel === 'CLOSED' ? Math.max(this.overlayLife - 50, 0) : 100;
  }

  openOverlay = () => {
    if (this.context.playerOverlay == CLOSED) {
      this.context.setPlayerOverlay(OPENED);
    }
    this.overlayLife = 3000;
  }
  closeOverlay = () => {
    if (this.context.playerOverlay != CLOSED) {
      this.context.setPlayerOverlay(CLOSED);
    }
    this.overlayLife = 0;
  }

  play = () => {
    if (this.props.broadcaster !== 'none') {
      this.props.player.play();
    }
  }
  pause = () => {
    if (this.props.broadcaster !== 'none') {
      this.props.player.pause();
    }
  }
  refresh = () => {
    if (this.props.broadcaster !== 'none') {
      this.props.player.pause();
      this.props.player.play();
    }
  }

  onTouch = e => {
    if (!(e.target == e.currentTarget || e.target.className === 'bottom')) {return;}
    const touchedState = this.context.playerOverlay;
    setTimeout(() => {
      if (touchedState !== this.context.playerOverlay) {return;}

      if (this.context.playerOverlay == CLOSED) {
        this.openOverlay();
      } else if (this.context.playerOverlay == OPENED && this.state.settingPanel == 'CLOSED') {
        this.closeOverlay();
      }
    }, 200);
  }
  onMouseDown = e => {
    this.setState({volPressed: true});
    const rect = this.volSlider.current.getBoundingClientRect();
    const offset = { 
      top: rect.top + window.scrollY, 
      left: rect.left + window.scrollX, 
    };
    this.volPressedVal = Math.min(Math.max(e.pageX - offset.left - 8, 0), 100);
    this.setVolume(this.volPressedVal);
  }
  onMouseMove = e => {
    if (this.state.volPressed) {
      const rect = this.volSlider.current.getBoundingClientRect();
      const offset = { 
        top: rect.top + window.scrollY, 
        left: rect.left + window.scrollX, 
      };
      this.volPressedVal = Math.min(Math.max(e.pageX - offset.left - 8, 0), 100);
      this.setVolume(this.volPressedVal);
    }
  }
  onMouseUp = () => {
    this.setState({volPressed: false});
  }
  setVolume = val => {
    val = Math.floor(val);
    this.volPressedVal = val;
    this.volSliderBar.current.width = val;
    this.volSliderBtn.current.left = val;
    this.props.setVolume(val / 100);
  }

  setSettingPanel = panel => {
    const prevPanel = this.state.settingPanel;
    if (prevPanel !== panel && prevPanel === 'CLOSED') {
      this.props.getQualities();
    }
    console.log(panel);
    this.setState({
      settingPanel: panel,
    })
  }

  setQuality = val => {
    this.props.setQuality(val);
    this.setState({
      quality: val,
    })
    this.setSettingPanel('MAIN');
  }
  
  componentDidMount() {
    this.volPressedVal = 50;
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    clearInterval(this.loopOverlay);
  }

  render() {
    const { playerOverlay } = this.context;
    const { playerState, qualities, volume, muted } = this.props;
    const { volPressed, settingPanel, quality } = this.state;

    const btnLeft = {left: `${parseInt(volume*100)}px`};
    const barWidth = {width: `${parseInt(volume*100)}px`};

    const qualityList = {
      'Auto': '자동',
      '1080p60 (source)': '1080p60 (원본)',
      '1080p60': '1080p60',
      '720p60': '720p60',
      '720p60 (source)': '720p60 (원본)',
      '720p': '720p',
      '480p': '480p',
      '360p': '360p',
      '160p': '160p',
    }
    const videoQualityList = qualities.map(q => <li className="item vq" data-vq={q.name.replace(' (source)', '')} onClick={e => this.setQuality(q.name)}>{qualityList[q.name] || q.name}</li>);

    return (
      <div className={cx('WakPlayerOverlay', 'overlayArea', {opened: playerOverlay === OPENED || playerOverlay === EXPANDED || volPressed || settingPanel !== 'CLOSED'})} 
        onMouseMove={this.openOverlay} 
        onMouseLeave={this.closeOverlay} >
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
              <span className={cx('ctlBtn', 'volume', {mute: muted || volume === 0, small: (volume > 0 && volume <= .5), big: volume > .5})}>
                <svg viewBox="0 0 24 24" fill="white" width="24px" height="24px" className="mute"><path d="M0 0h24v24H0z" fill="none"/><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                <svg viewBox="0 0 24 24" fill="white" width="24px" height="24px" className="small"><path d="M0 0h24v24H0z" fill="none"/><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>
                <svg viewBox="0 0 24 24" fill="white" width="24px" height="24px" className="big"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
              </span>
              <div className={cx('volSlider', {pressed: volPressed})} ref={this.volSlider} onMouseDown={this.onMouseDown}>
                <div className="sliderBg"></div>
                <div className="sliderBar" ref={this.volSliderBar} style={barWidth}></div>
                <div className="sliderBtn" ref={this.volSliderBtn} style={btnLeft}></div>
              </div>
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


export default WakPlayer;