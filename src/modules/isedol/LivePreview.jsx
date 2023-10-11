import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Spinner from '../../common/Components/Spinner';
import CircleImg from '../../common/Components/CircleImg';

import * as service from '../../services/LiveWakApi';

import styles from './LivePreview.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class LivePreview extends Component {
  static defaultProps = {
    channelId: 'twitchdev',
    size: 'normal',
  };

  state = {
    loaded: false, 
    live: false,
    previewImgUrl: '',
    profileImgUrl: '',
  };

  constructor (props) {
    super(props);
  };

  updateChannelImgs = async id => {

    const userinfo = await service.getWaktaverseInfo();
    const broadcast = await service.getWaktaverseBroadcastInfo();
    const targetBroadcast = broadcast.find(item => item.loginName === id);
    const targetInfo = userinfo.find(item => item.login === id);
    const thWidth = this.props.size === 'big' ? 600 : 200;
    
    if (targetBroadcast && targetInfo) { // 뱅온
      const thumbnail = targetBroadcast.thumbnail.replace('{width}', thWidth).replace('{height}', parseInt(thWidth / 16 * 9));
      this.setState({
        loaded: true,
        live: true,
        previewImgUrl: thumbnail,
        profileImgUrl: targetInfo.profile_image_url,
      });
    } else { // 뱅없
      this.setState({
        loaded: true,
        live: false,
        previewImgUrl: targetInfo.offline_image_url.replace('1920x1080', `${thWidth}x${parseInt(thWidth / 16 * 9)}`),
        profileImgUrl: targetInfo.profile_image_url,
      });
    }
  }

  componentDidMount() {
    this.updateChannelImgs(this.props.channelId);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUnmount() {
  }

  render() {
    const { channelId } = this.props;
    const { loaded, live, previewImgUrl, profileImgUrl } = this.state;
    
    return (
      <li className={cx('LivePreview', {loading: !loaded}, {off: !live})}>
        <Link to={channelId === 'woowakgood' ? '/live' : `/withlive/isedol?main=${channelId}`}>
          <img className="previewImg" src={previewImgUrl} alt="생방송 썸네일" onError={e => {e.target.src = '/images/blank.png'}} />
          <div className="profileCircle">
            <CircleImg className="innerCircle" src={profileImgUrl} alt="채널 프로필 이미지" />
          </div>
          <Spinner />
        </Link>
      </li>
    );
  }
}
  
  export default LivePreview;