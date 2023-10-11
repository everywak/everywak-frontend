import * as func from '../../../common/funtions';

import { request } from '../common';

/**
 * 왁물원 인기글 api 요청시 입력되는 파라미터 값을 필터링합니다.
 *
 * @see getPopularArticles
 * @param {any} query
 */
const filterPopularArticlesParams = query => {
  // 기본값 정의
  const _default = {
    orderBy: 'time',
    page: '1',
    perPage: '30',
    searchTarget: 'title',
    keyword: '',
    beginAt: 1424876400,
    endAt: parseInt(Date.now() / 1000 / 300) * 300
  };

  const ptNum = /[^0-9]/g;
  const ptDate = /([0-9]{4}-[0-9]{2}-[0-9]{2})/g;

  // 정렬
  const orders = ['time', 'time_oldest', 'up', 'comment', 'read'];
  const orderBy = orders.includes(query.orderBy)
    ? query.orderBy
    : _default.orderBy;

  // 페이지
  const page = Math.max(
    parseInt(String(query.page || _default.page).replace(ptNum, '')),
    1
  );

  // 페이지 당 글 갯수
  const perPage = Math.min(
    Math.max(
      parseInt(String(query.perPage || _default.perPage).replace(ptNum, '')),
      5
    ),
    999
  );

  // 검색 타겟
  const searchTargets = ['title', 'author', 'board'];
  const searchTarget = searchTargets.includes(query.searchTarget)
    ? query.searchTarget
    : _default.searchTarget;

  // 검색어
  const keyword = query.keyword || _default.keyword;

  // 시작 날짜
  const beginAt = Math.max(
    query.beginAt && func.isDateStr(query.beginAt)
      ? parseInt(new Date(query.beginAt).getTime() / 1000 - 9 * 60 * 60)
      : parseInt(query.beginAt / 1000),
    _default.beginAt
  );

  // 끝 날짜
  query.endAt =
    query.endAt && func.isDateStr(query.endAt)
      ? parseInt(new Date(query.endAt).getTime() / 1000)
      : parseInt(query.endAt / 1000) + 24 * 60 * 60 - 1;
  const endAt =
    query.endAt >= beginAt && query.endAt <= _default.endAt
      ? query.endAt
      : _default.endAt;

  const filteredParams = {
    orderBy: orderBy,
    page: page,
    perPage: perPage,
    queryTarget: searchTarget,
    queryTxt: keyword
  };

  if (!isNaN(beginAt)) {
    filteredParams.beginAt = beginAt;
  }
  if (!isNaN(endAt)) {
    filteredParams.endAt = endAt;
  }

  return filteredParams;
};

/**
 * 왁물원 인기글 목록을 불러옵니다.
 *
 * @param {*} params
 * @returns {Promise<import('../common').CommonMessage<{popularArticleList: Array, page: number, perPage: number, articleCount: number}>}
 */
const getPopularArticles = async params =>
  await request({
    method: 'GET',
    uri: '/bestwakki/WakkiPopularArticles',
    params: filterPopularArticlesParams(params)
  });

export { getPopularArticles };
