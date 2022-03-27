import React, { useState, useEffect } from 'react';

import TransparentButton from '../../common/Components/Button/TransparentButton';
import CircleImg from '../../common/Components/CircleImg';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@material-ui/icons/ExpandLessRounded';

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
  };

  const [liveInfo, setLiveInfo] = useState(liveOffline);

  useEffect(() => {
    updateLiveInfo();

    const loopUpdateLiveInfo = setInterval(updateLiveInfo, 30 * 1000);

    return () => clearInterval(loopUpdateLiveInfo);
  }, []);

  async function updateLiveInfo() {

    // 생방송 정보 로드
    const lives = await service.getWaktaverseBroadcastInfo();
    const info = lives.find(live => live.login_name === channelId);

    // 프로필 이미지 로드
    const memberProfiles = await service.getWaktaverseInfo();
    const memberProfile = memberProfiles.find(member => member.login === channelId);
    info.profileImg = memberProfile.profile_image_url;

    switch(info.broadcaster) {
      case 'TWITCH':
        const {
          broadcaster, nickname, profileImg, title, viewerCount, startedTime,
        } = info;

        const newLiveInfo = {
          broadcaster, nickname, profileImg, title,
          viewerCount: parseInt(viewerCount),
          startedTime: new Date(startedTime).getTime(),
          seed: Math.random(),
        };
        setLiveInfo(newLiveInfo);
        break;
      default:
        setLiveInfo(liveOffline);
    }
  }

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
            onClick={e => onChangeOverlayState({expanded: !expanded})}>
            {
              expanded ? 
              <ExpandMoreRoundedIcon fontSize="medium" /> : 
              <ExpandLessRoundedIcon fontSize="medium" />
            } 
          </TransparentButton>
        </div>
      </div>
    </div>
  );
}