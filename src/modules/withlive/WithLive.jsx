import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
import FirstPageRoundedIcon from '@mui/icons-material/FirstPageRounded';
import LastPageRoundedIcon from '@mui/icons-material/LastPageRounded';

import Header from '../../common/Header/Header';
import Footer from '../../common/Footer/Footer';

import ModalFrame from '../../common/Components/ModalFrame';

import LiveSummary from '../live/LiveSummary';
import BroadcasterPanel from '../live/BroadcasterPanel';
import TwitchChat from '../live/TwitchChat';
import VideoContentPlayer from '../../common/Components/VideoContentPlayer/VideoContentPlayer';

import SceneLayoutSettingPanel from './SceneLayoutSettingPanel';

import * as func from '../../common/funtions';
import * as service from '../../services/LiveWakApi';

import useInputs from '../../hooks/useInputs';

import ReactGA from 'react-ga';
import GAEvents from '../../common/GAEvents';

import styles from './WithLive.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * @typedef {'main-side'|'grid'} ViewLayoutOption
 * 
 * @typedef {object} LivePlayerItem
 * @property {string} name nickname
 * @property {string} id loginName
 * @property {number} pos
 * @property {number} volume 0~1
 */

const isedolStreams = [
  'woowakgood',
  'vo_ine',
  'jingburger',
  'lilpaaaaaa',
  'cotton__123',
  'gosegugosegu',
  'viichan6',
  '111roentgenium',
];

function addClassLive() {
  if (document.querySelector('.App')) {
    document.querySelector('.App').classList.add('live');
  } else {
    setTimeout(addClassLive, 100);
  }
}

