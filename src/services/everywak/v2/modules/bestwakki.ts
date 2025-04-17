import { request } from '../common';
import { PopularArticlesSelectSchema } from '../schemas/bestwakki';
import { PopularArticlesSelectParams, PopularArticle } from '../types/bestwakki';

const base = '/bestwakki';

export const getPopularArticles = (params: PopularArticlesSelectParams) =>
  request<PopularArticle[]>({
    url: `${base}/list`,
    params: PopularArticlesSelectSchema.parse(params),
  });
