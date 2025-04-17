import { useInfiniteQuery } from '@tanstack/react-query';
import { EverywakApi } from 'services/everywak';

import { PopularArticlesSelectParams, PopularArticle } from 'services/everywak/v2/types/bestwakki';

export const useBestwakkiQuery = ({ params, ...rest }: { params: PopularArticlesSelectParams }) => {
  const fetch = async (params: PopularArticlesSelectParams) => {
    const res = await EverywakApi.v2.bestwakki.getPopularArticles(params);
    return res;
  };

  return useInfiniteQuery<PopularArticle[]>({
    queryKey: ['getPopularArticles', JSON.stringify(params)],
    queryFn: ({ pageParam }) => fetch({ ...params, page: pageParam || 1 }),
    getNextPageParam: (lastPage, allPosts): number | undefined => {
      return lastPage.length > 0 ? allPosts.length + 1 : undefined;
    },
    ...rest,
  });
};
