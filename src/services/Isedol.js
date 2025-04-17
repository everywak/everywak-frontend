import axios from 'axios';

import { Waktaverse } from 'common/constants';

import { api } from './everywak.common';

export async function getYoutubeVideos() {
  try {
    const res = await api('/isedol/YoutubeVideos?twitchId=isedol');
    const { message } = res.data;

    if (message && message.status == 200) {
      return message.result;
    } else {
      return {};
    }
  } catch (e) {
    console.log(e);
    return {};
  }
}

const SECONDS_OF_DAY = 24 * 60 * 60;

const filterTwitchClipParams = (params) => {
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
  if (params.twitchId && Waktaverse.map((item) => item.login_name).includes(params.twitchId)) {
    result.twitchId = params.twitchId;
  }
  if (params.beginAt) {
    result.beginAt = params.beginAt;
  }
  if (params.endAt) {
    result.endAt = params.endAt;
  }

  return result;
};

export async function getTwitchClips(params) {
  try {
    const options = {
      mode: 'cors',
      params: filterTwitchClipParams(params),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
    };
    const res = await api(`/isedol/TwitchClips`, options);
    const { message } = res.data;

    if (message && message.status == 200) {
      return message.result;
    } else {
      return {};
    }
  } catch (e) {
    console.log(e);
    return {};
  }
}
