import axios from 'axios';

import { Waktaverse } from '../common/constants';

import { api, requestApi, apiErrorHandler } from './everywak.common';

/**
 * @typedef {Object} OBIInfoItem
 * @property {string} name 닉네임
 * @property {string} weather 날씨 정보
 * @property {string} rawInfo 원본 문자열
 * @property {string} description 언급 내용
 */

/**
 * 이세돌 뱅온정보를 불러옵니다.
 * 
 * @param {string} data
 * @returns {import('./everywak.common').ApiMessage<{OBIData: OBIInfoItem[], dateString: string, updatedTimeStamp: number}>}
 */
export async function getOBI(date = '') {
  try {

    // api 요청
    const output = await requestApi('/isedol/OBI' + (date ? `/${date}` : ''));

    return output;
    
  } catch(output) {
    return apiErrorHandler(output);
  }
}

export async function getYoutubeVideos() {
  try {
    const res = await api('/isedol/YoutubeVideos?twitchId=isedol');
    const { message } = res.data;

    if (message && message.status == 200) {
      return message.result;
    } else {
      return {};
    }
  } catch(e) {
    console.log(e);
    return {};
  }
}

const SECONDS_OF_DAY = 24 * 60 * 60;

const filterTwitchClipParams = params => {
  const dateOffset = parseInt(Math.random() * 400) + 30;
  const result = {
    orderBy: 'view',
    twitchId: '',
    beginAt: Date.now() / 1000 - (dateOffset + 30) * SECONDS_OF_DAY, 
    endAt: Date.now() / 1000 - dateOffset * SECONDS_OF_DAY,
  };

  if (params.orderBy && ['time', 'time_oldest', 'view'].includes(params.orderBy)) {
    result.orderBy = params.orderBy;
  }
  if (params.twitchId && Waktaverse.map(item => item.login_name).includes(params.twitchId)) {
    result.twitchId = params.twitchId;
  }
  if (params.beginAt) {
    result.beginAt = params.beginAt;
  }
  if (params.endAt) {
    result.endAt = params.endAt;
  }

  return result;
}

export async function getTwitchClips(params) {
  try {
    const options = {
      mode: 'cors',
      params: filterTwitchClipParams(params), 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      }
    };
    const res = await api(`/isedol/TwitchClips`, options);
    const { message } = res.data;

    if (message && message.status == 200) {
      return message.result;
    } else {
      return {};
    }
  } catch(e) {
    console.log(e);
    return {};
  }
}