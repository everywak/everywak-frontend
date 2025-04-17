import { request } from '../common';
import { Member } from 'services/everywak/v2/types/member';

const base = '/member';

export const getMembers = async () =>
  await request<Member[]>({
    url: `${base}/list`,
  });

export const getMember = async (memberId: string) =>
  await request<Member>({
    url: `${base}/${encodeURIComponent(memberId)}`,
  });
