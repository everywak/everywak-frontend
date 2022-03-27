import axios from 'axios';

import * as func from '../common/funtions';

const api = axios.create({
  baseURL: 'https://api.everywak.kr',
})

const apiCache = [];
function loadCache({route, salt}) {
  return apiCache.find(cache => cache.route === route && cache.salt === salt && cache.data);
}
async function requestApi({route, salt, forceUpdate = false}) {
  if (!forceUpdate) {
    const cache = loadCache({route, salt});
    if (cache) { return cache.data; }
  }

  try {
    const res = await api(`${route}?salt=${salt}`);
    const { message } = res.data;
  
    if (message) {
      const cache = loadCache({route, salt});
      const fetchedData = message;
      if (cache) { // 기존 캐시가 있으면 
        cache.data = fetchedData; // 강제 갱신
      } else {
        apiCache.push({ // 새 캐시 생성
          route, salt,
          data: fetchedData,
        });
      }
      return fetchedData;
    } else {
      return null;
    }
  } catch(e) {
    throw e;
  }
}

/**
 * @typedef WakLiveInfoItem
 * @property {'TWITCH'|'YOUTUBE'|'NONE'} broadcaster
 * @property {string} startedTime
 * @property {string} thumbnail
 * @property {string} title
 * @property {number} viewerCount
 */
/**
 * @returns {WakLiveInfoItem[]}
 */
export async function getBroadcastInfo() {
  try {
    const message = await requestApi({route: '/live/LiveWakInfo', salt: geneSalt()});
  
    if (message && message.status == 200) {
      return message.result;
    } else {
      return {
        broadcaster: 'NONE',
      };
    }
  } catch(e) {
    console.log(e);
    return {
      broadcaster: 'NONE',
    };
  }
}
/**
 * @typedef BroadcastInfoItem
 * @property {'TWITCH'|'YOUTUBE'} broadcaster
 * @property {string} login_name
 * @property {string} nickname
 * @property {string} startedTime
 * @property {string} thumbnail
 * @property {string} title
 * @property {number} viewerCount
 */
/**
 * @returns {BroadcastInfoItem[]}
 */
export async function getWaktaverseBroadcastInfo() {
  try {
    const message = await requestApi({route: '/live/WaktaverseLiveInfo', salt: geneSalt()});

    if (message && message.status == 200) {
      return message.result;
    } else {
      return [];
    }
  } catch(e) {
    console.log(e);
    return [];
  }
}
/**
 * @typedef MemberInfoItem
 * @property {string} broadcaster_type
 * @property {string} created_at
 * @property {string} description
 * @property {string} display_name
 * @property {string} id
 * @property {string} login
 * @property {string} offline_image_url
 * @property {string} profile_image_url
 * @property {string} type
 * @property {number} viewerCount
 */
/**
 * @returns {MemberInfoItem[]}
 */
export async function getWaktaverseInfo() {
  try {
    const message = await requestApi({route: '/live/WaktaverseInfo', salt: geneSalt()});

    if (message && message.status == 200) {
      return message.result;
    } else {
      return [];
    }
  } catch(e) {
    console.log(e);
    return [];
  }
}

function geneSalt() {
  return parseInt(Date.now() / 1000 / 30);
}