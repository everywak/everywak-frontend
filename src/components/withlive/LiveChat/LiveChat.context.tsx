import { createContext, ReactNode, useContext, useMemo, useRef, useState } from 'react';

import { ChatItem, ChatOption } from './LiveChat.type';

// TODO: 옵션 localStorage 연동

export type Values = {
  readonly channelId: string[];
  readonly isOpenedCollectorView: boolean;
  readonly isConnected: boolean;
  readonly isAuthorized: boolean;
  readonly isOpenedSetting: boolean;
  readonly isKeepOldChat: boolean;
  readonly isEnabledSendChat: boolean;
  readonly option: ChatOption;
  readonly displayedChatList: ChatItem[];
  readonly collectedChatList: ChatItem[];
};

export type Actions = {
  readonly setChannelId: (ids: string[]) => void;
  readonly setConnected: (state: boolean) => void;
  readonly setAuthorized: (state: boolean) => void;
  readonly setOpenedCollectorView: (state: boolean) => void;
  readonly setOpenedSetting: (state: boolean) => void;
  readonly setKeepOldChat: (state: boolean) => void;
  readonly setEnabledSendChat: (state: boolean) => void;
  readonly setOption: (option: ChatOption) => void;
  readonly addChatItem: (items: ChatItem[]) => void;
};

const LiveChatValueContext = createContext<Values | undefined>(undefined);
const LiveChatActionsContext = createContext<Actions | undefined>(undefined);

type Props = {
  readonly children: ReactNode;
};

export function LiveChatProvider(props: Props): JSX.Element {
  const [channelId, setChannelId] = useState<string[]>([]);
  const [isOpenedCollectorView, setOpenedCollectorView] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [isAuthorized, setAuthorized] = useState(false);
  const [isOpenedSetting, setOpenedSetting] = useState(false);
  const [isKeepOldChat, setKeepOldChat] = useState(false);
  const [isEnabledSendChat, setEnabledSendChat] = useState(false);
  const [option, setOption] = useState<ChatOption>({
    maxDisplayCount: 30,
    maxStoreCount: 500,
    showOnlyManager: false,
    showOnlySubscriber: false,
    chatCollectorFilter: [
      {
        target: 'badge',
        keyword: 'manager',
        filter: 'include',
      },
    ],
  });
  const chatList = useRef<ChatItem[]>([]);
  const [displayedChatList, setDisplayedChatList] = useState<ChatItem[]>([]);
  const [collectedChatList, setCollectedChatList] = useState<ChatItem[]>([]);
  const onAddChatHandlers = useRef<((items?: ChatItem[]) => void)[]>([]);

  const addChatItem = (items: ChatItem[]) => {
    if (!items || items.length === 0) {
      return;
    }

    chatList.current = [...chatList.current, ...items].slice(-option.maxStoreCount);
    setDisplayedChatList((prev) =>
      [...prev, ...items].slice(isKeepOldChat ? -option.maxStoreCount : -option.maxDisplayCount),
    );
    if (isOpenedCollectorView) {
      const filteredItems = items.filter((item) => {
        if (item.type !== 'chat') {
          return false;
        }
        return option.chatCollectorFilter.some((filter) => {
          if (filter.target === 'user') {
            return (
              (item.profile.name.includes(filter.keyword) || item.profile.id === filter.keyword) ===
              (filter.filter === 'include')
            );
          } else if (filter.target === 'message') {
            return item.content.join('').includes(filter.keyword) === (filter.filter === 'include');
          } else if (filter.target === 'badge') {
            return item.profile.badge.some(
              (badge) => badge.id.includes(filter.keyword) === (filter.filter === 'include'),
            );
          }
        });
      });
      filteredItems.forEach((item) => {
        if (item.type === 'chat') {
          item.accentColor = 'yellow';
        }
      });
      setCollectedChatList((prev) => [...prev, ...filteredItems].slice(-option.maxDisplayCount));
    }
    onAddChatHandlers.current.forEach((handler) => handler(items));
  };

  const actions: Actions = useMemo(
    () => ({
      setChannelId,
      setConnected,
      setAuthorized,
      setOpenedCollectorView,
      setOpenedSetting,
      setKeepOldChat,
      setEnabledSendChat,
      setOption,
      addChatItem,
    }),
    [
      setChannelId,
      isOpenedCollectorView,
      setOpenedCollectorView,
      setConnected,
      setOpenedSetting,
      isKeepOldChat,
      setKeepOldChat,
      setOption,
      setDisplayedChatList,
      setCollectedChatList,
    ],
  );

  return (
    <LiveChatActionsContext.Provider value={actions}>
      <LiveChatValueContext.Provider
        value={{
          channelId,
          isConnected,
          isAuthorized,
          isOpenedCollectorView,
          isOpenedSetting,
          isKeepOldChat,
          isEnabledSendChat,
          option,
          displayedChatList,
          collectedChatList,
        }}
      >
        {props.children}
      </LiveChatValueContext.Provider>
    </LiveChatActionsContext.Provider>
  );
}

export function useLiveChatValue() {
  const value = useContext(LiveChatValueContext);
  if (!value) {
    throw new Error('useLiveChatValue should be used within LiveChatProvider');
  }
  return value;
}

export function useLiveChatActions() {
  const value = useContext(LiveChatActionsContext);
  if (!value) {
    throw new Error('useLiveChatActions should be used within LiveChatProvider');
  }
  return value;
}
