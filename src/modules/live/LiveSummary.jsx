import React, { useState, useEffect, useCallback } from 'react';

import TransparentButton from '../../common/Components/Button/TransparentButton';
import CircleImg from '../../common/Components/CircleImg';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';

import * as func from '../../common/funtions';
import * as service from '../../services/LiveWakApi';

import StreamTimer from './StreamTimer';
import ViewerCounter from './ViewerCounter';

import styles from './LiveSummary.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function LiveSummary({channelId = 'woowakgood', style = 'normal', expanded, onChangeOverlayState}) {

  const liveOffline = {
    broadcaster: 'NONE',
    nickname: '',
    profileImg: '',
    title: '방송 중이 아닙니다.',
    viewerCount: 0,
    startedTime: 0,
    updatedTimeStamp: 0,
  };
  const liveOfflineByApiDown = {
    broadcaster: 'NONE',
    nickname: '',
    profileImg: '',
    title: '네트워크 상태를 확인해주세요.',
    viewerCount: 0,
    startedTime: 0,
    updatedTimeStamp: 0,
  };

  const [liveInfo, setLiveInfo] = useState(liveOffline);

  const updateLiveInfo = async (target) => {

    const updatedTimeStamp = Date.now();

    // 프로필 로드
    const memberProfiles = await service.getWaktaverseInfo();
    const memberProfile = memberProfiles.find(member => member.login === target);

    // Client/Api 오프라인 예외 처리
    if (!memberProfile) {
      setLiveInfo(liveOfflineByApiDown);
      return;
    }

    const updatedLiveInfo = {
      broadcaster: 'NONE',
      nickname: memberProfile.display_name,
      profileImg: memberProfile.profile_image_url,
      title: '방송 중이 아닙니다.',
      viewerCount: 0,
      startedTime: 0,
      updatedTimeStamp, 
    };

    // 생방송 정보 로드
    const lives = await service.getWaktaverseBroadcastInfo();
    const fetchedInfo = lives.find(live => live.login_name === target);

    if (fetchedInfo) { // 뱅온

      // 생방송 정보 삽입
      Object.assign(updatedLiveInfo, {
        broadcaster: fetchedInfo.broadcaster, 
        title: fetchedInfo.title,
        viewerCount: parseInt(fetchedInfo.viewerCount),
        startedTime: new Date(fetchedInfo.startedTime).getTime(),
        seed: Math.random(),
      });
    }
    if (liveInfo.updatedTimeStamp < updatedLiveInfo.updatedTimeStamp) {
      setLiveInfo(updatedLiveInfo);
    }
  };

  useEffect(() => {
    updateLiveInfo(channelId);

    const loopUpdateLiveInfo = setInterval(() => updateLiveInfo(channelId), 30 * 1000);

    return () => clearInterval(loopUpdateLiveInfo);
  }, [channelId]);

  const { broadcaster, nickname, profileImg, title, viewerCount, startedTime } = liveInfo;

  const startedTimeString = startedTime !== 0 ? func.formatDateTimeString(new Date(startedTime)) : '';
  const channelName = nickname;
  const broadcastName = broadcaster.charAt(0) + broadcaster.slice(1).toLowerCase();

  return (
    style == 'simple' ?
    <div className={cx('LiveSummary', {simple: style == 'simple'})}>
      <div className="liveSummaryWrapper" >
        <span className="liveTitle">{title}</span>
        <span className="liveDateTime">{startedTimeString}</span>
      </div>
    </div> : 
    <div className={cx('LiveSummary')}>
      <div className="left">
        <div className="liveProfile">
          <div className="profileWrapper">
            <CircleImg src={profileImg} alt="" className="profileImg" />
          </div>
        </div>
        <div className="liveSummaryWrapper" >
          <span className="liveTitle">{title}</span>
          <span className={cx('livePresented', {hide: broadcastName == 'None'})}>
            <span className="channelName">{channelName}</span>
            &nbsp;on&nbsp;
            <span className="broadcastName">{broadcastName}</span>
          </span>
        </div>
      </div>
      <div className="right">
        <div className="up">
          <ViewerCounter viewer={viewerCount} />
          <StreamTimer startedTime={startedTime} />
        </div>
        <div className="down">
          <TransparentButton 
            className="btnOpenInfo"
            onClick={e => onChangeOverlayState({theaterMode: !expanded})}>
            {
              expanded ? 
              <ExpandMoreRoundedIcon /> : 
              <ExpandLessRoundedIcon />
            } 
          </TransparentButton>
        </div>
      </div>
    </div>
  );
}