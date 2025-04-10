import { request } from '../common';
import { MemberNoticesResponse } from './notice.type';

const base = '/notice';

export const getNotices = async (memberId: string, page = 1, perPage = 30) =>
  await request<MemberNoticesResponse>({
    url: `${base}/list?${new URLSearchParams({
      memberId,
      page: String(page),
      perPage: String(perPage),
    }).toString()}`,
  });
