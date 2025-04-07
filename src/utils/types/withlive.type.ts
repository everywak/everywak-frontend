export type LayoutType =
  | 'one-side-r'
  | 'one-side-l'
  | 'one-side-t'
  | 'one-side-b'
  | 'grid'
  | 'free';
export type ChannelStateType = {
  memberId: string;
  isActive: boolean;
  order: number;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
};

export type ChannelType = {
  memberId: string;
  nickname: string;
  profileImage: string;
  offlineImage: string;
  streamInfo: ChannelStreamInfoType | null;
};

export type ChannelStreamInfoType = {
  title: string;
  isLive: boolean;
  viewerCount: number;
  startedTime: number;
  thumbnail: string;
  platform: string;
  channelId: string;
  videoId: string;
  chatId: string;
};

export type DraggingPlayerStateType = {
  isDragging: boolean;
  targetMemberId: string;
  prevOrder: number;
  order: number;
};
