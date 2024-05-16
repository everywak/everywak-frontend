import { ChatEmote } from 'modules/live/LiveChat/LiveChat.type';

import styles from './Emote.module.scss';

export function Emote({ emote }: { emote: ChatEmote }) {
  return (
    <div className={styles.Emote}>
      <img
        src={emote.imgPc}
        alt={emote.name}
      />
      <div className={styles.tip}>
        <span>{emote.name}</span>
      </div>
    </div>
  );
}
