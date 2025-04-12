import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { useQueryLive, useQueryMember } from 'hooks';
import Spinner from '../../common/components/legacy/Spinner';
import CircleImg from '../../common/components/legacy/CircleImg';
import { BasicImage } from 'common/components';

import styles from './LivePreview.module.scss';

export interface Props {
  className?: string;
  memberId: string;
  hideProfile?: boolean;
}

export const LivePreview = ({ className, memberId, hideProfile }: Props) => {
  const { isLoading: isLoadingMember, data: members } = useQueryMember();
  const { isLoading: isLoadingLive, data: lives } = useQueryLive();

  const member = members?.find((member) => member.id === memberId);
  const live = lives?.find((live) => live.id.split(':')[0] === memberId);
  const url = `/withlive?main=${memberId}`;

  if (isLoadingMember || isLoadingLive || !member) {
    return (
      <li className={clsx('LivePreview', styles.container, className, styles.loading)}>
        <Link to={url}>
          {!hideProfile && (
            <div className={clsx(styles.profileCircle)}>
              <CircleImg
                className={styles.innerCircle}
                src={''}
                alt="채널 프로필 이미지"
                objectFit="cover"
                padding={0}
              />
            </div>
          )}
          <Spinner className={styles.spinner} />
        </Link>
      </li>
    );
  }

  const isLive = live?.isLive;
  const profileImgUrl = member.profile.profileImage;
  const previewImgUrl = isLive ? live.thumbnail : member.profile.offlineImage;

  return (
    <li className={clsx('LivePreview', styles.container, className)}>
      <Link to={url}>
        <BasicImage className={styles.previewImg} src={previewImgUrl} alt="생방송 썸네일" />
        {!hideProfile && (
          <div
            className={clsx(styles.profileCircle, {
              [styles.youtube]: isLive && live?.livePlatform.type === 'youtube',
              [styles.twitch]: isLive && live?.livePlatform.type === 'twitch',
              [styles.chzzk]: isLive && live?.livePlatform.type === 'chzzk',
              [styles.afreeca]: isLive && live?.livePlatform.type === 'afreeca',
            })}
          >
            <CircleImg
              className={styles.innerCircle}
              src={profileImgUrl}
              alt="채널 프로필 이미지"
              objectFit="cover"
              padding={0}
            />
          </div>
        )}
        <Spinner className={styles.spinner} />
      </Link>
    </li>
  );
};

export default LivePreview;
