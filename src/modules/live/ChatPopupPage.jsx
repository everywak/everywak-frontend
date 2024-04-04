import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { domain, Waktaverse } from '../../common/constants';

import GAEvents from '../../common/GAEvents';
import * as func from '../../common/funtions';
import * as service from '../../services/Music';

import TwitchChatClient from './TwitchChatClient';

import styles from './ChatPopupPage.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function ChatPopupPage({ location, history }) {
  const { platform, channelId } = useParams();

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

  let channelName = getChannelName(platform, channelId);
  console.log(platform, channelId);
  console.log('channelName', channelName);

  return (
    <TwitchChatClient
      className={cx('ChatPopupPage')}
      clientId={process.env.REACT_APP_TWITCH_CLIENT_ID}
      channelName={channelName}
      platform={platform}
      redirectUri={`https://${domain}${location.pathname}`}
      location={location}
      history={history}
    />
  );
}

export default ChatPopupPage;
