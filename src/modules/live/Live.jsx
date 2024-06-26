import React, { useCallback, useEffect, useState, useRef } from 'react';

import Header from '../../common/Header/Header';
import Footer from '../../common/Footer/Footer';

import LiveSummary from './LiveSummary';
import BroadcasterPanel from './BroadcasterPanel.jsx';
import TwitchChat from './TwitchChat';
import VideoContentPlayer from '../../common/Components/VideoContentPlayer/VideoContentPlayer.jsx';

import * as func from '../../common/functions';

import './Live.scss';
import cx from 'classnames';

function addClassLive() {
  if (document.querySelector('.App')) {
    document.querySelector('.App').classList.add('live');
  } else {
    setTimeout(addClassLive, 100);
  }
}

export default function Live () {

  const [opened, setOpened] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // 브라우저 제목 설정
  useEffect(() => {
    func.setBrowserTitle('생방송');
    addClassLive();

    return () => {
      document.querySelector('.App')?.classList.remove('live');
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
  

  const onPlayerOptionChangedHandler = useCallback(({theaterMode, hovering}) => {
    console.log(hovering, opened)
    if (hovering !== undefined && hovering !== opened) {
      setOpened(hovering);
    }
    if (theaterMode !== undefined && theaterMode !== expanded) {
      setExpanded(theaterMode);
    }
  }, [opened, expanded]);

  // TODO: 유튜브 라이브 대응
  const broadcasterType = 'TWITCH';
  const videoId = 'woowakgood';
  const channelId = 'woowakgood'; // import.meta.env.VITE_TWITCH_CHANNEL_NAME

  const mediaType = broadcasterType == 'YOUTUBE' && videoId ? 'youtubeLive' : 
    broadcasterType == 'TWITCH' && videoId ? "twitchLive" : 
    broadcasterType == 'CHZZK' && videoId ? "chzzkLive" : "afreecaLive";
  const mediaId = broadcasterType == 'YOUTUBE' && channelId ? channelId : channelId; 
  return (<>
    {!expanded &&
      <Header />
    }
    <div className={cx('Live', {expanded: expanded})}>
      <div className={cx('playerWrapper', {opened: opened, expanded: expanded})} ref={refPlayerWrapper}>
        <VideoContentPlayer key="wakplayer" mediaType={mediaType} mediaId={mediaId} onPlayerOptionChanged={onPlayerOptionChangedHandler} /> 
        <LiveSummary channelId={channelId} expanded={expanded} onChangeOverlayState={onPlayerOptionChangedHandler} />
        <BroadcasterPanel channelId={channelId} />
        <Footer />
      </div>
      <TwitchChat />
    </div>
  </>);
}