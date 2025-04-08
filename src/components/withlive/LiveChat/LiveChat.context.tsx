import { createContext, ReactNode, useContext, useMemo, useRef, useState } from 'react';

import { ChatItem, ChatOption } from './LiveChat.type';

// TODO: 옵션 localStorage 연동

export type Values = {
  readonly channelId: string[];
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
  readonly setOpenedSetting: (state: boolean) => void;
  readonly setKeepOldChat: (state: boolean) => void;
  readonly setEnabledSendChat: (state: boolean) => void;
  readonly updateOption: (option: Partial<ChatOption>) => void;
  readonly addChatItem: (items: ChatItem[]) => void;
};

const LiveChatValueContext = createContext<Values | undefined>(undefined);
const LiveChatActionsContext = createContext<Actions | undefined>(undefined);

type Props = {
  readonly children: ReactNode;
};

export function LiveChatProvider(props: Props): JSX.Element {
  const [channelId, setChannelId] = useState<string[]>([]);
  const [isConnected, setConnected] = useState(false);
  const [isAuthorized, setAuthorized] = useState(false);
  const [isOpenedSetting, setOpenedSetting] = useState(false);
  const [isKeepOldChat, setKeepOldChat] = useState(false);
  const [isEnabledSendChat, setEnabledSendChat] = useState(false);
  const [option, setOption] = useState<ChatOption>({
    maxDisplayCount: 30,
    maxStoreCount: 500,
    isHideUserId: false,
    isHideProfile: false,
    isShowTimestamp: false,
    isShowOnlyManager: false,
    isShowOnlySubscriber: false,
    isShowOnlyFan: false,
    isShowAllMultiView: true,
    isShowCollectorChat: true,
    chatCollectorFilters: [
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

  const filterChat = (chatItem: ChatItem) => {
    if (chatItem.type !== 'chat') {
      return true;
    }
    const isManager = chatItem.profile.badge.some((badge) => badge.id === 'manager');
    const isSubscriber = chatItem.profile.badge.some((badge) => badge.id.includes('-sub-'));
    const isFan = chatItem.profile.badge.some((badge) => badge.id === 'fan');
    return !(
      (option.isShowOnlyManager && !isManager) ||
      (option.isShowOnlySubscriber && !isSubscriber) ||
      (option.isShowOnlyFan && !(isFan || isSubscriber))
    );
  };

  const addChatItem = (items: ChatItem[]) => {
    if (!items || items.length === 0) {
      return;
    }

    const filteredItems = items.filter(filterChat);

    chatList.current = [...chatList.current, ...filteredItems].slice(-option.maxStoreCount);
    setDisplayedChatList((prev) =>
      [...prev, ...filteredItems].slice(
        isKeepOldChat ? -option.maxStoreCount : -option.maxDisplayCount,
      ),
    );
    if (option.isShowCollectorChat) {
      const filteredCollectorItems = items.filter((item) => {
        if (item.type !== 'chat') {
          return false;
        }
        return option.chatCollectorFilters.some((filter) => {
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
      filteredCollectorItems.forEach((item) => {
        if (item.type === 'chat') {
          item.accentColor = 'yellow';
        }
      });
      setCollectedChatList((prev) => [...prev, ...filteredCollectorItems].slice(-option.maxDisplayCount));
    }
    onAddChatHandlers.current.forEach((handler) => handler(filteredItems));
  };

  const updateOption = (newOption: Partial<ChatOption>) => {
    setOption((prev) => ({
      ...prev,
      ...newOption,
    }));
  };

  const actions: Actions = useMemo(
    () => ({
      setChannelId,
      setConnected,
      setAuthorized,
      setOpenedSetting,
      setKeepOldChat,
      setEnabledSendChat,
      updateOption,
      addChatItem,
    }),
    [
      setChannelId,
      setConnected,
      setOpenedSetting,
      isKeepOldChat,
      setKeepOldChat,
      updateOption,
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
