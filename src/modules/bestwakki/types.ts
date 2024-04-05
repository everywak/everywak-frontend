export type ListOrder = 'time' | 'time_oldest' | 'up' | 'comment' | 'read';

export type SearchTarget = 'title' | 'author' | 'board';

export type SearchFilter = {
  beginAt: number;
  endAt: number;
  orderBy: ListOrder;
  keyword: string;
  searchTarget: SearchTarget;
  perPage: number;
  page: number;
};
