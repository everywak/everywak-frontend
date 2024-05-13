import React, { useEffect, useState } from 'react';

import classNames from 'classnames/bind';
const cx = classNames;

/**
 * Afreeca Live Module
 * 
 * @param {import('./CommonModule').VideoContentHandlers} props 
 * @returns {JSX.Element}
 */
function AfreecaLivePlayer ({
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
    const _embed = <iframe id={`streamembed_${channelId}`} className={cx('player', 'afreecalive', className)} src={`https://play.afreecatv.com/${channelId}/embed?autoPlay=true`}
    allowFullScreen
     {...rest} />;
    setEmbed(_embed);
    setPlayer(_embed);
  }, [className, channelId, domain]);

  useEffect(() => {
    if (player) {
      /** @type {import('./CommonModule').VideoContentInterface} */
      const videoContentInterface = {
        play: () => {},
        pause: () => {},
        setMuted: () => {},
        getMuted: () => {},
        setVolume: () => {},
        getVolume: () => {},
        seek: () => {},
        getCurrentTime: () => {},
        getDuration: () => {},
        setQuality: () => {},
        getQuality: () => ({label: 'default', value: 'default'}),
        getQualities: () => [{label: 'default', value: 'default'}],
        getPlaybackInfo: () => {
          return ({
            bufferSize: 0,
            hlsLatencyBroadcaster: 0,
            playbackRate: 0,
          });
        },
      };
      handlers.onReady(videoContentInterface);
    }
  }, [player]);

  return embed;
};

export default AfreecaLivePlayer;