import React, { useCallback, useEffect, useState, useRef } from 'react';

import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import VolumeDownRoundedIcon from '@mui/icons-material/VolumeDownRounded';
import VolumeMuteRoundedIcon from '@mui/icons-material/VolumeMuteRounded';
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded';

import SubtitlesRoundedIcon from '@mui/icons-material/SubtitlesRounded';
import SubtitlesOffRoundedIcon from '@mui/icons-material/SubtitlesOffRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import TabletRoundedIcon from '@mui/icons-material/TabletRounded';
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded';
import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded';

import { enableFullscreen, disableFullscreen } from '../../functions';

import useInputs from '../../../hooks/useInputs';
import useKeyboardHotkeys from '../../../hooks/useKeyboardHotkeys';

import { domain } from '../../constants';

import ProgressBar from '../ProgressBar/ProgressBar';
import BasicImage from '../Image/BasicImage';
import BasicButton from '../Button/BasicButton';
import ToggleButton from '../Button/ToggleButton';
import ContextMenu from '../ContextMenu/ContextMenu';

import TwitchLiveModule from './modules/TwitchLiveModule';
import YoutubeLiveModule from './modules/YoutubeLiveModule';
import YoutubeVideoModule from './modules/YoutubeVideoModule';
import ChzzkLiveTempModule from './modules/ChzzkLiveTempModule';
import AfreecaLiveModule from './modules/AfreecaLiveModule';

import './VideoContentPlayer.scss';
import cx from 'classnames';

const formatHMMSSString = seconds => (seconds >= 3600 ? `${parseInt(seconds / 3600)}:` : '') + `${parseInt(seconds / 60) % 60}:${('0' + parseInt(seconds % 60)).slice(-2)}`;

const useClicked = () => {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const _onMouseUp = () => setClicked(false);
    document.addEventListener('mouseup', _onMouseUp);

    return () => document.removeEventListener('mouseup', _onMouseUp);
  }, []);

  return [clicked, () => setClicked(true)];
}

/**
 * 
 * @param {React.MutableRefObject<undefined>} _el 
 * @param {string} name
 * @param {({target: {name: string, value: number}}) => void} onChange 
 * @returns {[boolean]}
 */
const useDelayedHovering = (ref, name, onChange, delay = 50) => {
  const [hovering, setHovering] = useState(false);
  const [lifeHovering, setLifeHovering] = useState(0);
  useEffect(() => {
    const loopLifeHovering = setInterval(() => {
      if (lifeHovering > 0) {
        setLifeHovering(val => --val);
        !hovering && setHovering(true);
        !hovering && onChange({target: {
          name,
          value: true,
        }});
      } else {
        hovering && setHovering(false);
        hovering && onChange({target: {
          name,
          value: false,
        }});
      }
    }, 50);

    ref.current.addEventListener('mousemove', e => {
      setLifeHovering(delay);
    });

    return(() => {
      clearInterval(loopLifeHovering);
    });
  }, [ref, delay, name, onChange, hovering, lifeHovering]);

  return [hovering];
}

/**
 * @typedef PlayerCustomButton
 * @property {string} className
 * @property {string} description
 * @property {'normal'|'toggle'} type
 * @property {string} name only type toggle
 * @property {boolean} value only type toggle
 * @property {JSX.Element} iconNormal only type normal
 * @property {JSX.Element} iconEnabled only type toggle
 * @property {JSX.Element} iconDisabled only type toggle
 * @property {boolean} disabled
 * @property {() => void} onClick
 */

/**
 * 
 * @param {{
 * className: string,
 * mediaType: 'twitchLive'|'youtubeVideo'|'youtubeLive'|'hls'|'video'
 * mediaId: string
 * startTime?: number
 * endTime?: number
 * title: string
 * description: string
 * playerSize: 'normal'|'simple'
 * useHotkey: boolean
 * theaterMode: boolean
 * contextMenu: import('../ContextMenu/ContextMenu').ContextMenuItemProps[]
 * headerButtons: PlayerCustomButton[]
 * controlButtons: PlayerCustomButton[]
 * onClickOverlay: React.MouseEventHandler<HTMLDivElement>
 * onPlayerStateChanged?: ({}) => void
 * onPlayerOptionChanged?: ({}) => void}} props 
 * @returns {JSX.Element}
 */
