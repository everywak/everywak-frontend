import React, { useEffect, useState } from 'react';

import { TwitchPlayer } from 'react-twitch-embed';

import { qualityIdTwitch } from './CommonModule';

import classNames from 'classnames/bind';
const cx = classNames;

/**
 * Twitch Live Module
 * 
 * @param {import('./CommonModule').VideoContentHandlers} props 
 * @returns {JSX.Element}
 */
function TwitchLivePlayer ({
  className = '',
  channelId = '',
  domain = '',
  handlers = {
  onReady: () => {},
  onPlay: () => {},
  onPlaying: () => {},
  onPause: () => {},
  onOnline: () => {},
  onOffline: () => {}}, ...rest
}) {
  const [embed, setEmbed] = useState(null);
  const [player, setPlayer] = useState(null);

  const _onPlay = e => {
    handlers.onPlay(e);
  }
  const _onPlaying = e => {
    handlers.onPlaying(e);
  }
  const _onPause = e => {
    handlers.onPause(e);
  }
  const _onOnline = e => {
    handlers.onOnline(e);
  }
  const _onOffline = e => {
    handlers.onOffline(e);
  }

  useEffect(() => {
    const _embed = <TwitchPlayer id={`streamembed_${channelId}`} className={cx('player', 'twitchLive', className)} channel={channelId} parent={[domain]} 
    width="100%" height="100%" hideControls={true} muted={true} 
    onReady={setPlayer} onPlay={_onPlay} onPlaying={_onPlaying} onPause={_onPause} 
    onOnline={_onOnline} onOffline={_onOffline} {...rest} />;
    setEmbed(_embed);
  }, [className, channelId, domain]);

  useEffect(() => {
    if (player) {
      /** @type {import('./CommonModule').VideoContentInterface} */
      const videoContentInterface = {
        play: player.play,
        pause: player.pause,
        setMuted: player.setMuted,
        getMuted: player.getMuted,
        setVolume: volume => player.setVolume(volume / 100),
        getVolume: () => parseInt(player.getVolume() * 100),
        seek: timestamp => player.seek(timestamp),
        getCurrentTime: () => player.getCurrentTime(),
        getDuration: () => player.getDuration(),
        setQuality: quality => player.setQuality(quality || 'Auto'),
        getQuality: () => ({label: qualityIdTwitch[player.getQuality()], value: player.getQuality()}),
        getQualities: () => player.getQualities().map(item => ({label: qualityIdTwitch[item.name], value: item.name.includes('(source)') ? 'chunked' : item.name})),
        getPlaybackInfo: () => {
          const origInfo = player.getPlaybackStats();
          return ({
            bufferSize: origInfo.bufferSize,
            hlsLatencyBroadcaster: origInfo.hlsLatencyBroadcaster,
            playbackRate: origInfo.playbackRate,
          });
        },
      };
      handlers.onReady(videoContentInterface);
    }
  }, [player]);

  return embed;
};

export default TwitchLivePlayer;