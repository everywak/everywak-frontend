import axios from 'axios';

import * as func from '../common/funtions';

const api = axios.create({
  baseURL: 'https://api.everywak.kr',
})

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
    const res = await api(`/live/LiveWakInfo?salt=${parseInt(Date.now() / 1000 / 30)}`);
    const { message } = res.data;
  
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
    const res = await api('/live/WaktaverseLiveInfo');
    const { message } = res.data;

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
    const res = await api('/live/WaktaverseInfo');
    const { message } = res.data;

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