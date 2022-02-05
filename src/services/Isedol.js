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
    const res = await api('/isedol/TwitchClips?orderBy=view');
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