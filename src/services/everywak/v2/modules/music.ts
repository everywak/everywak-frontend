import { request } from '../common';
import { SearchMusicParams, SearchMusicChartParams, MusicListResponse, MusicChartResponse } from '../types/music';

const base = '/music';

export const getMusics = async (params?: SearchMusicParams) =>
  await request<MusicListResponse>({
    url: `${base}/list`,
    params: params as Record<string, string | number | boolean>,
  });

export const getMusicChart = async (params: SearchMusicChartParams) =>
  await request<MusicChartResponse>({
    url: `${base}/chart`,
    params: params as Record<string, string | number | boolean>,
  });
