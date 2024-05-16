import { useEffect, useState } from 'react';
import { useLiveChatActions, useLiveChatValue } from '../LiveChat.context';
import { ChatList } from './ChatList';

export function CollectorChatList({ className }: { className?: string }) {
  const { collectedChatList } = useLiveChatValue();
  const { setOpenedCollectorView } = useLiveChatActions();

  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    setOpenedCollectorView(true);
  }, [setOpenedCollectorView]);

  return (
    <ChatList
      className={className}
      items={collectedChatList}
      autoScroll={autoScroll}
      onTouchToBottom={(touched) => setAutoScroll(touched)}
    />
  );
}
