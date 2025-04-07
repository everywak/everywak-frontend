export enum ChatType {
  PING = 0, // 접속 유지
  LOGIN = 1, // 로그인
  JOIN = 2, // 채널 입장
  PART = 3, // 채널 퇴장
  CHLIST = 4, // 입장한 채널 목록

  SYSMSG = 10, // 채팅창 열림/닫힘 등 시스템 메시지
  CHNOTICE = 11, // 채널 공지

  PRIVMSG = 20, // 유저 채팅
  DONATION = 21, // 후원
  BLOCK = 22, // 제재(타임아웃, 강퇴)

  ICEMODE = 30, // 얼리기모드
  SLOWMODE = 31, // 슬로우모드

  POLL = 50, // 투표
}

export type Chat =
  | ChatPingRequest
  | ChatPingResponse
  | ChatLoginRequest
  | ChatLoginResponse
  | ChatJoinRequest
  | ChatJoinResponse
  | ChatPartRequest
  | ChatPartResponse
  | ChatChannelListRequest
  | ChatChannelListResponse
  | ChannelChat;

export type ChannelChat =
  | ChatSystemMessageResponse
  | ChatChannelNoticeResponse
  | ChatPrivateMessageResponse
  | ChatDonationResponse
  | ChatBlockResponse
  | ChatIceModeResponse
  | ChatSlowModeResponse
  | ChatPollResponse;

export type ChatBase<T extends ChatType = ChatType, U = undefined> = {
  type: T;
} & (U extends undefined ? {} : { body: U });

export type ChannelChatBase<T extends ChatType = ChatType, U = undefined> = ChatBase<T, U> & {
  channelId: string;
};

export type ChatPingRequest = ChatBase<ChatType.PING>;
export type ChatPingResponse = ChatPingRequest;

export type ChatLoginRequest = ChatBase<
  ChatType.LOGIN,
  {
    userId: string;
  }
>;
export type ChatLoginResponse = ChatLoginRequest & {
  success: boolean;
};

export type ChatJoinRequest = ChatBase<
  ChatType.JOIN,
  {
    userId: string;
    channelIds: string[];
  }
>;
export type ChatJoinResponse = ChatJoinRequest & {
  success: boolean;
};

export type ChatPartRequest = ChatBase<
  ChatType.PART,
  {
    userId: string;
    channelIds: string[];
  }
>;
export type ChatPartResponse = ChatPartRequest & {
  success: boolean;
};

export type ChatChannelListRequest = ChatBase<
  ChatType.CHLIST,
  {
    userId: string;
  }
>;
export type ChatChannelListResponse = ChatBase<
  ChatType.CHLIST,
  {
    userId: string;
    channelIds: string[];
  }
> & {
  success: boolean;
};

export type ChatSystemMessageResponse = ChannelChatBase<
  ChatType.SYSMSG,
  {
    message: string;
  }
>;

export type ChatChannelNoticeResponse = ChannelChatBase<
  ChatType.CHNOTICE,
  {
    message: string;
  }
>;

export type ChatPrivateMessageResponse = ChannelChatBase<
  ChatType.PRIVMSG,
  {
    profile: ChatUserProfile;
    message: ChatUserMessage[];
    timestamp: number;
  }
>;

export type ChatDonationResponse = ChannelChatBase<
  ChatType.DONATION,
  {
    type: ChatDonationType;
    profile: ChatUserProfile;
    message: string;
    count: number;
    fanJoinOrder: number;
    imgUrl: string;
    timestamp: number;
  }
>;

export type ChatBlockResponse = ChannelChatBase<
  ChatType.BLOCK,
  {
    type: ChatBlockType;
    profile: ChatUserProfile;
    duration: number;
  }
>;

export type ChatIceModeResponse = ChannelChatBase<
  ChatType.ICEMODE,
  {
    type: ChatBlockType;
    flags: ChatIceFlag[];
    minFanBalloon: number;
    minSubscriptionNum: number;
  }
>;

export type ChatSlowModeResponse = ChannelChatBase<
  ChatType.SLOWMODE,
  {
    duration: number;
  }
>;

export type ChatPollResponse = ChannelChatBase<
  ChatType.POLL,
  {
    pollId: string;
  }
>;

//////

//chat

export type ChatUserProfile = {
  userId: string;
  nickname: string;
  color: string;
  colorDarkmode: string;
  badges: ChatUserProfileBadge[];
};
export type ChatUserProfileBadge = {
  name: string;
  imgUrl: string;
};
export type ChatUserMessage = ChatUserText | ChatUserEmote | ChatUserSticker;

export type ChatUserText = {
  type: 'text';
  text: string;
};

export type ChatUserEmote = {
  type: 'emote';
  name: string;
  imgUrl: string;
};

export type ChatUserSticker = {
  type: 'sticker';
  name: string;
  imgUrl: string;
};

//donation

export enum ChatDonationType {
  NORMAL,
  AD,
  VOD,
}

//block

export enum ChatBlockType {
  TIMEOUT,
  KICK,
}

//icemode
export enum ChatIceFlag {
  FANCLUB, // 팬클럽
  SUPPORTER, // 서포터
  TOPFAN, // 열혈팬
  SUBSCRIPTION, // 구독팬
  MANAGER, // 매니저
}
