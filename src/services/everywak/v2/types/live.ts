import { LivePlatform } from './member';

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
