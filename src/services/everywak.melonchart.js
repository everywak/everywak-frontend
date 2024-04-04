import { Waktaverse } from "../common/constants";

import { requestApi, apiErrorHandler } from "./everywak.common";

/**
 * @typedef {object} MusicItem
 */

/**
 * 최근 예측 목록을 불러옵니다.
 * 
 * @param {string} query
 * @returns {ApiMessage<{ musicChart: [], musicChartCount: number, page: number, perPage: number }>}
 */
export async function getMusicChart(query) {
  try {
    
    const params = new URLSearchParams({ ...query });

    // api 요청
    const output = await requestApi(`/melonchart/musicChart?` + params.toString());

    return output;
    
  } catch(output) {
    return apiErrorHandler(output);
  }
}