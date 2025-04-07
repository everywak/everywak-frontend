import React, { useState, useEffect } from 'react';

import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';

import * as func from '../../common/functions';
import TransparentButton from '../../common/Components/Button/TransparentButton';
import CircleImg from '../../common/Components/CircleImg';
import useQueryWaktaverseLive from '../../hooks/useQueryWaktaverseLive';

import StreamTimer from './StreamTimer';
import ViewerCounter from './ViewerCounter';

import './LiveSummary.scss';
import cx from 'classnames';

const liveOfflineByApiDown = {
  broadcaster: 'NONE',
  nickname: '',
  profileImg: '',
  title: '네트워크 상태를 확인해주세요.',
  viewerCount: 0,
  startedTime: 0,
  updatedTimeStamp: 0,
};
const liveOfflineByWrongChannelId = {
  broadcaster: 'NONE',
  nickname: '',
  profileImg: '',
  title: '잘못된 채널id입니다.',
  viewerCount: 0,
  startedTime: 0,
  updatedTimeStamp: 0,
};

export default function LiveSummary({
  channelId = 'woowakgood',
  style = 'normal',
  expanded,
  onChangeOverlayState,
}) {
  const [liveInfo, setLiveInfo] = useState({
    broadcaster: 'NONE',
    nickname: '',
    profileImg: '',
    title: '생방송 정보 불러오는 중...',
    viewerCount: 0,
    startedTime: 0,
    updatedTimeStamp: 0,
  });

  const refetchInterval = 15000;
  const { isLoading, data, isError, error } = useQueryWaktaverseLive({
    loginName: channelId,
    refetchInterval,
  });

  useEffect(() => {
    if (isLoading || !data) {
      return () => {};
    }

    setLiveInfo({
      broadcaster: data.lives[0].broadcaster,
      nickname: data.members[0].nickname,
      profileImg: data.members[0].twitchProfileImage,
      title: data.lives[0].title,
      viewerCount: data.lives[0].broadcaster !== 'NONE' ? data.lives[0].viewerCount : 0,
      startedTime: data.lives[0].startedTime * 1000,
    });
  }, [isLoading, data]);

  useEffect(() => {
    console.log(error);
    if (isError) {
      if (error?.message.status === 200 && error?.message.result.length == 0) {
        setLiveInfo({ ...liveOfflineByWrongChannelId });
        return () => {};
      }

      // Client/Api 오프라인
      setLiveInfo({ ...liveOfflineByApiDown });
    }
  }, [isError, error]);

  const { broadcaster, nickname, profileImg, title, viewerCount, startedTime } = liveInfo;

  const startedTimeString =
    startedTime !== 0 ? func.formatDateTimeString(new Date(startedTime)) : '없음';
  const broadcasterName = broadcaster.charAt(0) + broadcaster.slice(1).toLowerCase();
  const isLive = broadcaster !== 'NONE';

  return style === 'simple' ? (
    <div className={cx('LiveSummary', { simple: style === 'simple' })}>
      <div className="liveSummaryWrapper">
        <span className="liveTitle">{title}</span>
        <span className="liveDateTime">{startedTimeString}</span>
      </div>
    </div>
  ) : (
    <div className={cx('LiveSummary')}>
      <div className="left">
        <div
          className={cx('liveProfile', {
            youtube: broadcaster === 'YOUTUBE',
            twitch: broadcaster === 'TWITCH',
            chzzk: broadcaster === 'CHZZK',
            afreeca: broadcaster === 'AFREECA',
          })}
        >
          <div className="profileWrapper">
            <CircleImg src={profileImg} alt="" className="profileImg" />
          </div>
        </div>
        <div className="liveSummaryWrapper">
          <span className="liveTitle">{title}</span>
          <span className={cx('livePresented')}>
            <span className="channelName">{nickname}</span>
            {isLive ? ' on ' : ' · '}
            <span className="broadcastName">
              {isLive ? broadcasterName : `최근 방송 ${startedTimeString}`}
            </span>
          </span>
        </div>
      </div>
      <div className="right">
        <div className="up">
          <ViewerCounter viewer={viewerCount} />
          {isLive && <StreamTimer startedTime={startedTime} />}
        </div>
        <div className="down">
          <TransparentButton
            className="btnOpenInfo"
            onClick={(e) => onChangeOverlayState({ theaterMode: !expanded })}
          >
            {expanded ? <ExpandMoreRoundedIcon /> : <ExpandLessRoundedIcon />}
          </TransparentButton>
        </div>
      </div>
    </div>
  );
}
