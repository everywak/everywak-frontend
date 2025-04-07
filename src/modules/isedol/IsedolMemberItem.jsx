import React from 'react';
import { Link } from 'react-router-dom';

import CircleImg from '../../common/Components/CircleImg';
import CircleImgButton from '../../common/Components/Button/CircleImgButton';

import './IsedolMemberItem.scss';
import cx from 'classnames';

/**
 * 이세돌 멤버 프로필 아이콘
 *
 * @param {*} props
 */
function IsedolMemberItem({ name, profileImg, social }) {
  return (
    <li className={cx('IsedolMemberItem')}>
      <div className="profileCircle">
        <CircleImg src={profileImg} alt={`${name} 프로필 이미지`} />
      </div>
      <ul className="social">
        <IsedolMemberSocialItem type="afreecatv" socialId={social.afreecatv} />
        <IsedolMemberSocialItem type="youtube" socialId={social.youtube} />
        <IsedolMemberSocialItem type="instagram" socialId={social.instagram} />
      </ul>
    </li>
  );
}
IsedolMemberItem.defaultProps = {
  name: '멤버이름',
  profileImg: '',
  social: {
    twitch: '',
    youtube: '',
    instagram: '',
  },
};

/**
 * 프로필 아이콘 밑에 붙는 유튜브/트위치/인스타 링크 버튼
 *
 * @param {Object} props
 */
function IsedolMemberSocialItem({ type, socialId }) {
  const socialType = {
    afreecatv: {
      bg: '/images/afreecatv_logo.svg',
      url: 'https://bj.afreecatv.com/{id}',
    },
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
  };

  const { url, bg } = socialType[type];
  const href = url.replace('{id}', socialId);

  const className = {
    afreecatv: type == 'afreecatv',
    twitch: type == 'twitch',
    youtube: type == 'youtube',
    instagram: type == 'instagram',
  };

  return (
    <li className={cx('IsedolMemberSocialItem', className)}>
      <CircleImgButton
        className="link"
        href={href}
        src={bg}
        alt={`${type} logo`}
        objectFit="contain"
        padding="8px"
      />
    </li>
  );
}

export default IsedolMemberItem;
