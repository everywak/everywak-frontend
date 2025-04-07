import { Waktaverse } from '../common/constants';

import { requestApi, apiErrorHandler } from './everywak.common';

/**
 * @typedef {"youtubeVideo"|"yotuubeClip"|"youtubeVOD"} VideoContentType
 */
/**
 * @typedef {object} VideoContent
 * @property {VideoContentType} type
 * @property {string} nickname
 * @property {string} twitchId
 * @property {string} youtubeId
 * @property {string} videoId
 * @property {string} replayId
 * @property {string} title
 * @property {number} publishedAt
 * @property {string} description
 * @property {string} tags
 * @property {string} thumbnails
 * @property {number} viewCount
 * @property {number} duration
 */

const filterVideoParams = (params) => {
  const result = {
    type: 'all',
    twitchId: '',
    orderBy: 'time',
  };

  if (params.type && ['all', 'youtubeVideo', 'youtubeClip', 'youtubeVOD'].includes(params.type)) {
    result.type = params.type;
  }
  if (params.orderBy && ['time', 'time_oldest', 'view'].includes(params.orderBy)) {
    result.orderBy = params.orderBy;
  }
  if (
    params.twitchId &&
    [...Waktaverse.map((item) => item.login_name), 'isedol'].includes(params.twitchId)
  ) {
    result.twitchId = params.twitchId;
  }
  if (params.queryTxt) {
    result.queryTxt = params.queryTxt;
  }
  if (params.beginAt) {
    result.beginAt = params.beginAt;
  }
  if (params.endAt) {
    result.endAt = params.endAt;
  }

  return result;
};

/**
 * 왁타버스 영상 컨텐츠를 불러옵니다.
 *
 * @param {string} query
 * @returns {ApiMessage<{videoList: VideoContent[], videoCount: number}>}
 */
export async function getVideos(query) {
  try {
    const params = new URLSearchParams(filterVideoParams(query));

    // api 요청
    const output = await requestApi(`/video/list?` + params.toString());

    return output;
  } catch (output) {
    return apiErrorHandler(output);
  }
}
