import { YoutubeChannelType } from "../type";

export type VideoListMember = {
  id: string;
  name: string;
  role: string;
};

export type VideoListChannel = {
  id: string;
  type: YoutubeChannelType;
  name: string;
  channelId: string;
  uploads: string;
};

export type VideoListItem = {
  isShorts: boolean;
  videoId: string;
  publishedTimestamp: string;
  title: string;
  thumbnails: string;
  viewCount: number;
  duration: number;
  member: VideoListMember;
  channel: VideoListChannel;
};

export type VideoListResponse = VideoListItem[];

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