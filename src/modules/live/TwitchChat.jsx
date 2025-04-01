import React from 'react';

import { Waktaverse } from '../../common/constants';
import StretchableContainer from '../../common/Components/StretchableContainer/StretchableContainer';

import { LiveChat } from '../../components/withlive/LiveChat/LiveChat';

import './TwitchChat.scss';
import cx from 'classnames';

function TwitchChat({
  channelId = import.meta.env.VITE_TWITCH_CHANNEL_NAME,
  platform = 'twitch',
}) {
  const getChannelName = (platform, channelId) => {
    const result = [];
    if (platform === 'space') {
      result.push('x-space/');

      const target = Waktaverse.find(
        (member) => member.login_name === channelId,
      );
      if (!target || !target.twitter) {
        return '';
      }
      result.push(target.twitter.id);
    } else if (platform === 'afreeca') {
      result.push('afreeca/');

      const target = Waktaverse.find(
        (member) => member.login_name === channelId,
      );
      if (!target || !target.afreeca) {
        return '';
      }
      result.push(target.afreeca.channelId);
    } else if (platform === 'twitch') {
      const target = Waktaverse.find(
        (member) => member.login_name === channelId,
      );
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
    <StretchableContainer className={cx('TwitchChat', { small: 380 < 220 })}>
      <LiveChat
        className="liveChat"
        channelId={[getChannelName(platform, channelId)]}
      />
    </StretchableContainer>
  );
}

export default TwitchChat;
