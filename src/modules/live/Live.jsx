import React, { useEffect, useState, useRef } from 'react';

import Footer from '../../common/Footer/Footer.js';

import LiveSummary from './LiveSummary';
import TwitchChat from './TwitchChat';
import WakPlayer from './WakPlayer';

import * as func from '../../common/funtions';

import styles from './Live.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function Live ({front = false, location, history}) {

  const [opened, setOpened] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // 브라우저 제목 설정
  useEffect(() => {
    if (!front) {
      func.setBrowserTitle('생방송');
      document.getElementsByClassName('App')[0].classList.add('live');
    }

    return () => {
      document.getElementsByClassName('App')[0].classList.remove('live');
    }
  }, []);

  const refPlayerWrapper = useRef(null);

  useEffect(() => {
    if (!expanded) {
      refPlayerWrapper.current && refPlayerWrapper.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }, [expanded]);
  

  function onChangeOverlayStateHandler({expanded, opened}) {
    if (opened !== undefined) {
      setOpened(opened);
    }
    if (expanded !== undefined) {
      setExpanded(expanded);
    }
    console.log('expand', expanded, 'opened', opened);
  }

  return (// process.env.REACT_APP_TWITCH_CHANNEL_NAME
    front ?
    <LiveFront /> :
    <div className={cx('Live')}>
      <div className={cx('playerWrapper', {opened: opened, expanded: expanded})} ref={refPlayerWrapper}>
        <WakPlayer key="wakplayer" channelId="woowakgood" onChangeOverlayState={onChangeOverlayStateHandler} /> 
        <LiveSummary expanded={expanded} onChangeOverlayState={onChangeOverlayStateHandler} />
        <BroadcasterPanel />
        <Footer />
      </div>
      <TwitchChat location={location} history={history} />
    </div>
  )
}

/**
 * FrontPage에 표시되는 생방송 컴포넌트
 */
function LiveFront() {
  return (
    <div className={cx('Live', 'front')}>
      <WakPlayer key="wakplayer" channelId="woowakgood" />
      <LiveSummary style="simple" />
    </div>
  );
}

/**
 * 후원 배너 등 각종 패널들
 */
function BroadcasterPanel() {
  
  return (
    <div className="BroadcasterPanel">
      <div className="panelContainer">
        <a href="https://toon.at/donate/637445810791017450" target="_blank"><img src="https://everywak.kr/live/images/panel-donate2.png" alt="투네이션" /></a>
        <a href="https://cafe.naver.com/steamindiegame" target="_blank"><img src="https://everywak.kr/live/images/panel-wakki.png" alt="우왁끼" /></a>
      </div>
      <p className="footerTxt">
        에브리왁굳 우왁굳 생방송 페이지는 YouTube 및 Twitch의 서드파티 사이트로 YouTube 및 Twitch에서 운영하는 사이트가 아닙니다.<br/>
        'YouTube' 및 '유튜브'는 YouTube, LLC의 등록상표이며 'Twitch' 및 '트위치'는 Twitch Interactive, Inc.의 등록상표입니다.<br/>
        &nbsp;<br/>
        에브리왁굳 © 2020-2022. <a href="https://github.com/wei756" className="copyrighter_site_footer">Wei756</a>. All rights reserved.
      </p>
    </div>
  );
}