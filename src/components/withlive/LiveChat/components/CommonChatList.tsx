import { useLiveChatActions, useLiveChatValue } from '../LiveChat.context';
import { ChatList } from './ChatList/ChatList';

export function CommonChatList({ className }: { className?: string }) {
  const { displayedChatList, isKeepOldChat, isConnected, isAuthorized } =
    useLiveChatValue();
  const { setKeepOldChat } = useLiveChatActions();

  const getSnackBarMessage = (isConnected: boolean, isAuthorized: boolean) => {
    if (!isConnected) {
      return '채팅 서버 연결중...';
    }
    if (!isAuthorized) {
      return '로그인중...';
    }
    return '';
  };

  return (
    <ChatList
      className={className}
      items={displayedChatList}
      snackBarMessage={getSnackBarMessage(isConnected, isAuthorized)}
      autoScroll={!isKeepOldChat}
      onTouchToBottom={(touched) => setKeepOldChat(!touched)}
    />
  );
}
