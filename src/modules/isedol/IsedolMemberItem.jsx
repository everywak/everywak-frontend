import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import CircleImg from '../../common/Components/CircleImg';

import styles from './IsedolMemberItem.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class IsedolMemberItem extends Component {
  static defaultProps = {
    name: '멤버이름',
    profileImg: '',
    social: {
      twitch: '',
      youtube: '',
      instagram: '',
    },
  };

  state = {
  };

  constructor (props) {
    super(props);
  };

  componentDidMount() {
    console.log(this.props)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUnmount() {
  }

  render() {
    const { name, profileImg, social } = this.props;
    const {  } = this.state;
    
    return (
      <li className={cx('IsedolMemberItem')}>
        <div className="profileCircle">
          <CircleImg src={profileImg} alt={`${name} 프로필 이미지`} />
        </div>
        <ul className="social">
          <IsedolMemberSocialItem type='twitch' socialId={social.twitch} />
          <IsedolMemberSocialItem type='youtube' socialId={social.youtube} />
          <IsedolMemberSocialItem type='instagram' socialId={social.instagram} />
        </ul>
      </li>
    );
  }
}

class IsedolMemberSocialItem extends Component {
  static defaultProps = {
    type: '',
    socialId: '',
  };

  static socialType = {
    twitch: {
      bg: '/images/twitch_logo.svg',
      url: 'https://twitch.tv/{id}',
    },
    youtube: {
      bg: '/images/youtube_logo.png',
      url: 'https://www.youtube.com/channel/{id}',
    },
    instagram: {
      bg: '/images/instagram_logo.png',
      url: 'https://www.instagram.com/{id}',
    },
  }

  render() {
    const { type, socialId } = this.props;
    const { url, bg } = IsedolMemberSocialItem.socialType[type];
    const href = url.replace('{id}', socialId);

    const className = {
      twitch: type == 'twitch',
      youtube: type == 'youtube',
      instagram: type == 'instagram',
    };
    
    return (
      <li className={cx('IsedolMemberSocialItem', className)}>
        <a href={href} className="link">
          <CircleImg 
            src={bg} 
            alt={`${type} logo`} 
            objectFit="contain" 
            padding={8} />
        </a>
      </li>
    );
  }
}
  
export default IsedolMemberItem;