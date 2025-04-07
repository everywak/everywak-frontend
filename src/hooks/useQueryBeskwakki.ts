import { useInfiniteQuery } from '@tanstack/react-query';
import { SearchFilter } from 'modules/bestwakki/types';

import * as everywakApi from 'services/everywak-api/index';

import { PopularArticlesResponse } from 'services/everywak-api/modules/bestwakki';

export default function useQueryBestwakki({
  searchFilter,
  ...rest
}: {
  searchFilter: SearchFilter;
}) {
  const fetch = async (searchFilter: SearchFilter) => {
    const res = await everywakApi.bestwakki.getPopularArticles(searchFilter);

    if (res.message.status != 200) {
      throw res;
    }

    return res.message.result;
  };

  return useInfiniteQuery<PopularArticlesResponse>({
    queryKey: ['getPopularArticles', searchFilter],
    queryFn: ({ pageParam }) => fetch({ ...searchFilter, page: pageParam || 1 }),
    getNextPageParam: (lastPage, allPosts): number | undefined => {
      return allPosts[allPosts.length - 1]?.articleCount > 0 ? lastPage.page + 1 : undefined;
    },
    ...rest,
  });
}
