import React from 'react';

import { domain, Waktaverse } from '../../common/constants';
import StretchableContainer from '../../common/Components/StretchableContainer/StretchableContainer';

import TwitchChatClient from './TwitchChatClient';

import styles from './TwitchChat.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function TwitchChat ({ channelId = process.env.REACT_APP_TWITCH_CHANNEL_NAME, platform = 'twitch' }) {

  const getChannelName = (platform, channelId) => {
    const result = [];
    if (platform === 'space') {
      result.push('x-space/');

      const target = Waktaverse.find(member => member.login_name === channelId);
      if (!target || !target.twitter) {
        return '';
      }
      result.push(target.twitter.id);
    } else if (platform === 'afreeca') {
      result.push('afreeca/');

      const target = Waktaverse.find(member => member.login_name === channelId);
      if (!target || !target.afreeca) {
        return '';
      }
      result.push(target.afreeca.channelId);
    } else if (platform === 'twitch') {
      const target = Waktaverse.find(member => member.login_name === channelId);
      if (!target) {
        return '';
      }
      result.push(channelId);
    } else {
      return '';
    }

    return result.join('');
  };

  return (
  <StretchableContainer className={cx('TwitchChat', {small: 380 < 220})}>
    <TwitchChatClient 
      clientId={process.env.REACT_APP_TWITCH_CLIENT_ID} 
      channelName={getChannelName(platform, channelId)} 
      platform={platform}
      redirectUri={`https://${domain}${window.location.pathname}`}
    />
  </StretchableContainer>
  );
}

export default TwitchChat;