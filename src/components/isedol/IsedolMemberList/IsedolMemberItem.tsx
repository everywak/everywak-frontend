import React from 'react';
import clsx from 'clsx';

import CircleImgButton from '@/common/components/legacy/Button/CircleImgButton';
import { BasicImage } from '@/common/components';

import styles from './IsedolMemberItem.module.scss';

export interface Props {
  className?: string;
  name: string;
  profileImg: string;
  social: {
    afreecatv: string;
    youtube: string;
    instagram: string;
  };
}

export const IsedolMemberItem = ({ className, name, profileImg, social }: Props) => {
  return (
    <li className={clsx('IsedolMemberItem', styles.container, className)}>
      <div className={styles.profileCircle}>
        <BasicImage className={styles.image} src={profileImg} alt={`${name} 프로필 이미지`} />
      </div>
      <ul className={styles.social}>
        <SocialItem type="afreecatv" socialId={social.afreecatv} />
        <SocialItem type="youtube" socialId={social.youtube} />
        <SocialItem type="instagram" socialId={social.instagram} />
      </ul>
    </li>
  );
};

interface SocialItemProps {
  type: 'afreecatv' | 'youtube' | 'instagram';
  socialId: string;
}

const SocialItem = ({ type, socialId }: SocialItemProps) => {
  const socialType = {
    afreecatv: {
      bg: '/images/soop_logo.svg',
      url: 'https://ch.sooplive.co.kr/{id}',
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
    [styles.afreecatv]: type == 'afreecatv',
    [styles.youtube]: type == 'youtube',
    [styles.instagram]: type == 'instagram',
  };

  return (
    <li className={clsx('SocialItem', styles.socialItem, className)}>
      <CircleImgButton
        className={styles.link}
        href={href}
        src={bg}
        alt={`${type} logo`}
        objectFit="contain"
        padding="8px"
      />
    </li>
  );
};

export default IsedolMemberItem;
