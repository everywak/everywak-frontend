import { request } from '../common';
import { MembersResponse } from './member.type';

const base = '/member';

export const getMembers = async () =>
  await request<MembersResponse>({
    url: `${base}/list`,
  });
