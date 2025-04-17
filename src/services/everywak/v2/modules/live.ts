import { request } from '../common';
import { Live } from '../types/live';

const base = '/live';

export const getLives = async () =>
  await request<Live[]>({
    url: `${base}`,
  });

export const getMemberLives = async (memberId: string) =>
  await request<Live[]>({
    url: `${base}/member/${encodeURIComponent(memberId)}`,
  });
