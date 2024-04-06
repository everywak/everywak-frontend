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

import { Waktaverse } from '../../common/constants';
import * as func from '../../common/functions';

import useInputs from '../../hooks/useInputs';
import useQueryWaktaverseLive from '../../hooks/useQueryWaktaverseLive';
import useWindowEvent from '../../hooks/useWindowEvent';

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
 * @property {'TWITCH'|'YOUTUBE'|'AFREECA'} broadcasterType broadcasterType
 * @property {string} videoId video id
 * @property {number} pos
 * @property {number} volume 0~1
 */
/**
 * @typedef SceneSetting
 * @property {ViewLayoutOption} viewLayout
 * @property {string[]} liveList
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

export default function WithLive ({front = false}) {

  //TODO: playerOptions 로 통합
  const [opened, setOpened] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [playerOptions, onChangeOptions, reset] = useInputs({
    opened: false,
    openedSceneSettingPanel: false, 
    expanded: false, 
    hideChat: false,
  });

  // url 파싱
  const { search } = useLocation();
  const { group } = useParams();

  //TODO: playerOptions 로 통합
  const [isOpenedSceneSettingPanel, setOpenedSceneSettingPanel] = useState(false);

  /** @type {[ViewLayoutOption, React.Dispatch<React.SetStateAction<ViewLayoutOption>>]} */
  const [viewLayout, setViewLayout] = useState(() => {
    const savedSceneSetting = func.getLocalStorage('everywak.withlive.sceneSetting');
    if (savedSceneSetting && ['main-side', 'grid'].includes(savedSceneSetting.viewLayout) && viewLayout != savedSceneSetting.viewLayout) {
      return savedSceneSetting.viewLayout;
    }
    return 'main-side';
  });
  /** @type {[LivePlayerItem[], React.Dispatch<React.SetStateAction<LivePlayerItem[]>>]} */
  const [liveList, setLiveList] = useState([]);
  useEffect(() => {
    const members = [];
    const savedSceneSetting = func.getLocalStorage('everywak.withlive.sceneSetting');
    const mainChannelId = new URLSearchParams(search).get('main'); // 메인으로 올 스트림
    if (savedSceneSetting) { // 최초 접속이 아니면
      const filteredSavedLiveList = savedSceneSetting.liveList.filter(loginName => Waktaverse.find(member => member.login_name === loginName));
      
      if (mainChannelId && Waktaverse.find(member => member.login_name === mainChannelId)) { // 메인으로 고정할 채널 있으면 고정
        members.push(mainChannelId, ...filteredSavedLiveList.filter(live => live !== mainChannelId));
      } else {
        members.push(...filteredSavedLiveList);
      }
    }
    
    if (members.length > 0 && members[0] !== '') {

      /** @type {LivePlayerItem[]} */
      const streams = members.slice(0, 8).map((id, i) => ({
        name: Waktaverse.find(member => member.login_name === id).name,
        broadcasterType: 'AFREECA',
        videoId: null,
        id,
        pos: i,
        volume: 1,
      }));

      // 메인으로 올 스트림 설정
      if (mainChannelId && Waktaverse.find(member => member.login_name === mainChannelId)) {
        const newMain = streams.find(live => live.id === mainChannelId); // 가운데로 올 플레이어
        const oldMain = streams.find(live => live.pos === 0); // 가운데에 있던 플레이어
        if (newMain && oldMain && oldMain !== newMain) {
          const newMainPos = newMain.pos;
          newMain.pos = 0;
          oldMain.pos = newMainPos;
        }
      }
      console.log('set LiveList 136')
      setLiveList(streams);
    }
    //return [];
  }, []);

  const { isLoading, data } = useQueryWaktaverseLive({ });

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

  useEffect(() => {
    if (isLoading || !data) {
      return () => {};
    }

    const prevMembers = liveList.map(live => live.id);
    const compareUpdatedStreams = (prevList, newList) => {
      return newList.reduce((isDiff, newStream) => {
        const prevStream = prevList.find(stream => stream.id === newStream.loginName);
        if (!prevStream) { return isDiff; }
        if (newStream.broadcaster !== prevStream.broadcasterType) {
          return true;
        }
        if (newStream.broadcaster === prevStream.broadcasterType
          && newStream.videoId !== prevStream.videoId) {
          return true;
        }
        return isDiff;
      }, false)
    };
    if (prevMembers.length > 0 && !compareUpdatedStreams(liveList, data.lives)) {
      return () => {};
    }

    // 초기 방송 세팅
    const members = [];
    /** @type {SceneSetting | null} */
    const savedSceneSetting = func.getLocalStorage('everywak.withlive.sceneSetting');
    const customMembers = (new URLSearchParams(search).get('members') || '').split(',').filter(loginName => data.members.find(member => member.twitchLoginName === loginName));
    const mainChannelId = new URLSearchParams(search).get('main'); // 메인으로 올 스트림
    if (savedSceneSetting) { // 최초 접속이 아니면
      if (['main-side', 'grid'].includes(savedSceneSetting.viewLayout) && viewLayout != savedSceneSetting.viewLayout) {
        setViewLayout(savedSceneSetting.viewLayout);
      }
      const filteredSavedLiveList = savedSceneSetting.liveList.filter(loginName => data.members.find(member => member.twitchLoginName === loginName));
      
      if (mainChannelId && data.members.find(member => member.twitchLoginName === mainChannelId)) { // 메인으로 고정할 채널 있으면 고정
        members.push(mainChannelId, ...filteredSavedLiveList.filter(live => live !== mainChannelId));
      } else {
        members.push(...filteredSavedLiveList);
      }
    } else if (group === 'isedol') { // 이세돌 같이보기 페이지면
      members.push(...isedolStreams);
    } else if (customMembers.length > 0 && customMembers[0] !== '') { // 커스텀 멤버가 지정되어 있으면
      members.push(...customMembers);
    } else {
      members.push(...data.lives.map(live => live.loginName)); // 생방송인 채널
    }
    
    if (members.length > 0 && members[0] !== '') {
      if (!savedSceneSetting) {
        func.setLocalStorage('everywak.withlive.sceneSetting', {
          viewLayout,
          liveList: members,
        });
      }

      /** @type {LivePlayerItem[]} */
      const streams = members.slice(0, 8).map((id, i) => ({
        name: data.members.find(member => member.twitchLoginName === id).nickname,
        broadcasterType: data.lives.find(live => live.loginName == id)?.broadcaster || 'TWITCH',
        videoId: data.lives.find(live => live.loginName == id)?.videoId,
        id,
        pos: i,
        volume: 1,
      }));

      // 메인으로 올 스트림 설정
      if (mainChannelId && data.members.find(member => member.twitchLoginName === mainChannelId)) {
        const newMain = streams.find(live => live.id === mainChannelId); // 가운데로 올 플레이어
        const oldMain = streams.find(live => live.pos === 0); // 가운데에 있던 플레이어
        if (newMain && oldMain && oldMain !== newMain) {
          const newMainPos = newMain.pos;
          newMain.pos = 0;
          oldMain.pos = newMainPos;
        }
      }
      setLiveList(streams);
    }
  }, [isLoading, data, liveList]);

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
      func.setLocalStorage('everywak.withlive.sceneSetting', {
        viewLayout: viewLayout,
        liveList: liveList.sort((a, b) => a.pos - b.pos).map(item => item.id),
      });
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
    func.setLocalStorage('everywak.withlive.sceneSetting', {
      viewLayout: e.viewLayout,
      liveList: e.liveList.map(item => item.id),
    });
    setOpenedSceneSettingPanel(false);
  };

  // 실제 플레이어 embed 리스트
  const livePlayerList = useMemo(() => liveList.map(live => 
    <FloatingWakPlayer 
      key={live.id} 
      channelId={live.id} 
      broadcasterType={live.broadcasterType}
      videoId={live.videoId}
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

  const mainChannel = liveList.filter(v => v).find(live => live?.pos === 0);
  const mainChannelId = mainChannel?.id;
  const mainChannelPlatform = mainChannel?.broadcasterType.toLowerCase();

  return (<>
    {!expanded && 
      <Header />
    }
    <div className={cx('WithLive', {expanded: expanded}, viewLayout)} style={{'--sidePlayerCount': Math.min(Math.max(floatingTargetSideList.length, 2), 7)}}>
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
        <TwitchChat channelId={mainChannelId} platform={mainChannelPlatform} />
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

function FloatingWakPlayer({channelId, name, broadcasterType, videoId, target, expanded, onClick, playerOptions, onChangeOptions, onPlayerOptionChanged, setOpenedSceneSettingPanel}) {

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

  useWindowEvent('resize', checkChangedPosition);

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

    return className.includes('overlay') || ['buttonArea', 'mediaInfo', 'descArea', 'controls hideProgress'].includes(className);
  };
  const getMediaInfo = (broadcasterType, channelId, videoId) => {
    const result = ['twitchLive', 'woowakgood'];
    if (broadcasterType == 'TWITCH') {
      result[0] = 'twitchLive';
      result[1] = channelId;
    }
    if (broadcasterType == 'YOUTUBE' && videoId) {
      result[0] = 'youtubeLive';
      result[1] = videoId;
    }
    if (broadcasterType == 'CHZZK' && videoId) {
      result[0] = 'chzzkLive';
      result[1] = videoId;
    }
    if (broadcasterType == 'AFREECA' && videoId) {
      result[0] = 'afreecaLive';
      result[1] = `${channelId}/${videoId}`;
    }

    return result;
  }

  const [mediaType, mediaId] = getMediaInfo(broadcasterType, channelId, videoId);
  
  return (
    <div className={cx('FloatingWakPlayer', {isSide: target !== 'target_0', isMoving: transitionLife > 0})} style={style}>
      <VideoContentPlayer 
        key={`wakplayer_${channelId}`} 
        mediaType={mediaType} mediaId={mediaId} 
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