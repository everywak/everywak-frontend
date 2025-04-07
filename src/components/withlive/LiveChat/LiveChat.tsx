import clsx from 'clsx';
import { Stretchable } from 'common/components';
import { LiveChatProvider } from './LiveChat.context';

import { LiveChatAdapter } from './LiveChatAdapter';
import { Header, CommonChatList, CollectorChatList } from './components';

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
        <Stretchable
          className={styles.stretchableContainer}
          rotation="top"
          minSize={64}
          defaultSize={200}
        >
          <CollectorChatList className={styles.collectorChatList} />
        </Stretchable>
        <CommonChatList className={styles.commonChatList} />
      </div>
    </LiveChatProvider>
  );
}
