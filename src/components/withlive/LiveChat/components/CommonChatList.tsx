import { useLiveChatActions, useLiveChatValue } from '../LiveChat.context';
import { ChatList } from './ChatList';

export function CommonChatList({ className }: { className?: string }) {
  const { displayedChatList, isKeepOldChat } = useLiveChatValue();
  const { setKeepOldChat } = useLiveChatActions();

  return (
    <ChatList
      className={className}
      items={displayedChatList}
      autoScroll={!isKeepOldChat}
      onTouchToBottom={touched => setKeepOldChat(!touched)}
    />
  );
}
