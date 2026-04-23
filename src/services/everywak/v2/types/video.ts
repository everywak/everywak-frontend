import { YoutubeChannelType } from "../type";

export type Video = {
  videoId: string;
  updatedTimestamp: string;
  publishedTimestamp: string;
  title: string;
  memberId: string;
  channelId: string;
  channelType: YoutubeChannelType;
};

export type SearchVideoParams = {
  isedol?: 'Y';
  memberId?: string;
  channelType?: YoutubeChannelType;
  keyword?: string;
  isShorts?: boolean;
  beginAt?: number;
  endAt?: number;
  page?: number;
  perPage?: number;
  orderBy?: 'time' | 'time_oldest' | 'view';
};