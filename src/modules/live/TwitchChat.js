import React, { Component } from 'react';
import { domain } from '../../common/constants';

import TwitchChatClient from './TwitchChatClient';

import styles from './TwitchChat.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class TwitchChat extends Component {

  static defaultProps = {
    channelId: process.env.REACT_APP_TWITCH_CHANNEL_NAME,
  }

  sizeController = React.createRef();
  sizeControlWrapper = React.createRef();
  sizeControlOverlay = React.createRef();

  state = {
    chatWidth: 320,
  };

  minChatWidth = 180;

  componentDidMount() {
    this.lastScrollX = 0;
    this.lastWidth = this.state.chatWidth;
    this.newWidth = this.state.chatWidth;
    this.dragged = false;
    document.addEventListener('mousemove', this.onDragCtrl);
    document.addEventListener('touchmove', this.onDragCtrl);
    document.addEventListener('mouseup', this.onDragEndCtrl);
    document.addEventListener('touchend', this.onDragEndCtrl);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onDragCtrl);
    document.removeEventListener('touchmove', this.onDragCtrl);
    document.removeEventListener('mouseup', this.onDragEndCtrl);
    document.removeEventListener('touchend', this.onDragEndCtrl);
  }

  setChatWidth = w => { this.setState({ chatWidth: w }); };

  onDragStartCtrl = e => {
    const mx = e.type === 'touchstart' ? e.touches[0].pageX : e.pageX;
    this.lastScrollX = mx;
    this.lastWidth = this.state.chatWidth;
    this.setDragged(true);
    const ctrOverlay = this.sizeControlOverlay.current;
    ctrOverlay.style.width = this.lastWidth + 'px';
  };
  onDragCtrl = e => {
    if (this.dragged) {
      e.preventDefault();
      const mx = e.type === 'touchmove' ? e.changedTouches[0].pageX : e.pageX;
      const w = Math.max(this.lastWidth - (mx - this.lastScrollX), this.minChatWidth) - this.lastWidth;
      this.newWidth = this.lastWidth + w;
      const ctrOverlay = this.sizeControlOverlay.current;
      ctrOverlay.style.width = this.newWidth + 'px';
      this.setControllerPos(-8 - w);
    }
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
    const ctr = this.sizeController.current;
    if (bool) {
      if (!ctrWrapper.classList.contains('dragged')) {
        ctrWrapper.classList.add('dragged');
      }
      if (!ctr.classList.contains('focused')) {
        ctr.classList.add('focused');
      }
    }
    else {
      if (ctrWrapper.classList.contains('dragged')) {
        ctrWrapper.classList.remove('dragged');
      }
      if (ctr.classList.contains('focused')) {
        ctr.classList.remove('focused');
      }
    }
  };

  setControllerPos = l => {
    const ctr = this.sizeController.current;
    ctr.style.left = l ? l + 'px' : '';
  };

  render() {

    return (
    <div className={cx('TwitchChat', {small: this.state.chatWidth < 220})} style={{'--chatWidth': `${this.state.chatWidth}px`}}>
      <TwitchChatClient 
        clientId={process.env.REACT_APP_TWITCH_CLIENT_ID} 
        channelName={this.props.channelId} 
        redirectUri={`https://${domain}${this.props.location.pathname}`}
        location={this.props.location}
        history={this.props.history}
      />
      <div className="sizeController" ref={this.sizeController} onMouseDown={this.onDragStartCtrl} onTouchStart={this.onDragStartCtrl}></div>
      <div className="sizeControlWrapper" ref={this.sizeControlWrapper}>
        <div className="sizeControlOverlay" ref={this.sizeControlOverlay}></div>
      </div>
    </div>
    );
  }
}

export default TwitchChat;