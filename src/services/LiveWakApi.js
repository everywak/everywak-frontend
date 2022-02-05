import axios from 'axios';

import * as func from '../common/funtions';

const api = axios.create({
  baseURL: 'https://api.everywak.kr',
})
export async function getBroadcastInfo() {
  try {
    const res = await api('/live/LiveWakInfo');
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