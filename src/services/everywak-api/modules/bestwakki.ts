import { ListOrder, SearchFilter, SearchTarget } from 'components/legacy/bestwakki/types';

import { request } from '../common';

export type PopularArticle = {
  articleId: number;
  writeDateTimestamp: number;
  subject: string;
  readCount: number;
  upCount: number;
  commentCount: number;
  menuId: number;
  menuName: string;
  nickname: string;
  representImage: string | null;
  aheadOfWriteDate: string;
};

export type PopularArticlesRequest = {
  beginAt: number;
  endAt: number;
  orderBy: ListOrder;
  queryTxt: string;
  queryTarget: SearchTarget;
  perPage: number;
  page: number;
};

export type PopularArticlesResponse = {
  popularArticleList: PopularArticle[];
  page: number;
  perPage: number;
  articleCount: number;
};

/**
 * 왁물원 인기글 api 요청시 입력되는 파라미터 값을 필터링합니다.
 *
 * @see getPopularArticles
 * @param {any} query
 */
const filterPopularArticlesParams = (query: Partial<SearchFilter>) => {
  // 기본값 정의
  const _default: PopularArticlesRequest = {
    orderBy: 'time',
    page: 1,
    perPage: 30,
    queryTarget: 'title',
    queryTxt: '',
    beginAt: 1424876400,
    endAt: Math.floor(Date.now() / 1000 / 300) * 300,
  };

  const ptNum = /[^0-9]/g;
  const ptDate = /([0-9]{4}-[0-9]{2}-[0-9]{2})/g;

  // 정렬
  const orders = ['time', 'time_oldest', 'up', 'comment', 'read'];
  const orderBy = orders.includes(query.orderBy ?? _default.orderBy)
    ? (query.orderBy as ListOrder)
    : _default.orderBy;

  // 페이지
  const page = Math.max(parseInt(String(query.page || _default.page).replace(ptNum, '')), 1);

  // 페이지 당 글 갯수
  const perPage = Math.min(
    Math.max(parseInt(String(query.perPage || _default.perPage).replace(ptNum, '')), 5),
    999,
  );

  // 검색 타겟
  const searchTargets = ['title', 'author', 'board'];
  const queryTarget =
    query.searchTarget && searchTargets.includes(query.searchTarget)
      ? query.searchTarget
      : _default.queryTarget;

  // 검색어
  const queryTxt = query.keyword || _default.queryTxt;

  // 시작 날짜
  const beginAt = !isNaN(Math.floor((query.beginAt ?? 0) / 1000))
    ? Math.max(Math.floor((query.beginAt ?? 0) / 1000), _default.beginAt)
    : _default.beginAt;

  // 끝 날짜
  query.endAt = Math.floor((query.endAt ?? Date.now()) / 1000) + 24 * 60 * 60 - 1;
  const endAt =
    !isNaN(query.endAt) && query.endAt >= beginAt && query.endAt <= _default.endAt
      ? query.endAt
      : _default.endAt;

  const filteredParams: PopularArticlesRequest = {
    orderBy,
    page,
    perPage,
    queryTarget,
    queryTxt,
    beginAt,
    endAt,
  };

  return filteredParams;
};

/**
 * 왁물원 인기글 목록을 불러옵니다.
 */
const getPopularArticles = async (params: Partial<SearchFilter>) =>
  await request<PopularArticlesResponse>({
    method: 'GET',
    uri: '/bestwakki/WakkiPopularArticles',
    params: filterPopularArticlesParams(params),
  });

export { getPopularArticles };
