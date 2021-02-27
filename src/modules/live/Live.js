import React, { Component } from 'react';
import styles from './Live.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class Live extends Component {
  static defaultProps = {
    front: false
  };

  render() {
    
    return (
      <div className={cx('Live', {'front': this.props.front})}>
        <WakPlayer />
        <div className="liveSummary">
          <span className="liveSummaryTitle">뭐? 뱅온이 없다고?</span>
          <span className="liveSummaryTime">13일 전</span>
        </div>
      </div>
    );
  }
}

class WakPlayer extends Component {

  render() {

    return (
      <div className="WakPlayer">
        <div className="content">
          <iframe className="stream" src="https://player.twitch.tv/?channel=woowakgood&parent=localhost" frameborder="0" allowfullscreen="true" scrolling="no"/>
        </div>
      </div>
    );
  }
}

export default Live;