import axios from 'axios';

/**
 * @template T
 * @typedef ApiMessage
 * @property {Number} status
 * @property {T} result
 * @property {{msg: String, data: Object}} error
 */

/**
 * @typedef EverywakUser
 * @property {Number} updatedTimeStamp
 * @property {String} uuid
 * @property {Number} createdTimeStamp
 * @property {String} userId
 * @property {String} loginName
 * @property {String} nickname
 * @property {Number} lastLoginedTimeStamp
 * @property {String} profileImageUrl
 * @property {String} email
 * @property {String} class
 * @property {String} description
 * @property {Number} visitCount
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
    withCredentials: true,
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
 * 로그인 정보를 불러옵니다.
 *
 * @returns {ApiMessage<{logined: Boolean, joined: Boolean, userInfo: EverywakUser}>}
 */
export async function getWhoAmI() {
  try {
    // api 요청
    const output = await requestApi('/users/whoami');

    return output;
  } catch (output) {
    return apiErrorHandler(output);
  }
}
