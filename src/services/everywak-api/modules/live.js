import { request } from '../common';

/**
 * @typedef DatabaseLiveItem
 * @property {string} broadcasterId PK
 * @property {number} updatedTimeStamp
 * @property {'TWITCH'|'YOUTUBE'|'NONE'} broadcaster
 * @property {string} title
 * @property {number} viewerCount
 * @property {number} startedTime
 * @property {string} thumbnail
 * @property {string} videoId
 * @property {string} nickname
 * @property {string} loginName
 */
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

/**
 * 왁타버스 생방송 정보 api 요청시 입력되는 파라미터 값을 필터링합니다.
 *
 * @see getWaktaverseLiveInfo
 * @param {{[key: string]: string}} query
 */
const filterWaktaverseLiveInfoParams = query => {

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
 * 왁타버스 생방송 정보를 불러옵니다.
 *
 * @param {*} params
 * @returns {Promise<import('../common').CommonMessage<DatabaseLiveItem[]>}
 */
const getWaktaverseLiveInfo = async params =>
  await request({
    method: 'GET',
    uri: '/live/WaktaverseLiveInfo',
    params: filterWaktaverseLiveInfoParams(params)
  });

export { getWaktaverseInfo, getWaktaverseLiveInfo };
