import { request } from '../common';
import { Music, SearchMusicParams, SearchMusicChartParams } from '../types/music';

const base = '/music';

export const getMusics = async (params?: SearchMusicParams) =>
  await request<Music[]>({
    url: `${base}/list`,
    params: params as Record<string, string | number | boolean>,
  });

export const getMusicChart = async (params: SearchMusicChartParams) =>
  await request<Music[]>({
    url: `${base}/chart`,
    params: params as Record<string, string | number | boolean>,
  });
