import clsx from 'clsx';
import { LiveChatProvider } from './LiveChat.context';

import { LiveChatAdapter } from './LiveChatAdapter';
import { Header, CommonChatList, CollectorChatList, ChatSetting } from './components';

import styles from './LiveChat.module.scss';

export type Props = {
  className?: string;
  channelIds: string[];
  onClickHide?: () => void;
};

export function LiveChat(props: Props) {
  return (
    <LiveChatProvider>
      <div className={clsx('LiveChat', styles.container, props.className)}>
        <LiveChatAdapter channelIds={props.channelIds} />
        <Header onClickHide={props.onClickHide} />
        <CollectorChatList className={styles.collectorChatList} />
        <CommonChatList className={styles.commonChatList} />
        <ChatSetting />
      </div>
    </LiveChatProvider>
  );
}
