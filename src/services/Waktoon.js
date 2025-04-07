import axios from 'axios';

/**
 * @typedef WaktoonInfoQuery
 * @property {String} title
 * @property {'best'|'general'} type
 * @property {'continuing'|'paused'|'ended'} serialStatus
 * @property {String} authorId
 * @property {String} authorNickname
 * @property {String} thumbnails
 * @property {String} parseKeyword
 * @property {String} description
 * @property {'single'|'series'} episodeType
 *
 * @typedef WaktoonSearchQuery
 * @property {'all'|'best'|'general'} type
 * @property {String} queryTxt
 * @property {'title'|'author'|'uuid'} queryTarget
 * @property {'time'|'time_oldest'|'view'|'up'|'comment'} orderBy
 * @property {Number} perPage
 * @property {Number} page
 * @property {Number} pos
 *
 * @typedef WaktoonInfoEditQuery
 * @property {String} uuid
 * @property {String} title
 * @property {'best'|'general'} type
 * @property {'continuing'|'paused'|'ended'} serialStatus
 * @property {String} authorId
 * @property {String} authorNickname
 * @property {String} parseKeyword
 * @property {String} description
 * @property {Number} createdTimeStamp
 * @property {String} thumbnails
 * @property {'single'|'series'} episodeType
 *
 * @typedef WaktoonEpisodeSearchQuery
 * @property {'all'|'best'|'general'} type
 * @property {String} queryTxt
 * @property {'title'|'author'|'articleId'|'parent'} queryTarget
 * @property {'time'|'time_oldest'|'view'|'up'|'comment'} orderBy
 * @property {Number} perPage
 * @property {Number} page
 * @property {Number} pos
 *
 * @typedef WaktoonEpisodeChartSearchQuery
 * @property {Number} before 시작 시점 timestamp(ms)
 * @property {Number} after 종료 시점 timestamp(ms)
 * @property {'view'|'up'|'comment'} orderBy 정렬 기준
 * @property {Number} perPage 출력할 길이
 * @property {Number} page 페이지 번호
 */
/**
 * @template T
 * @typedef ApiMessage
 * @property {Number} status
 * @property {T} result
 * @property {{msg: String, data: Object}} error
 */

const api = axios.create({
  baseURL: 'https://api.everywak.kr',
});

const apiCache = [];
function loadCache({ route, params, salt }) {
  return apiCache.find(
    (cache) =>
      cache.route === route &&
      JSON.stringify(cache.params) === JSON.stringify(params) &&
      cache.salt === salt &&
      cache.data,
  );
}
/**
 * API 서버 요청을 보냅니다.
 *
 * @param {string} uri
 * @param {object} params
 * @param {'GET'|'POST'} method
 * @returns {ApiMessage<any>}
 */
async function requestApi(uri, params, method = 'GET', forceUpdate = false) {
  if (!forceUpdate) {
    const cache = loadCache({ route: uri, params, salt: 0 });
    if (cache) {
      return cache.data;
    }
  }

  const options = {
    method: method,
    mode: 'cors',
    params: params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };

  try {
    const response = await api(uri, options);

    const cache = loadCache({ route: uri, params, salt: 0 });
    const fetchedData = {
      status: 200,
      result: response.data.message.result,
    };
    if (cache) {
      // 기존 캐시가 있으면
      cache.data = fetchedData; // 강제 갱신
    } else {
      apiCache.push({
        // 새 캐시 생성
        route: uri,
        params,
        salt: 0,
        data: fetchedData,
      });
    }
    return fetchedData;
  } catch (error) {
    if (error.response) {
      // api 에러
      return {
        status: error.response.status,
        error: {
          msg: '내부 서버 오류',
          data: error.response.data.message,
        },
      };
    } else if (error.request) {
      // api 서버 연결 실패
      return {
        status: 503,
        error: {
          msg: 'API 서버 연결 실패',
        },
      };
    } else {
      console.log('Error', error.message);
    }
  }
}

function apiErrorHandler(message) {
  if (message.error.msg === '내부 서버 오류') {
    return {
      status: message.status,
      msg: '알 수 없는 오류가 발생하였습니다.',
    };
  } else if (message.error.msg === 'API 서버 연결 실패') {
    return {
      status: message.status,
      msg: 'API 서버 또는 사용자의 네트워크가 오프라인 상태입니다.',
    };
  } else {
    return {
      status: message.status,
      msg: message.error.msg,
    };
  }
}

