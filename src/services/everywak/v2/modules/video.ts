import { request } from '../common';
import { SearchVideoParams, VideoListResponse } from '../types/video';

const base = '/video';

export const getVideos = async (params?: SearchVideoParams) =>
  await request<VideoListResponse[]>({
    url: `${base}/list`,
    params: params as Record<string, string | number | boolean>,
  });
