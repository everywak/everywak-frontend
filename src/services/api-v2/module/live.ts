import { request } from '../common';
import { LivesResponse } from './live.type';

const base = '/live';

export const getLives = async () =>
  await request<LivesResponse>({
    url: `${base}`,
  });
