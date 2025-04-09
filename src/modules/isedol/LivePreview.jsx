import React from 'react';
import { Link } from 'react-router-dom';

import Spinner from '../../common/components/legacy/Spinner';
import CircleImg from '../../common/components/legacy/CircleImg';
import BasicImage from '../../common/components/legacy/Image/BasicImage';

import useQueryWaktaverseLive from '../../hooks/useQueryWaktaverseLive';

import styles from './LivePreview.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function LivePreview({ className, channelId = 'twitchdev', size = 'normal', hideProfile = false }) {
  const { isLoading, data } = useQueryWaktaverseLive({ loginName: channelId });

  const url = `/withlive?main=${channelId}`;

  const thWidth = size === 'big' ? 600 : 200;
  const isLive = !(data?.lives[0]?.broadcaster === 'NONE');
  const profileImgUrl = data?.members[0]?.twitchProfileImage;
  const previewImgUrl = isLive
    ? data?.lives[0]?.thumbnail
        ?.replace('{width}', thWidth)
        .replace('{height}', parseInt((thWidth / 16) * 9)) // 방송 썸네일
    : data?.members[0]?.twitchOfflineImage.replace(
        '1920x1080',
        `${thWidth}x${parseInt((thWidth / 16) * 9)}`, // 오프라인 썸네일
      );

  return (
    <li className={cx('LivePreview', className, { loading: isLoading })}>
      <Link to={url}>
        <BasicImage className={styles.previewImg} src={previewImgUrl} alt="생방송 썸네일" />
        {!hideProfile && (
          <div
            className={cx('profileCircle', {
              youtube: data?.lives[0]?.broadcaster === 'YOUTUBE',
              twitch: data?.lives[0]?.broadcaster === 'TWITCH',
              chzzk: data?.lives[0]?.broadcaster === 'CHZZK',
              afreeca: data?.lives[0]?.broadcaster === 'AFREECA',
            })}
          >
            <CircleImg
              className={styles.innerCircle}
              src={profileImgUrl}
              alt="채널 프로필 이미지"
            />
          </div>
        )}
        <Spinner className={styles.spinner} />
      </Link>
    </li>
  );
}

export default LivePreview;
