import axios from 'axios';

import * as func from '../common/funtions';

const api = axios.create({
  baseURL: 'https://api.everywak.kr',
})

export async function getYoutubeVideos() {
  try {
    const res = await api('/isedol/YoutubeVideos');
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

export async function getTwitchClips() {
  try {
    const options = {
      mode: 'cors',
      params: {beginAt: Date.now() / 1000 - 7*24*60*60, endAt: Date.now() / 1000}, 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      }
    };
    const res = await api('/isedol/TwitchClips?orderBy=view', options);
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