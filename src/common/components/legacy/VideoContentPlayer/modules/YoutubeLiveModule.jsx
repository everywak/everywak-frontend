import React, { useEffect, useState } from 'react';

import YouTube from 'react-youtube';

import { qualityIdYoutube } from './CommonModule';

import classNames from 'classnames/bind';
const cx = classNames;

/**
 *
 * @param {{className: string, videoId: string, domain: string, handlers: import('./CommonModule').VideoContentHandlers }} props
 * @returns {JSX.Element}
 */
function YoutubeLivePlayer({
  className = '',
  videoId = '',
  domain = '',
  handlers = {
    onReady: () => {},
    onPlay: () => {},
    onPlaying: () => {},
    onPause: () => {},
    onOnline: () => {},
    onOffline: () => {},
  },
  ...rest
}) {
  const [embed, setEmbed] = useState(null);
  const [player, setPlayer] = useState(null);

  const _onPlay = (e) => {
    handlers.onPlay(e);
  };
  const _onPlaying = (e) => {
    handlers.onPlaying(e);
  };
  const _onPause = (e) => {
    handlers.onPause(e);
  };
  const _onOnline = (e) => {
    handlers.onOnline(e);
  };
  const _onOffline = (e) => {
    handlers.onOffline(e);
  };

  useEffect(() => {
    const _embed = (
      <YouTube
        id={`streamembed_${videoId}`}
        className={cx('player', 'youtubeLive', className)}
        videoId={videoId}
        style={{}}
        title={'title'}
        loading={undefined}
        opts={{
          height: '100%',
          width: '100%',
          playerVars: {
            // https://developers.google.com/youtube/player_parameters
            rel: 0,
            autoplay: 0,
            controls: 0,
            enablejsapi: 1,
            modestbranding: 0,
            mute: 1,
          },
        }}
        onReady={(e) => {
          e.target.mute();
          setPlayer(e);
        }}
        onPlay={_onPlaying}
        onPause={_onPause} /*
      onEnd={func} 
      onError={func} 
      onStateChange={func} 
      onPlaybackRateChange={func} 
      onPlaybackQualityChange={func}*/
      />
    );
    setEmbed(_embed);
  }, [className, videoId]);

  useEffect(() => {
    if (player) {
      const _player = player.target;

      handlers.onReady({
        play: () => _player.playVideo(),
        pause: () => _player.pauseVideo(),
        setMuted: (muted) => (muted ? _player.mute() : _player.unMute()),
        getMuted: () => _player.isMuted(),
        setVolume: (val) => _player.setVolume(val),
        getVolume: () => _player.getVolume(),
        seek: (timestamp) => _player.seekTo(timestamp),
        getCurrentTime: () => _player.getCurrentTime(),
        getDuration: () => _player.getDuration(),
        setQuality: (quality) => _player.setPlaybackQuality(quality || 'auto'),
        getQuality: () => ({
          label: qualityIdYoutube[_player.getPlaybackQuality()],
          value: _player.getPlaybackQuality(),
        }),
        getQualities: () =>
          _player
            .getAvailableQualityLevels()
            .map((item) => ({ label: qualityIdYoutube[item], value: item })),
      });
    }
  }, [player]);

  return embed;
}

export default YoutubeLivePlayer;
