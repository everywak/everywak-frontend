import axios from 'axios';

import * as func from '../common/funtions';

const api = axios.create({
  baseURL: 'https://api.everywak.kr',
});

const apiCache = [];
function loadCache({route, params, salt}) {
  return apiCache.find(cache => cache.route === route && JSON.stringify(cache.params) === JSON.stringify(params) && cache.salt === salt && cache.data);
}
/**
 * API 서버 요청을 보냅니다.
 * 
 * @param {string} uri 
 * @param {object} params 
 * @param {'GET'|'POST'} method 
 * @returns {{status: number, result?: object, error?: {msg: string, data: object}}}
 */
async function requestApi(uri, params, method = 'GET', forceUpdate = false) {

  if (!forceUpdate) {
    const cache = loadCache({route: uri, params, salt: 0});
    if (cache) { return cache.data; }
  }

  const options = {
    method: method,
    mode: 'cors',
    params: params, 
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    }
  };

  try {
    const response = await api(uri, options);

    const cache = loadCache({route: uri, params, salt: 0});
    const fetchedData = {
      status: 200,
      result: response.data.message.result
    };
    if (cache) { // 기존 캐시가 있으면 
      cache.data = fetchedData; // 강제 갱신
    } else {
      apiCache.push({ // 새 캐시 생성
        route: uri, params, salt: 0, 
        data: fetchedData,
      });
    }
    return fetchedData;

  } catch(error) {
    if (error.response) {
      // api 에러
      return {
        status: error.response.status,
        error: {
          msg: '내부 서버 오류',
          data: error.response.data.message,
        }
      };
    }
    else if (error.request) {
      // api 서버 연결 실패
      return {
        status: 503,
        error: {
          msg: 'API 서버 연결 실패',
        }
      };
    }
    else {
      console.log('Error', error.message);
    }
  }

}

/**
 * 왁물원 인기글 목록을 불러옵니다.
 * 
 * @see filterPopularArticlesParams
 * @see requestApi
 * @param {object} query 
 * @returns {{status: number, result?: {popularArticleList: Array, page: number, perPage: number, articleCount: number}, error?: {msg: string}}}
 */
export async function getPopularArticles(query) {

  // 검색 조건 파라미터 필터링
  const filteredParams = filterPopularArticlesParams(query);
  
  // api 요청
  const output = await requestApi('/bestwakki/WakkiPopularArticles', filteredParams);

  if (output.status === 200) {
    return output;
  } else {
    if (output.error.msg === '내부 서버 오류') {
      return {
        status: output.status,
        msg: '알 수 없는 오류가 발생하였습니다.',
      };
    } else if (output.error.msg === 'API 서버 연결 실패') {
      return {
        status: output.status,
        msg: 'API 서버 또는 사용자의 네트워크가 오프라인 상태입니다.',
      };
    } else {
      return {
        status: output.status,
        msg: output.error.msg,
      };
    }
  }
}

/**
 * 왁물원 인기글 api 요청시 입력되는 파라미터 값을 필터링합니다.
 * 
 * @see getPopularArticles
 * @param {object} query 
 */
function filterPopularArticlesParams(query) {

  // 기본값 정의
  const _default = {
    orderBy: 'time', 
    page: '1', 
    perPage: '30',
    searchTarget: 'title', 
    keyword: '', 
    beginAt: 1424876400, 
    endAt: parseInt(Date.now() / 1000 / 300) * 300
  }

  const ptNum = /[^0-9]/g;
  const ptDate = /([0-9]{4}-[0-9]{2}-[0-9]{2})/g;

  // 정렬
  const orders = ['time', 'time_oldest', 'up', 'comment', 'read'];
  const orderBy = orders.includes(query.orderBy) ? query.orderBy : _default.orderBy;

  // 페이지
  const page = Math.max(
    parseInt(
      String(query.page || _default.page).replace(ptNum, '')
      ), 
    1);

  // 페이지 당 글 갯수
  const perPage = Math.min(Math.max(
    parseInt(
      String(query.perPage || _default.perPage).replace(ptNum, '')
    ), 
    5), 999);
  
  // 검색 타겟
  const searchTargets = ['title', 'author', 'board'];
  const searchTarget = searchTargets.includes(query.searchTarget) ? query.searchTarget : _default.searchTarget;

  // 검색어
  const keyword = query.keyword || _default.keyword;

  // 시작 날짜
  const beginAt = Math.max(
    (
      query.beginAt && func.isDateStr(query.beginAt) ? parseInt(new Date(query.beginAt).getTime() / 1000 - 9*60*60) : parseInt(query.beginAt / 1000)
    ), 
    _default.beginAt
  );

  // 끝 날짜
  query.endAt = (
    query.endAt && func.isDateStr(query.endAt) ? parseInt(new Date(query.endAt).getTime() / 1000) : parseInt(query.endAt / 1000) + 24*60*60 - 1
  );
  const endAt = (
    query.endAt >= beginAt && query.endAt <= _default.endAt ? 
    query.endAt : 
    _default.endAt
  );
  
  const filteredParams = {
    orderBy: orderBy, 
    page: page, 
    perPage: perPage,
    queryTarget: searchTarget, 
    queryTxt: keyword, 
    beginAt: beginAt, 
    endAt: endAt
  };

  return filteredParams;
}