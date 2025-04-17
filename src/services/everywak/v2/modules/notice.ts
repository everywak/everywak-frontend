import { request } from '../common';
import { MemberNotice } from '../types/notice';

const base = '/notice';

// TODO: zod 적용
export const getNotices = async (memberId: string, page = 1, perPage = 30) =>
  await request<MemberNotice[]>({
    url: `${base}/list`,
    params: {
      memberId,
      page,
      perPage,
    },
  });
