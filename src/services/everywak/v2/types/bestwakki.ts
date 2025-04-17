import { z } from 'zod';
import { PopularArticlesSelectSchema, PopularArticlesSelectUrlQuerySchema } from '../schemas/bestwakki';

export type SearchTarget = 'title' | 'author' | 'board';
export const SearchTargetEnum = z.enum(['title', 'author', 'board']);
export type OrderBy = 'time' | 'time_oldest' | 'read' | 'up' | 'comment';
export const OrderByEnum = z.enum(['time', 'time_oldest', 'read', 'up', 'comment']);
export type PopularArticlesSelectParams = z.input<typeof PopularArticlesSelectSchema>;
export type PopularArticlesSelectUrlParams = z.infer<typeof PopularArticlesSelectUrlQuerySchema>;
export type PopularArticle = {
  articleId: number;
  publishedTimestamp: string;
  subject: string;
  nickname: string;
  menuId: number;
  menuName: string;
  readCount: number;
  commentCount: number;
  upCount: number;
  representImage: string;
};
