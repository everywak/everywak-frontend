import React from 'react';
import { useParams } from 'react-router-dom';

import { domain, Waktaverse } from '../../common/constants';

import TwitchChatClient from './TwitchChatClient';

import styles from './ChatPopupPage.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function ChatPopupPage() {
  const { platform, channelId } = useParams();

  const getChannelName = (platform, channelId) => {
    const result = [];
    const target = Waktaverse.find(
      (member) => member.login_name === channelId || member.name === channelId,
    );
    if (platform === 'space') {
      result.push('x-space/');

      if (!target || !target.twitter) {
        return '';
      }
      result.push(target.twitter.id);
    } else if (platform === 'afreeca') {
      result.push('afreeca/');

      if (!target || !target.afreeca) {
        return '';
      }
      result.push(target.afreeca.channelId);
    } else if (platform === 'twitch') {
      if (!target) {
        return '';
      }
      result.push(channelId);
    } else {
      return '';
    }

    return result.join('');
  };

  let channelNames = channelId
    .split(',')
    .map((channelId) => getChannelName(platform, channelId));

  return (
    <TwitchChatClient
      className={cx('ChatPopupPage')}
      clientId={import.meta.env.VITE_TWITCH_CLIENT_ID}
      channelName={channelNames}
      platform={platform}
      redirectUri={`https://${domain}${window.location.pathname}`}
    />
  );
}

export default ChatPopupPage;
