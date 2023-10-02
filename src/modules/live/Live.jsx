import React, { useCallback, useEffect, useState, useRef } from 'react';

import Header from '../../common/Header/Header';
import Footer from '../../common/Footer/Footer';

import LiveSummary from './LiveSummary';
import BroadcasterPanel from './BroadcasterPanel.jsx';
import TwitchChat from './TwitchChat';
import VideoContentPlayer from '../../common/Components/VideoContentPlayer/VideoContentPlayer.jsx';

import * as func from '../../common/funtions';

import styles from './Live.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function addClassLive() {
  if (document.querySelector('.App')) {
    document.querySelector('.App').classList.add('live');
  } else {
    setTimeout(addClassLive, 100);
  }
}

export default function Live ({location, history}) {

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

  const channelId = 'woowakgood'; // process.env.REACT_APP_TWITCH_CHANNEL_NAME

  return (<>
    {!expanded &&
      <Header />
    }
    <div className={cx('Live', {expanded: expanded})}>
      <div className={cx('playerWrapper', {opened: opened, expanded: expanded})} ref={refPlayerWrapper}>
        <VideoContentPlayer key="wakplayer" mediaType="twitchLive" mediaId={channelId} onPlayerOptionChanged={onPlayerOptionChangedHandler} /> 
        <LiveSummary channelId={channelId} expanded={expanded} onChangeOverlayState={onPlayerOptionChangedHandler} />
        <BroadcasterPanel channelId={channelId} />
        <Footer />
      </div>
      <TwitchChat location={location} history={history} />
    </div>
  </>);
}