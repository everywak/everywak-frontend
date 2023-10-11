import React, { useState } from 'react';

import BasicSelect from '../../common/Components/Select/BasicSelect';
import BasicImage from '../../common/Components/Image/BasicImage';
import ContentPanel from '../frontpage/ContentPanel';

import { panels, socialLogoImgSrc } from './broadcasterPanelData';
import PredictionList from './PredictionList';
import VideoContentList from '../isedol/VideoContentList';

import styles from './BroadcasterPanel.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function BroadcasterPanel({ channelId }) {

  const [currentTab, setCurrentTab] = useState('videoContent');

  const onChangeTab = e => {
    setCurrentTab(e.target.value);
  }
  return (channelId && 
    <div className="BroadcasterPanel">
      <BasicSelect 
        className="tabList"
        options={[{name: '다시보기 및 클립', value: 'videoContent'}, {name: '최근 예측', value: 'prediction'}, {name: '바로가기', value: 'panel'}]} 
        name="tab" value={currentTab} onChange={onChangeTab} />
      <div className="content">
        {currentTab === 'videoContent' && <VideoContentTab channelId={channelId} />}
        {currentTab === 'prediction' && <PredictionTab channelId={channelId} />}
        {currentTab === 'panel' && <PanelTab channelId={channelId} />}
      </div>
      <FooterCopyright />
    </div>
  );
}

function PanelTab ({ channelId }) {
  const data = panels.find(item => item.channelId === channelId)?.panel;
  console.log(channelId);
  console.log(data)

  const panel = data?.map(item => (
    <a href={item.href} className="social" target="_blank">
      <BasicImage src={socialLogoImgSrc[item.type]} />
      {item.label && <span className="label">{item.label}</span>}
    </a>
  ));

  return (
    <div className="PanelTab tab">
      {panel}
    </div>
  );

}

function PredictionTab ({ channelId }) {

  return (
    <div className="PredictionTab tab">
      <PredictionList channelId={channelId} />
    </div>
  );

}

function VideoContentTab ({ channelId }) {

  return (
    <div className="VideoContentTab tab">
      <ContentPanel className="main replay" title="다시보기" width="spaceBetween">
        <VideoContentList options={{type: 'youtubeVOD', twitchId: channelId}} backgroundColor="#fafafa" hideProfileCircle />
      </ContentPanel>
      <ContentPanel className="main clip" title="최근 클립" width="spaceBetween">
        <VideoContentList options={{type: 'youtubeClip', twitchId: channelId}} backgroundColor="#fafafa" hideProfileCircle />
      </ContentPanel>
    </div>
  );
}

function FooterCopyright() {
  return (
    <p className="FooterCopyright">
      에브리왁굳 우왁굳 생방송 페이지는 YouTube 및 Twitch의 서드파티 사이트로 YouTube 및 Twitch에서 운영하는 사이트가 아닙니다.<br/>
      'YouTube' 및 '유튜브'는 YouTube, LLC의 등록상표이며 'Twitch' 및 '트위치'는 Twitch Interactive, Inc.의 등록상표입니다.<br/>
      &nbsp;<br/>
      에브리왁굳 © 2020-2023. <a href="https://github.com/wei756" className="copyrighter_site_footer">백수맛팬치</a>. All rights reserved.
    </p>
  );
}