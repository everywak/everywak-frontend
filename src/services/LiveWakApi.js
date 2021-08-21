import axios from 'axios';

import * as func from '../common/funtions';

const api = axios.create({
  baseURL: 'https://api.everywak.kr',
})
export async function getBroadcastInfo() {
  const res = await api('/live/LiveWakInfo');
  const { message } = res.data;

  if (message && message.status == 200) {
    return message.result;
  } else {
    return {
      broadcaster: 'NONE',
    };
  }
}