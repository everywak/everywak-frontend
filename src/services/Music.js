import axios from 'axios';

/**
 * @typedef WakMusicInfoQuery
 * @property {string} uuid
 * @property {string} videoId
 * @property {string} videoReactionId
 * @property {string} title
 * @property {string} thumbnail
 * @property {string} singer
 * @property {string} singerOriginal
 * @property {string} jogyo
 *
 * @typedef WakMusicSearchQuery
 * @property {string | undefined} queryTxt
 * @property {'all'|'title'|'singer'|'jogyo'| undefined} queryTarget
 * @property {'view'|'time'|'time_oldest'} orderBy
 * @property {'all'|'hourly'|'daily'|'weekly'|'monthly'|'yearly'} viewerRange
 * @property {number| undefined} beginAt
 * @property {number| undefined} endAt
 * @property {number| undefined} page
 * @property {number| undefined} perPage
 * @property {number| undefined} pos
 *
 * @typedef WakMusicItem
 * @property {string} uuid
 * @property {number} publishedTimeStamp
 * @property {string} videoId
 * @property {string} title
 * @property {string} thumbnail
 * @property {string} uploadId
 * @property {string} uploadName
 * @property {string} singer
 * @property {string} jogyo
 * @property {number} duration
 * @property {number} viewCount
 * @property {number} viewCountChanged
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
 * 왁타버스 뮤직 목록을 불러옵니다.
 *
 * @param {WakMusicSearchQuery} params
 * @returns {ApiMessage<{musicList: WakMusicItem[], musicCount: number, pagination: {pos: number, perPage: number}}>}
 */
export async function getWakMusics(params) {
  try {
    const output = await requestApi('/music/search', params);

    if (output.status === 200) {
      return output;
    }
  } catch (output) {
    return apiErrorHandler(output);
  }
}

/**
 * API요청에 소금간을 칩니다 솔솔솔
 *
 * @returns {number}
 */
function geneSalt() {
  return parseInt(Date.now() / 1000 / 30);
}
