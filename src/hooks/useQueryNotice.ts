import { useQuery } from '@tanstack/react-query';

import * as Everywak from 'services/api-v2/index';

export function useQueryNotice({
  memberId,
  page = 1,
  perPage = 15,
  ...rest
}: {
  memberId: string;
  page?: number;
  perPage?: number;
}) {
  const fetch = async () => {
    try {
      const notices = await Everywak.notice.getNotices(memberId, page, perPage);
      return notices;
    } catch (error) {
      throw error;
    }
  };

  return useQuery([`waktaverseMemberNotices-${memberId}-${page}-${perPage}`], fetch, {
    staleTime: 15000,
    ...rest,
  });
}
