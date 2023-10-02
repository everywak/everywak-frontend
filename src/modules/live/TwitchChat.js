import React from 'react';

import { domain } from '../../common/constants';
import StretchableContainer from '../../common/Components/StretchableContainer/StretchableContainer';

import TwitchChatClient from './TwitchChatClient';

import styles from './TwitchChat.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function TwitchChat ({ channelId = process.env.REACT_APP_TWITCH_CHANNEL_NAME, location, history }) {

  return (
  <StretchableContainer className={cx('TwitchChat', {small: 380 < 220})}>
    <TwitchChatClient 
      clientId={process.env.REACT_APP_TWITCH_CLIENT_ID} 
      channelName={channelId} 
      redirectUri={`https://${domain}${location.pathname}`}
      location={location}
      history={history}
    />
  </StretchableContainer>
  );
}

export default TwitchChat;