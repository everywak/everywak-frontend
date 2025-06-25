import { requestApi, apiErrorHandler } from './everywak.common';

/**
 * @typedef {object} VideoContent
 */

/**
 * 최근 예측 목록을 불러옵니다.
 *
 * @param {string} query
 * @returns {ApiMessage<{videoList: []}>}
 */
export async function getPredictions(query) {
  try {
    const params = new URLSearchParams({
      ...query,
      accessToken: 'fj59EHiltHgiZII5pEXXoWyCDELxJ04u',
    });

    // api 요청
    const output = await requestApi(`/live/predictions/list?` + params.toString());

    return output;
  } catch (output) {
    return apiErrorHandler(output);
  }
}