/**
 * 왁툰 목록을 불러옵니다.
 *
 * @param {WaktoonSearchQuery} params
 * @returns {ApiMessage<{waktoonList: any[], waktoonCount: Number, pagination: {length: Number, pos: Number, perPage: Number}}>}
 */
export async function getWaktoons(params) {
  try {
    const output = await requestApi('/waktoon/Waktoon/list', params);

    if (output.status === 200) {
      output.result.waktoonList.forEach(
        (item) => (item.title = item.title.replace(/&lt;/g, '<').replace(/&gt;/g, '>')),
      );
      return output;
    }
  } catch (output) {
    return apiErrorHandler(output);
  }
}

/**
 * 왁툰 에피소드 목록을 불러옵니다.
 *
 * @param {WaktoonEpisodeSearchQuery} params
 * @returns {ApiMessage<{waktoonEpisodeList: any[], waktoonEpisodeCount: Number, pagination: {length: Number, pos: Number, perPage: Number}}>}
 */
export async function getWaktoonEpisodes(params) {
  try {
    // api 요청
    const output = await requestApi('/waktoon/WaktoonEpisode/list', params);

    if (output.status === 200) {
      output.result.waktoonEpisodeList.forEach(
        (item) => (item.title = item.title.replace(/&lt;/g, '<').replace(/&gt;/g, '>')),
      );
      return output;
    }
  } catch (output) {
    return apiErrorHandler(output);
  }
}

/**
 * 왁툰 에피소드 인기도 증가량 차트를 불러옵니다.
 *
 * @param {WaktoonEpisodeChartSearchQuery} query
 * @returns {ApiMessage}
 */
export async function getWaktoonEpisodeChart(query) {
  try {
    // 검색 조건 파라미터 필터링
    const filteredParams = filterWaktoonEpisodeChartSearchParams(query);

    // api 요청
    const output = await requestApi('/waktoon/WaktoonEpisode/Chart/list', filteredParams);

    if (output.status === 200) {
      output.result.waktoonEpisodeChartList.forEach(
        (item) => (item.title = item.title.replace(/&lt;/g, '<').replace(/&gt;/g, '>')),
      );
      return output;
    }
  } catch (output) {
    return apiErrorHandler(output);
  }
}

const SECONDS_OF_DAY = 24 * 60 * 60;
/**
 * 왁툰 에피소드 차트 출력 조건 파라미터를 필터링합니다.
 *
 * @param {WaktoonEpisodeChartSearchQuery} query 원본 param
 * @returns {WaktoonEpisodeChartSearchQuery}
 */
function filterWaktoonEpisodeChartSearchParams(query) {
  const result = {};

  // 끝 지점
  if (!query.after || typeof query.after !== 'number') {
    query.after = parseInt(Date.now() / 1000 / 3600) * 3600; // after 미지정시 현재 시간으로
  }
  result.after = parseInt(query.after);

  // 시작 지점
  if (!query.before || typeof query.before !== 'number') {
    query.before = result.after - SECONDS_OF_DAY; // before 미지정시 after - 1day로
  }
  result.before = parseInt(query.before);

  // before가 after보다 큰 거 방지
  const after = Math.max(result.after, result.before);
  const before = Math.min(result.after, result.before);
  result.after = after;
  result.before = before;

  // 정렬
  if (!query.orderBy || !['view', 'up', 'comment'].includes(query.orderBy)) {
    query.orderBy = 'up';
  }
  result.orderBy = query.orderBy;

  // 페이지
  const perPage = parseInt(query.perPage);
  result.perPage = perPage && perPage >= 1 && perPage <= 100 ? perPage : 30;
  const page = parseInt(query.page);
  result.page = page && page > 0 ? page : 1;
  result.pos = result.perPage * (result.page - 1);

  return result;
}

/**
 * API요청에 소금간을 칩니다 솔솔솔
 *
 * @returns {number}
 */
function geneSalt() {
  return parseInt(Date.now() / 1000 / 30);
}
