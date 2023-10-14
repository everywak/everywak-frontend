import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import Spinner from '../../common/Components/Spinner';
import CircleImg from '../../common/Components/CircleImg';
import BasicImage from '../../common/Components/Image/BasicImage';

import * as service from '../../services/LiveWakApi';
import * as everywakApi from '../../services/everywak-api/index';

import styles from './LivePreview.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function LivePreview({ channelId = 'twitchdev', size = 'normal' }) {
  const fetchWaktaverseInfo = async () => {
    const resWaktaverseInfo = await everywakApi.live.getWaktaverseInfo({
      loginName: channelId
    });

    if (
      resWaktaverseInfo.message.status !== 200 ||
      !resWaktaverseInfo.message.result[0]
    ) {
      throw resWaktaverseInfo;
    }

    const broadcast = await service.getWaktaverseBroadcastInfo();

    const targetInfo = resWaktaverseInfo.message.result[0];
    const targetBroadcast = broadcast.find(
      item => item.loginName === channelId
    );
    const thWidth = size === 'big' ? 600 : 200;

    if (targetBroadcast && targetInfo) {
      // 뱅온
      const thumbnail = targetBroadcast.thumbnail
        .replace('{width}', thWidth)
        .replace('{height}', parseInt((thWidth / 16) * 9));
      return {
        isLive: true,
        previewImgUrl: thumbnail,
        profileImgUrl: targetInfo.twitchProfileImage
      };
    } else {
      // 뱅없
      return {
        isLive: false,
        previewImgUrl: targetInfo.twitchOfflineImage.replace(
          '1920x1080',
          `${thWidth}x${parseInt((thWidth / 16) * 9)}`
        ),
        profileImgUrl: targetInfo.twitchProfileImage
      };
    }
  };

  /**
   * @type {{ data: {isLive: boolean, previewImgUrl: string, profileImgUrl: string }, isLoading: boolean }}
   */
  const { isLoading, data } = useQuery(
    [`waktaverseInfo-${channelId}`],
    fetchWaktaverseInfo
  );

  const url =
    channelId === 'woowakgood' ? '/live' : `/withlive/isedol?main=${channelId}`;

  return (
    <li className={cx('LivePreview', { loading: isLoading }, { off: !data?.isLive })}>
      <Link to={url}>
        <BasicImage
          className={styles.previewImg}
          src={data?.previewImgUrl}
          alt="생방송 썸네일"
        />
        <div className={styles.profileCircle}>
          <CircleImg
            className={styles.innerCircle}
            src={data?.profileImgUrl}
            alt="채널 프로필 이미지"
          />
        </div>
        <Spinner className={styles.spinner} />
      </Link>
    </li>
  );
}

export default LivePreview;