function VideoContentPlayer ({ 
  className, 
  mediaType, 
  mediaId, 
  startTime, 
  endTime, 
  title, 
  description, 
  playerSize = 'normal', 
  useHotkey = true, 
  theaterMode = false,
  contextMenu = [],
  headerButtons = [],
  controlButtons = [],
  onClickOverlay = () => {},
  onPlayerStateChanged = () => {},
  onPlayerOptionChanged = () => {},
  ...rest }) {
  const [playerEmbed, setPlayerEmbed] = useState(null);
  /**
   * @type {[import('./modules/CommonModule').VideoContentInterface, React.Dispatch<React.SetStateAction<import('./modules/CommonModule').VideoContentInterface>>]}
   */
  const [player, setPlayer] = useState(null);
  const _el = useRef(); // for fullscreen

  const [playerState, onChangeState, resetState] = useInputs({
    playing: false,
    isMuted: true,
    volume: 50,
    position: 0,
    duration: 0,
    startedTimeStamp: Date.now() + 9999999,
  });

  const [playerOptions, onChangeOption, resetOption] = useInputs({
    hovering: false,
    theaterMode: false,
    fullscreen: false,
    showCaption: false,
    showPlaybackInfo: true,
    openedSettings: false,
  });

  const [volumeBarClicked, setVolumeBarClicked] = useClicked();

  // media 변경 감지
  useEffect(() => {
    setPlayer(null);
    const _handlers = {
      onReady: e => setPlayer(e),
      onPlay: e => {
        console.log('onPlay')
      }, 
      onPlaying: e => {
        onChangeState({target: {
          name: 'playing',
          value: true,
        }})
      }, 
      onPause: e => {
        onChangeState({target: {
          name: 'playing',
          value: false,
        }})
      }, 
      onOnline: e => {
        console.log('onOnline')
      }, 
      onOffline: e => {
        console.log('onOffline')
      },
    };
    if (mediaType === 'twitchLive') {
      const embed = <TwitchLiveModule channelId={mediaId} domain={domain} handlers={_handlers} />;
      setPlayerEmbed(embed);
    } else if (mediaType === 'youtubeLive') {
      const embed = <YoutubeLiveModule videoId={mediaId} handlers={_handlers} />;
      setPlayerEmbed(embed);
    } else if (mediaType === 'youtubeVideo') {
      const embed = <YoutubeVideoModule videoId={mediaId} handlers={_handlers} />;
      setPlayerEmbed(embed);
    } else if (mediaType === 'chzzkLive') {
      const embed = <ChzzkLiveTempModule channelId={mediaId} handlers={_handlers} />;
      setPlayerEmbed(embed);
    } else if (mediaType === 'afreecaLive') {
      const embed = <AfreecaLiveModule channelId={mediaId} handlers={_handlers} />;
      setPlayerEmbed(embed);
    }
  }, [mediaType, mediaId]);
  
  // player 변경시(onReady)
  useEffect(() => {

    // state 초기화
    onChangeState({
      target: {
        name: 'isMuted',
        value: true,
      }
    });
    onChangeState({
      target: {
        name: 'startedTimeStamp',
        value: Date.now() + 9999999,
      }
    });

    //console.log('player')
    //console.log(player)
    if (player) {
      try{
        // 공통
        onChangeState({
          target: {
            name: 'volume',
            value: player.getVolume(),
          }
        });
        onChangeState({
          target: {
            name: 'isMuted',
            value: player.getMuted(),
          }
        });
        onChangeState({
          target: {
            name: 'duration',
            value: ['youtubeVideo', 'video'].includes(mediaType) ? player.getDuration() : 0,
          }
        });
        
      } catch(e) { console.error(e); }
    }
  }, [player]);
  useEffect(() => {
    
    const loopUpdateCurrentTime = setInterval(() => {
      player && onChangeState({
        target: {
          name: 'position',
          value: player.getCurrentTime(),
        }
      });
      mediaType === 'youtubeLive' && player && onChangeState({
        target: {
          name: 'startedTimeStamp',
          value: Math.min(Date.now() - player.getCurrentTime() * 1000, playerState.startedTimeStamp),
        }
      });
      mediaType === 'youtubeLive' && player && onChangeState({
        target: {
          name: 'duration',
          value: Math.max((Date.now() - playerState.startedTimeStamp) / 1000, 0),
        }
      });
    }, 100);
    
    return () => {
      clearInterval(loopUpdateCurrentTime);
    }
  }, [player, playerState]);

  // 플레이어 옵션값 변경 반영
  useEffect(() => {

    // 변경사항 외부 전달
    onPlayerOptionChanged({...playerOptions});

    // 전체화면 적용
    if (playerOptions.fullscreen) {
      enableFullscreen(_el.current);
    } else {
      disableFullscreen();
    }

    // 키입력에 의한 전체화면 전환 감지
    const loopCheckFullscreen = setInterval(() => {
      if (!document.fullscreenElement && playerOptions.fullscreen) {
        onChangeOption({target: {
          name: 'fullscreen',
          value: false,
        }})
      }
    }, 50);
    return () => {
      clearInterval(loopCheckFullscreen);
    }
  }, [playerOptions]);

  // 극장 모드 외부에서 변경
  useEffect(() => {
    if (theaterMode !== playerOptions.theaterMode) {
      toggleTheaterMode();
    }
  }, [theaterMode]);

  // 플레이어 조작값 변경 반영
  useEffect(() => {
    //console.log(playerState)
    try {
      if (player?.getMuted() != playerState.isMuted) {
        player?.setMuted(playerState.isMuted);
      }
      if (player?.getVolume() != playerState.volume) {
        player?.setVolume(playerState.volume);
      }
    } catch(e) { console.error(e); }

    // 변경사항 외부 전달
    onPlayerStateChanged(playerState);

  }, [player, playerState]);

  useDelayedHovering(_el, 'hovering', onChangeOption, playerSize === 'simple' ? 1 : 50);

  const togglePlayPause = useCallback(() => {
    playerState.playing ? player?.pause() : player?.play()
  }, [playerState, player]);
  const toggleMute = useCallback(() => {
    onChangeState({
      target: {
        name: 'isMuted',
        value: !playerState.isMuted,
      }
    })
  }, [playerState]);
  const toggleTheaterMode = useCallback(() => {
    onChangeOption({
      target: {
        name: 'theaterMode',
        value: !playerOptions.theaterMode,
      }
    })
  }, [playerOptions]);
  const toggleFullscreen = useCallback(() => {
    onChangeOption({
      target: {
        name: 'fullscreen',
        value: !playerOptions.fullscreen,
      }
    })
  }, [playerOptions]);

  const refreshPlayer = () => {
    player?.pause();
    setTimeout(() => {
      player?.play();
    }, 100);
  }

  useKeyboardHotkeys(useHotkey ? [
    {
      key: 'f', callback: toggleFullscreen,
    },
    {
      key: 't', altKey: true, callback: toggleTheaterMode,
    },
    {
      key: 'm', callback: toggleMute,
    },
    {
      key: ' ', callback: togglePlayPause,
    }
  ] : [], [player, playerState, playerOptions, useHotkey]);

  const volumeIcon = playerState.volume < 50 ?
  <VolumeMuteRoundedIcon className="iconImg" /> :
  (
    playerState.volume < 100 ?
    <VolumeDownRoundedIcon className="iconImg" /> :
    <VolumeUpRoundedIcon className="iconImg" />
  );
  /** @type {import('../ContextMenu/ContextMenu').ContextMenuItemProps[]} */
  const optionContextMenuItems = [
    {
      label: '화질',
      subLabel: player?.getQuality()?.label,
      items: player?.getQualities().map(item => ({
        label: item.label,
        name: 'playbackQuality',
        value: item.value,
        selected: false,
        onClick: e => player?.setQuality(item.value),
      })),
    },
    ...contextMenu
  ];
  const controlButtonItems = controlButtons.map(item => {
    if (item.type === 'toggle') {
      const EnabledIcon = item.iconEnabled;
      const DisabledIcon = item.iconDisabled;
      return <ToggleButton key={item.className} className={cx(item.className)} name={item.name} value={item.value} onChange={item.onChange} description={item.description} disabled={item.disabled} background="transparent">
        {
          item.value ?
          <EnabledIcon className="iconImg" /> :
          <DisabledIcon className="iconImg" />
        }
      </ToggleButton>;
    } else {
      const DeafultIcon = item.iconNormal;
      return <BasicButton key={item.className} className={cx(item.className)} onClick={item.onClick} description={item.description} background="transparent">
        <DeafultIcon className="iconImg" />
      </BasicButton>;
    }
  });
  const headerButtonItems = headerButtons.map(item => {
    if (item.type === 'toggle') {
      const EnabledIcon = item.iconEnabled;
      const DisabledIcon = item.iconDisabled;
      return <ToggleButton key={item.className} className={cx(item.className)} name={item.name} value={item.value} onChange={item.onChange} description={item.description} bottomRibbon disabled={item.disabled} background="transparent">
        {
          item.value ?
          <EnabledIcon className="iconImg" /> :
          <DisabledIcon className="iconImg" />
        }
      </ToggleButton>;
    } else {
      const DeafultIcon = item.iconNormal;
      return <BasicButton key={item.className} className={cx(item.className)} onClick={item.onClick} description={item.description} bottomRibbon background="transparent">
        <DeafultIcon className="iconImg" />
      </BasicButton>;
    }
  });
  return (
    <div className={cx('VideoContentPlayer', className)} ref={_el} {...rest}>
      {playerEmbed}
      <div className="spinnerWrapper hide">
        <div className="spinner"><div className="innerWrapper"><div className="inner"></div></div></div>
      </div>
      <div className={cx('overlay', {iframemode: mediaType === 'chzzkLive' || mediaType === 'afreecaLive', hover: playerOptions.hovering || volumeBarClicked || playerOptions.openedSettings, simple: playerSize === 'simple'})} onClick={onClickOverlay}>
        {mediaType === 'twitchLive' && player && <VideoContentPlayerPlaybackInfoPanel player={player} />}
        <div className="mediaInfo">
          <div className="descArea">
            <div className="title">{title}</div>
            {description && <div className="description">{description}</div>}
          </div>
          <div className="headerButtons">
            {headerButtonItems}
          </div>
        </div>
        <div className="captionText noContent"></div>
        <div className={cx('controls', {hideProgress: mediaType === 'twitchLive'})}>
          <ProgressBar className="videoProgress" min={0} max={playerState.duration} value={playerState.position} onChange={e => player?.seek(e.target.value)} />
          <div className="buttonArea">
            <div className="left">
              <BasicButton className="playpause" description={playerState.playing ? '일시정지' : '재생'} background="transparent" onClick={togglePlayPause}>
                {
                  playerState.playing ?
                  <PauseRoundedIcon className="iconImg paused" /> :
                  <PlayArrowRoundedIcon className="iconImg" />
                }
              </BasicButton>
              {
                ['twitchLive', 'youtubeLive', 'hls'].includes(mediaType) &&
                <BasicButton className="refresh" description="새로고침" background="transparent" onClick={refreshPlayer}>
                  <RefreshRoundedIcon className="iconImg" />
                </BasicButton>
              }
              <ToggleButton className="mute" name="isMuted" value={playerState.isMuted} onChange={onChangeState} description={playerState.isMuted ? '음소거 해제' : '음소거'} background="transparent">
                {
                  playerState.isMuted ?
                  <VolumeOffRoundedIcon className="iconImg" /> :
                  volumeIcon
                }
              </ToggleButton>
              <div className={cx('volumeWrapper', {show: volumeBarClicked})}>
                <ProgressBar className="volume" min={0} max={100} name="volume" value={playerState.volume} onChange={onChangeState} onMouseDown={e => {playerState.isMuted && toggleMute(); setVolumeBarClicked(e)}} actionType="drag" />
              </div>
              <div className="musicTime">
                <span className="currTime">{formatHMMSSString(playerState.position)}</span>
                <div className="line"></div>
                <span className="wholeTime">{formatHMMSSString(playerState.duration)}</span>
              </div>
            </div>
            <div className="right">
              <ToggleButton className="caption" name="showCaption" value={playerOptions.showCaption} onChange={onChangeOption} description={playerOptions.showCaption ? '자막 끄기' : '자막 켜기'} background="transparent">
                {
                  playerOptions.showCaption ?
                  <SubtitlesRoundedIcon className="iconImg" /> :
                  <SubtitlesOffRoundedIcon className="iconImg" />
                }
              </ToggleButton>
              <ToggleButton className={cx('settings', {on: playerOptions.openedSettings})} name="openedSettings" value={playerOptions.openedSettings} onChange={onChangeOption} description="옵션" background="transparent">
                <SettingsRoundedIcon className="iconImg" />
                {
                  playerOptions.openedSettings &&
                  <ContextMenu className='settings' direction='tl' items={optionContextMenuItems} />
                }
              </ToggleButton>
              {
                playerSize === 'normal' && controlButtonItems
              }
              {
                !playerOptions.fullscreen &&
                <ToggleButton className="theaterMode" name="theaterMode" value={playerOptions.theaterMode} onChange={onChangeOption} description="극장 모드" background="transparent">
                  <TabletRoundedIcon className="iconImg" />
                </ToggleButton>
              }
              <ToggleButton className="fullscreen" name="fullscreen" value={playerOptions.fullscreen} onChange={onChangeOption} description="전체화면" background="transparent">
                {
                  playerOptions.fullscreen ?
                  <FullscreenExitRoundedIcon className="iconImg" /> :
                  <FullscreenRoundedIcon className="iconImg" />
                }
              </ToggleButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 
 * @param {{player: import('./modules/CommonModule').VideoContentInterface}} props 
 */
function VideoContentPlayerPlaybackInfoPanel ({ player }) {

  const [playbackInfo, setPlaybackInfo] = useState({
    bufferSize: 0,
    hlsLatencyBroadcaster: 0,
    playbackRate: 0,
  });

  useEffect(() => {
    const loop = setInterval(() => {
      const _playbackInfo = player?.getPlaybackInfo();
      if (_playbackInfo) {
        setPlaybackInfo({
          bufferSize: _playbackInfo.bufferSize,
          hlsLatencyBroadcaster: _playbackInfo.hlsLatencyBroadcaster,
          playbackRate: _playbackInfo.playbackRate,
        });
      }
    }, 1000);

    return () => clearInterval(loop);
  }, []);
  return <div className="VideoContentPlayerPlaybackInfoPanel">
    <div className="summary">
      {parseInt(playbackInfo.bufferSize * 100) / 100}초<br />
      {parseInt(playbackInfo.hlsLatencyBroadcaster * 100) / 100}초<br />
    </div>
    <div className="detail">
      버퍼 크기: {parseInt(playbackInfo.bufferSize * 100) / 100}초<br />
      브로드캐스트 지연 시간: {parseInt(playbackInfo.hlsLatencyBroadcaster * 100) / 100}초<br />
      비트레이트: {playbackInfo.playbackRate}kbps
    </div>
  </div>
};


//TODO: 화면비율 핀치줌으로 확장
//TODO: 반복재생
export default VideoContentPlayer;