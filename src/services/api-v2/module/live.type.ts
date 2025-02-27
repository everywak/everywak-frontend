import { LivePlatform } from './member.type';

export type Live = {
  id: string;
  isLive: boolean;
  title: string;
  videoId: string;
  chatId: string;
  startedTimestamp: string;
  endedTimestamp: string;
  thumbnail: string;
  viewerCount: number;
  livePlatform: LivePlatform;
};

export type LivesResponse = Live[];
