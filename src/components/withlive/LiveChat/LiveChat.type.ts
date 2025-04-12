export type ChatOption = {
  maxDisplayCount: number;
  maxStoreCount: number;
  isHideUserId: boolean;
  isHideProfile: boolean;
  isHideAllBadge: boolean;
  isHideFanBadge: boolean;
  isShowTimestamp: boolean;
  isShowOnlyManager: boolean;
  isShowOnlySubscriber: boolean;
  isShowOnlyFan: boolean;
  isShowAllMultiView: boolean;
  isShowCollectorChat: boolean;
};

export type ChatCollectorOption = {
  byRole: ChatRole[]; // 왁타버스 멤버
  byGroup: ChatGroup[]; // 매니저/구독자/팬
  customFilters: ChatFilter[];
};

export type ChatFilter = {
  type: ChatFilterType;
  target: ChatFilterTarget;
  keyword: string;
};

export type ChatRole = 'master' | 'isedol' | 'gomem' | 'academy' | 'hardcore'; // TODO: api 타입으로 이동하기
export type ChatGroup = 'manager' | 'sub' | 'fan';

export type ChatFilterType = 'include' | 'exclude';
export const ChatFilterTypeName: Record<ChatFilterType, string> = {
  include: '포함',
  exclude: '제외',
} as const;
export type ChatFilterTarget = 'userId' | 'nickname' | 'message' | 'badge';
export const ChatFilterTargetName: Record<ChatFilterTarget, string> = {
  userId: '아이디',
  nickname: '닉네임',
  message: '채팅',
  badge: '뱃지',
} as const;

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
  colorDarkmode: string;
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

export type ChatSettingState = 'off' | 'general' | 'collector';
