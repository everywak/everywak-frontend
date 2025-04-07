import StretchableContainer from 'common/Components/StretchableContainer/StretchableContainer';

import { LiveChatProvider } from './LiveChat.context';

import { LiveChatAdapter } from './LiveChatAdapter';
import { Header } from './components/Header';
import { CommonChatList } from './components/CommonChatList';
import { CollectorChatList } from './components/CollectorChatList';

import styles from './LiveChat.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export type Props = {
  className?: string;
  channelIds: string[];
  onClickHide?: () => void;
};

export function LiveChat(props: Props) {
  return (
    <LiveChatProvider>
      <div className={cx('LiveChat', props.className)}>
        <LiveChatAdapter channelIds={props.channelIds} />
        <Header onClickHide={props.onClickHide} />
        <StretchableContainer
          className={styles.stretchableContainer}
          rotation="top"
          minSize={64}
          defaultSize={200}
        >
          <CollectorChatList className={styles.collectorChatList} />
        </StretchableContainer>
        <CommonChatList className={styles.commonChatList} />
      </div>
    </LiveChatProvider>
  );
}
