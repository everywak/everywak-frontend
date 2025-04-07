import axios from 'axios';

/**
 * @typedef UserInfoItem
 * @property {"partner"|"affiliate"|""} broadcaster_type User’s broadcaster type.
 * @property {string} description	User’s channel description.
 * @property {string} display_name User’s display name.
 * @property {string} id User’s ID.
 * @property {string} login User’s login name.
 * @property {string} offline_image_url URL of the user’s offline image.
 * @property {string} profile_image_url	URL of the user’s profile image.
 * @property {"staff"|"admin"|"global_mod"|""} type	User’s type.
 * @property {number} view_count Total number of views of the user’s channel.
 * @property {string} email	User’s verified email address. Returned if the request includes the user:read:email scope.
 * @property {string} created_at Date when the user was created.
 */
/**
 * @typedef BlockedUserInfoItem
 * @property {string} user_id
 * @property {string} user_login
 * @property {string} display_name
 */

const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay));

class TwitchApi {
  constructor({ clientId, token }) {
    this.clientId = clientId;
    this.token = token;
    this.headers = {
      Authorization: `Bearer ${this.token}`,
      'Client-Id': this.clientId,
    };
  }

  request = async ({ url }) => await axios.get(url, { headers: this.headers });
  respond = (res) => (res.status == 200 ? res.data.data : false);

  /**
   * Gets information about one or more specified Twitch users.
   *
   * @param {string} loginName
   * @return {UserInfoItem[]}
   */
  getUsers = async (loginName) => {
    if (!this._users[loginName]) {
      const res = await this.request({
        url: `https://api.twitch.tv/helix/users?login=${loginName}`,
      });
      this._users[loginName] = this.respond(res);
    }
    return this._users[loginName];
  };

  _users = {};

  /**
   * @typedef ChannelInfoItem
   * @property {string} broadcaster_id Twitch User ID of this channel owner.
   * @property {string} broadcaster_login	Broadcaster’s user login name.
   * @property {string} broadcaster_name	Twitch user display name of this channel owner.
   * @property {string} game_name	Name of the game being played on the channel.
   * @property {string} game_id	Current game ID being played on the channel.
   * @property {string} broadcaster_language Language of the channel. A language value is either the ISO 639-1 two-letter code for a supported stream language or “other”.
   * @property {string} title	Title of the stream.
   * @property {number} delay	Stream delay in seconds.
   */
  /**
   * Gets channel information for users.
   *
   * @param {string} broadcasterId
   * @return {ChannelInfoItem[]}
   */
  getChannelInfo = async (broadcasterId) => {
    if (!this._channelInfos[broadcasterId]) {
      const res = await this.request({
        url: `https://api.twitch.tv/helix/channels?broadcaster_id=${broadcasterId}`,
      });
      this._channelInfos[broadcasterId] = this.respond(res);
    }
    return this._channelInfos[broadcasterId];
  };
  _channelInfos = {};

  getChannelChatBadges = async (userId) => {
    const res = await this.request({
      url: `https://api.twitch.tv/helix/chat/badges?broadcaster_id=${userId}`,
    });

    return this.respond(res);
  };

  getGlobalChatBadges = async () => {
    const res = await this.request({ url: `https://api.twitch.tv/helix/chat/badges/global` });

    return this.respond(res);
  };

  getEmoteSets = async (emoteSetID) => {
    const res = await this.request({
      url: `https://api.twitch.tv/helix/chat/emotes/set?${emoteSetID.map((em) => `emote_set_id=${em}`).join('&')}`,
    });

    return this.respond(res);
  };

  /**
   * broadcasterId에서 차단된 유저 목록을 출력합니다.
   *
   * @see _getBlockedUsers
   * @param {string} broadcasterId
   * @returns {BlockedUserInfoItem[]}
   */
  getBlockedUsersAll = async (broadcasterId) => {
    try {
      const outputs = [];

      let pageToken = '';
      while (true) {
        const res = await this._getBlockedUsers(broadcasterId, pageToken);
        console.log(res);

        if (!res.data.data) {
          break;
        }

        outputs.push(...res.data.data);
        pageToken = res.data.pagination.cursor;
        if (!res.data.pagination.cursor) {
          break;
        }
        await wait(10);
      }

      if (outputs.length === 0) {
        return false;
      }

      return outputs;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  /**
   * broadcasterId에서 차단된 유저 목록을 출력합니다.
   *
   * @param {string} broadcasterId
   * @param {string} pageToken
   */
  _getBlockedUsers = async (broadcasterId, pageToken = '') => {
    const params = new URLSearchParams({
      broadcaster_id: broadcasterId,
      first: 100,
      after: pageToken,
    });

    const res = await this.request({
      url: `https://api.twitch.tv/helix/users/blocks?${params.toString()}`,
    });

    return res;
  };
}

export default TwitchApi;
