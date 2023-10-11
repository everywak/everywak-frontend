import axios from 'axios';

import * as func from '../../common/funtions';

/**
 * @template T
 * @typedef CommonMessage
 * @property {{status: number, result: T}} message
 */
/**
 * @typedef CommonError
 * @property {{status: number, error: {code: number, msg: string}}} message
 */

const api = axios.create({
  baseURL: 'https://api.everywak.kr',
})

/**
 * API 서버 요청을 보냅니다.
 * 
 * @param {{method: 'GET'|'POST', uri: string, params: any, data: any }} param
 * @param {string} uri 
 * @param {object} params 
 * @param {'GET'|'POST'} method 
 * @returns {CommonMessage<any>|CommonError}
 */
const request = async ({ method = 'GET', uri, params, data }) => {
  const options = {
    method,
    mode: 'cors',
    params, 
    data,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    withCredentials: true,
  };
  const response = await api(uri, options);

  return response.data;
}

export { request };