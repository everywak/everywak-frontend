export type ChatFilter = {
  target: 'user' | 'message' | 'badge';
  keyword: string;
  filter: 'include' | 'exclude';
};

export type ChatOption = {
  maxDisplayCount: number;
  maxStoreCount: number;
  isHideUserId: boolean;
  isHideProfile: boolean;
  isShowTimestamp: boolean;
  isShowOnlyManager: boolean;
  isShowOnlySubscriber: boolean;
  isShowOnlyFan: boolean;
  isShowAllMultiView: boolean;
  isShowCollectorChat: boolean;
  chatCollectorFilters: ChatFilter[];
};

export type AccentColor = '' | 'yellow' | 'red';

export type ChatBadge = {
  id: string;
  name: string;
  icon: string;
};

export type ChatProfile = {
  id: string;
  name: string;
  badge: ChatBadge[];
  color: string;
};

export type ChatEmote = {
  name: string;
  id: string;
  imgPc: string;
  imgMobile: string;
  groupId: string;
  groupName: string;
  isMoving: boolean;
};

export type ChatItem = ChatItemCommonChat | ChatItemSystemMessage | ChatItemChannelMessage;

export type ChatItemCommonChat = {
  type: 'chat';
  channelId: string;
  id: string;
  profile: ChatProfile;
  content: (string | ChatEmote)[];
  timestamp: number;
  accentColor: AccentColor;
};

export type ChatItemSystemMessage = {
  type: 'system';
  id: string;
  content: string[];
  timestamp: number;
};

export type ChatItemChannelMessage = {
  type: 'channel';
  channelId: string;
  id: string;
  content: string[];
  timestamp: number;
};
