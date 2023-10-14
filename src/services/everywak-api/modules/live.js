import * as func from '../../../common/funtions';

import { request } from '../common';

/**
 * @typedef DatabaseMemberItem
 * @property {number} updatedTimeStamp
 * @property {string} broadcasterId PK
 * @property {string} nickname
 * @property {string} twitchLoginName
 * @property {string} twitchNickname
 * @property {'admin'|'global_mod'|'staff'|''} twitchUserType
 * @property {'affiliate'|'partner'|''} twitchBroadcasterType
 * @property {string} twitchDescription
 * @property {string} twitchProfileImage
 * @property {string} twitchOfflineImage
 * @property {number} twitchCreatedTimestamp
 * @property {string} youtubeChannelId
 * @property {string} youtubeChannelName
 * @property {string} youtubeChannelDescription
 * @property {number} youtubeChannelPublishedAtTimestamp
 * @property {string} youtubeChannelProfileImage
 * @property {string} youtubeChannelBannerImage
 * @property {number} youtubeChannelSubscriberCount
 * @property {number} youtubeChannelVideoCount
 */

/**
 * 왁타버스 멤버 목록 api 요청시 입력되는 파라미터 값을 필터링합니다.
 *
 * @see getWaktaverseInfo
 * @param {{[key: string]: string}} query
 */
const filterWaktaverseInfoParams = query => {

  const filteredParams = {
  };

  if (query?.loginName) {
    filteredParams.loginName = query.loginName.replace(/[^0-9a-zA-Z_]/g, '');
  }
  if (query?.broadcasterId) {
    filteredParams.broadcasterId = query.broadcasterId.replace(/[^0-9]/g, '');
  }

  return filteredParams;
};

/**
 * 왁타버스 멤버 목록을 불러옵니다.
 *
 * @param {*} params
 * @returns {Promise<import('../common').CommonMessage<DatabaseMemberItem[]>}
 */
const getWaktaverseInfo = async params =>
  await request({
    method: 'GET',
    uri: '/live/WaktaverseInfo',
    params: filterWaktaverseInfoParams(params)
  });

export { getWaktaverseInfo };