export default function WithLive ({front = false, location, history}) {

  //TODO: playerOptions 로 통합
  const [opened, setOpened] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [playerOptions, onChangeOptions, reset] = useInputs({
    opened: false,
    openedSceneSettingPanel: false, 
    expanded: false, 
    hideChat: false,
  });

  //TODO: playerOptions 로 통합
  const [isOpenedSceneSettingPanel, setOpenedSceneSettingPanel] = useState(false);

  /** @type {[ViewLayoutOption, React.Dispatch<React.SetStateAction<ViewLayoutOption>>]} */
  const [viewLayout, setViewLayout] = useState('main-side');
  /** @type {[LivePlayerItem[], React.Dispatch<React.SetStateAction<LivePlayerItem[]>>]} */
  const [liveList, setLiveList] = useState([
    {
      name: '우왁굳',
      id: 'woowakgood',
      pos: 0,
      volume: 1, 
    }, 
  ])

  // 브라우저 제목 설정
  useEffect(() => {
    func.setBrowserTitle('왁타버스 같이보기');
    addClassLive();
    document.querySelector('body').style.overflowY = 'hidden';

    return () => {
      document.querySelector('.App') && document.querySelector('.App').classList.remove('live');
      document.querySelector('body').style.overflowY = 'auto';
    }
  }, []);

  const { search } = useLocation();
  const { group } = useParams();
  useEffect(() => {
    setStreams();
  }, []);

  async function setStreams() {
    const waktaverseInfo = await service.getWaktaverseInfo();
    const waktaverseLiveInfo = await service.getWaktaverseBroadcastInfo();

    const customMembers = (new URLSearchParams(search).get('members') || '').split(',');
    const members = (
      group === 'isedol' ? 
      isedolStreams : 
      customMembers.length > 0 && customMembers[0] !== '' ?
      customMembers :
      waktaverseLiveInfo.map(live => live.loginName)
    ).slice(0, 8);
    
    if (members.length > 0 && members[0] !== '') {

      /** @type {LivePlayerItem[]} */
      const streams = members.map((id, i) => ({
        name: waktaverseInfo.find(member => member.login === id).display_name,
        id,
        pos: i,
        volume: 1,
      }));

      // 메인으로 올 스트림 설정
      const channelId = new URLSearchParams(search).get('main');
      if (channelId) {
        const newMain = streams.find(live => live.id === channelId); // 가운데로 올 플레이어
        const oldMain = streams.find(live => live.pos === 0); // 가운데에 있던 플레이어
        if (newMain && oldMain && oldMain !== newMain) {
          const newMainPos = newMain.pos;
          newMain.pos = 0;
          oldMain.pos = newMainPos;
        }
      }

      setLiveList(streams);
    }
  }

  // GA 집계 누락 방지용 이벤트
  useEffect(() => {
    const loopEventGAWatching = setInterval(eventGAWatching, 30 * 1000);

    return () => {
      clearInterval(loopEventGAWatching);
    }
  }, []);
  
  function eventGAWatching() {
    ReactGA.event({
      category: GAEvents.Category.withlive,
      action: GAEvents.Action.withlive.watching,
    });
  }

  const refPlayerWrapper = useRef(null);

  useEffect(() => {
    if (!expanded) {
      refPlayerWrapper.current && refPlayerWrapper.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }, [expanded]);
  

  const onPlayerOptionChangedHandler = useCallback(({theaterMode, hovering}) => {
    if (hovering !== undefined && hovering !== opened) {
      setOpened(hovering);
    }
    if (theaterMode !== undefined && theaterMode !== expanded) {
      setExpanded(theaterMode);
    }
  }, [opened, expanded]);

  const setMainPlayer = useCallback(id => {
    const newMain = liveList.find(live => live.id === id); // 가운데로 올 플레이어
    const oldMain = liveList.find(live => live.pos === 0); // 가운데에 있던 플레이어
    if (newMain && oldMain && oldMain !== newMain) {
      const newMainPos = newMain.pos;
      newMain.pos = 0;
      oldMain.pos = newMainPos;
      setLiveList([...liveList]);
    }
  }, [liveList]);

  /**
   * 레이아웃 변경 핸들러
   * 
   * @param {{viewLayout: ViewLayoutOption, liveList: LivePlayerItem[]}} e 
   */
  const onChangeSceneSettingHandler = e => {
    setViewLayout(e.viewLayout);
    setLiveList(e.liveList);
    setOpenedSceneSettingPanel(false);
  };

  // 실제 플레이어 embed 리스트
  const livePlayerList = useMemo(() => liveList.map(live => 
    <FloatingWakPlayer 
      key={live.id} 
      channelId={live.id} 
      name={live.name} 
      target={`target_${live.pos}`} 
      expanded={expanded}
      onClick={setMainPlayer}
      setOpenedSceneSettingPanel={setOpenedSceneSettingPanel}
      onPlayerOptionChanged={onPlayerOptionChangedHandler}
      playerOptions={playerOptions}
      onChangeOptions={onChangeOptions}
      />
  ), [onPlayerOptionChangedHandler, liveList, setMainPlayer, playerOptions]);

  // 플레이어가 위치하는 div 리스트
  const [floatingTargetMain, ...floatingTargetSideList] = Array(liveList.length).fill(0).map((_, i) =>
    <FloatingTarget key={i} className={`target_${i}`} /> 
  );

  const mainChannelId = liveList.filter(v => v).find(live => live?.pos === 0)?.id;

  return (<>
    {!expanded && 
      <Header />
    }
    <div className={cx('WithLive', {expanded: expanded}, viewLayout)}>
      <div className={cx('playerWrapper', {opened: opened, expanded: expanded}, viewLayout)} ref={refPlayerWrapper}>
        {
          viewLayout === 'main-side' && 
          <>
            {floatingTargetMain}
            <LiveSummary channelId={mainChannelId} expanded={expanded} onChangeOverlayState={onPlayerOptionChangedHandler} />
            <BroadcasterPanel channelId={mainChannelId} />
            <Footer />
          </>
        }
        {
          viewLayout === 'grid' && 
          <div className="playerGrid" style={{'--gridColumns': Math.ceil(liveList.length / Math.ceil(Math.sqrt(liveList.length))), '--gridRows': Math.ceil(Math.sqrt(liveList.length))}}>
            {floatingTargetMain}
            {floatingTargetSideList}
          </div>
        }
      </div>
      {
        viewLayout === 'main-side' && 
        <ul className={cx('SidePlayerList', {opened: opened, expanded: expanded}, viewLayout)}>
          {floatingTargetSideList.slice(0, 7)}
        </ul>
      }
      {
        !playerOptions.hideChat &&
        <TwitchChat channelId={mainChannelId} location={location} history={history} />
      }
      <div className="wakPlayerList">
        {livePlayerList}
      </div>
      {
        isOpenedSceneSettingPanel &&
        <ModalFrame setOnModal={setOpenedSceneSettingPanel}>
          <SceneLayoutSettingPanel liveList={liveList} viewLayout={viewLayout} onClose={e => setOpenedSceneSettingPanel(false)} onSubmit={onChangeSceneSettingHandler} />
        </ModalFrame>
      }
    </div>
  </>)
}

function FloatingTarget({className, ...rest}) {

  return <div className={cx('FloatingTarget', className)} {...rest} />
}

function FloatingWakPlayer({channelId, name, target, expanded, onClick, onPlayerOptionChanged, setOpenedSceneSettingPanel}) {

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

  // 플레이어 전환에 따른 위치 이동시에만 트랜지션 활성화되게 
  const [transitionLife, setTransitionLife] = useState(0);

  const reduceTransitionLife = useCallback(() => {
    if (transitionLife > 0) {
      setTransitionLife(Math.max(transitionLife - 50, 0));
    }
  }, [transitionLife]);

  useEffect(() => {
    const loop = setInterval(reduceTransitionLife, 50);

    return () => {
      clearInterval(loop);
    }
  }, [reduceTransitionLife]);

  useEffect(() => {
    const loop = setInterval(checkChangedPosition, 50);
    setTransitionLife(200);

    return () => {
      clearInterval(loop);
    }
  }, [target])

  useEffect(updatePosition, [target, onClick]);

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

  const isOverlayBackgroundArea = className => {
    if (typeof className !== 'string') { return false; }

    return className.includes('overlay') || ['buttonArea', 'mediaInfo'].includes(className);
  };
  
  return (
    <div className={cx('FloatingWakPlayer', {isSide: target !== 'target_0', isMoving: transitionLife > 0})} style={style}>
      <VideoContentPlayer 
        key={`wakplayer_${channelId}`} 
        mediaType="twitchLive" mediaId={channelId} 
        playerSize={target === 'target_0' ? 'normal' : 'simple'} 
        useHotkey={target === 'target_0'}
        onClickOverlay={e => {isOverlayBackgroundArea(e.target.className) && onClick(channelId)}}
        theaterMode={expanded}
        contextMenu={[]}
        headerButtons={[
          {
            type: 'toggle',
            className: 'toggleChat',
            description: playerOptions.hideChat ? '채팅창 보이기' : '채팅창 숨기기',
            name: 'hideChat',
            value: playerOptions.hideChat,
            onChange: onChangeOptions,
            iconEnabled: FirstPageRoundedIcon,
            iconDisabled: LastPageRoundedIcon,
          }
        ]}
        controlButtons={[
          {
            type: 'normal',
            className: 'editLayout',
            description: '레이아웃 편집',
            onClick: e => setOpenedSceneSettingPanel(true),
            iconNormal: DashboardCustomizeRoundedIcon,
          }
        ]}
        onPlayerOptionChanged={e => target === 'target_0' && onPlayerOptionChanged(e)} /> 
    </div>
  );
}