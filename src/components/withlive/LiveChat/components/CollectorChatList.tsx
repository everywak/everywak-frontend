import { useState } from 'react';
import { useLiveChatValue } from '../LiveChat.context';
import { ChatList } from './ChatList/ChatList';
import { Stretchable } from 'common/components';

import styles from './CollectorChatList.module.scss';

export function CollectorChatList({ className }: { className?: string }) {
  const { collectedChatList, option } = useLiveChatValue();

  const [autoScroll, setAutoScroll] = useState(true);

  if (!option.isShowCollectorChat) {
    return <></>;
  }

  return (
    <Stretchable className={className} rotation="top" minSize={64} defaultSize={200}>
      <ChatList
        className={styles.chatList}
        items={collectedChatList}
        snackBarMessage=""
        autoScroll={autoScroll}
        onTouchToBottom={(touched) => setAutoScroll(touched)}
        options={option}
      />
    </Stretchable>
  );
}
