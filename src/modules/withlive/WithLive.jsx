import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import Footer from '../../common/Footer/Footer.js';

import LiveSummary from '../live/LiveSummary';
import TwitchChat from '../live/TwitchChat';
import WakPlayer from '../live/WakPlayer';

import * as func from '../../common/funtions';

import styles from './WithLive.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function WithLive ({front = false, location, history}) {

  const [opened, setOpened] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [liveList, setLiveList] = useState([
    {
      name: '우왁굳',
      id: 'woowakgood',
      pos: 0,
      volume: 1, 
    }, 
    {
      name: '고세구',
      id: 'gosegugosegu',
      pos: 1,
      volume: .5, 
    }, 
    {
      name: '릴파',
      id: 'lilpaaaaaa',
      pos: 2,
      volume: .5, 
    },
    {
      name: '비챤',
      id: 'viichan6',
      pos: 3,
      volume: .5, 
    },
    {
      name: '아이네',
      id: 'vo_ine',
      pos: 4,
      volume: .5, 
    },
    {
      name: '주르르',
      id: 'cotton__123',
      pos: 5,
      volume: .5, 
    },
    {
      name: '징버거',
      id: 'jingburger',
      pos: 6,
      volume: .5, 
    },
    {
      name: '뢴트게늄',
      id: '111roentgenium',
      pos: 7,
      volume: .5, 
    },
  ])

  // 브라우저 제목 설정
  useEffect(() => {
    if (!front) {
      func.setBrowserTitle('왁타버스 같이보기');
      document.getElementsByClassName('App')[0].classList.add('live');
    }

    return () => {
      document.getElementsByClassName('App')[0].classList.remove('live');
    }
  }, []);

  const { search } = useLocation();
  const { group } = useParams();
  useEffect(() => {
    const members = (new URLSearchParams(search).get('members') || '').split(',');
    const channelId = new URLSearchParams(search).get('main');
    if (channelId) {
      setTimeout(() => {setMainPlayer(channelId)}, 1);
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
  }

  function setMainPlayer(id) {
    const newMain = liveList.find(live => live.id === id); // 가운데로 올 플레이어
    const oldMain = liveList.find(live => live.pos === 0); // 가운데에 있던 플레이어
    if (newMain && oldMain && oldMain !== newMain) {
      const newMainPos = newMain.pos;
      newMain.pos = 0;
      oldMain.pos = newMainPos;
      setLiveList([...liveList]);
    }
  }

  // 실제 플레이어 embed 리스트
  const livePlayerList = liveList.map(live => 
    <FloatingWakPlayer 
      channelId={live.id} 
      name={live.name} 
      target={`target_${live.pos}`} 
      onClick={setMainPlayer}
      onChangeOverlayState={onChangeOverlayStateHandler} />
  )

  // 플레이어가 위치하는 div 리스트
  const [floatingTargetMain, ...floatingTargetSideList] = Array(8).fill(0).map((_, i) =>
    <FloatingTarget className={`target_${i}`} /> 
  );


  const mainChannelId = liveList.find(live => live.pos === 0).id;

  return (
    <div className={cx('WithLive')}>
      <div className={cx('playerWrapper', {opened: opened, expanded: expanded})} ref={refPlayerWrapper}>
        {floatingTargetMain}
        <LiveSummary channelId={mainChannelId} expanded={expanded} onChangeOverlayState={onChangeOverlayStateHandler} />
        <BroadcasterPanel />
        <Footer />
      </div>
      <ul className={cx('SidePlayerList')}>
        {floatingTargetSideList}
      </ul>
      <TwitchChat channelId={mainChannelId} location={location} history={history} />
      <div className="wakPlayerList">
        {livePlayerList}
      </div>
    </div>
  )
}

function FloatingTarget({className, ...rest}) {

  return <div className={cx('FloatingTarget', className)} {...rest} />
}

function FloatingWakPlayer({channelId, name, target, onClick, onChangeOverlayState}) {

  const [style, setStyle] = useState({
    top: '0px',
    left: '0px',
    width: '0px',
    height: '0px',
    '--name': `'${name}'`,
  });

  const prevRect = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  };

  useEffect(() => {
    const loop = setInterval(checkChangedPosition, 10);

    return () => {
      clearInterval(loop);
    }
  }, [target])

  useEffect(updatePosition, [target]);

  function checkChangedPosition() {
    const newRect = document.getElementsByClassName(target)[0].getBoundingClientRect();
    if (diffRect(prevRect, newRect)) {
      updatePosition();
      prevRect.top = newRect.top;
      prevRect.left = newRect.left;
      prevRect.width = newRect.width;
      prevRect.height = newRect.height;
    }
  }

  function diffRect(prevRect, newRect) {
    return (prevRect.top !== newRect.top ||
      prevRect.left !== newRect.left ||
      prevRect.width !== newRect.width ||
      prevRect.height !== newRect.height
    );
  }

  function updatePosition() {
    const newRect = document.getElementsByClassName(target)[0].getBoundingClientRect();

    setStyle({
      top: `${newRect.top}px`,
      left: `${newRect.left}px`,
      width: `${newRect.width}px`,
      height: `${newRect.height}px`,
      '--name': `'${name}'`,
    })
  }
  
  return (
    <div className={cx('FloatingWakPlayer', {isSide: target !== 'target_0'})} style={style}>
      <WakPlayer 
        key={`wakplayer_${channelId}`} 
        channelId={channelId} 
        overlayStyle={target === 'target_0' ? 'normal' : 'volumeOnly'} 
        onClickOverlay={e => {console.log(e.target.className);e.target.className === 'controller' && onClick(channelId)}}
        onChangeOverlayState={e => target === 'target_0' && onChangeOverlayState(e)} />
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
        에브리왁굳 왁타버스 같이보기 페이지는 YouTube 및 Twitch의 서드파티 사이트로 YouTube 및 Twitch에서 운영하는 사이트가 아닙니다.<br/>
        'YouTube' 및 '유튜브'는 YouTube, LLC의 등록상표이며 'Twitch' 및 '트위치'는 Twitch Interactive, Inc.의 등록상표입니다.<br/>
        &nbsp;<br/>
        에브리왁굳 © 2020-2022. <a href="https://github.com/wei756" className="copyrighter_site_footer">Wei756</a>. All rights reserved.
      </p>
    </div>
  );
}