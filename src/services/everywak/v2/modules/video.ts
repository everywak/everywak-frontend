import { request } from '../common';
import { Video, SearchVideoParams } from '../types/video';

const base = '/video';

export const getVideos = async (params?: SearchVideoParams) =>
  await request<Video[]>({
    url: `${base}/list`,
    params: params as Record<string, string | number | boolean>,
  });
