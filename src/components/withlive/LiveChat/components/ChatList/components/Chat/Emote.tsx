import React from 'react';
import { ChatEmote } from 'components/withlive/LiveChat/LiveChat.type';

import styles from './Emote.module.scss';

export const Emote = React.memo(({ emote }: { emote: ChatEmote }) => {
  return (
    <div className={styles.Emote}>
      <img src={emote.imgPc} alt={emote.name} />
      <div className={styles.tip}>
        <span>{emote.name}</span>
      </div>
    </div>
  );
});
