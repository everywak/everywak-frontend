import React from 'react';
import { AccentColor, ChatItem } from '../../../../LiveChat.type';

import styles from './Chat.module.scss';
import { Emote } from './Emote';
import { Profile } from './Profile';

export interface Props {
  item: ChatItem;
  isHideUserId: boolean;
  isHideProfile: boolean;
  isShowTimestamp: boolean;
}

const accentColor: Record<AccentColor, string> = {
  '': 'transparent',
  yellow: '#FFD700',
  red: '#FF0000',
};

export const Chat = React.memo((props: Props) => {
  if (props.item.type === 'system' || props.item.type === 'channel') {
    return <div className={styles.Chat}>{props.item.content}</div>;
  }

  const content = props.item.content.map((c, i) => {
    if (typeof c === 'string') {
      return <span key={i}>{c}</span>;
    }
    return <Emote key={i} emote={c} />;
  });

  return (
    <div
      className={styles.Chat}
      style={
        {
          '--accentColor': accentColor[props.item.accentColor] || 'transparent',
        } as React.CSSProperties
      }
    >
      <span className={styles.contentContainer}>
        {props.isShowTimestamp && (
          <span className={styles.timestamp}>
            {new Date(props.item.timestamp).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
              second: '2-digit',
            })}
          </span>
        )}
        {!props.isHideProfile && (
          <Profile
            profile={props.item.profile}
            isHideUserId={props.isHideUserId}
          />
        )}
        <span className={styles.content}>{content}</span>
      </span>
    </div>
  );
});
