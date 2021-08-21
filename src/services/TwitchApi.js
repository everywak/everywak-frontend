import axios from 'axios';

class TwitchApi {

  constructor({ clientId, token }) {
    this.clientId = clientId;
    this.token = token;
    this.headers = {
      'Authorization': `Bearer ${this.token}`,
      'Client-Id': this.clientId,
    };
  }

  request = async ({url}) => await axios.get(url, {headers: this.headers});
  respond = res => res.status == 200 ? res.data.data : false;

  getUsers = async loginName => {
    const res = await this.request({url: `https://api.twitch.tv/helix/users?login=${loginName}`});

    return this.respond(res);
  }

  getChannelInfo = async broadcasterId => {
    const res = await this.request({url: `https://api.twitch.tv/helix/channels?broadcaster_id=${broadcasterId}`});

    return this.respond(res);
  }

  getChannelChatBadges = async userId => {
    const res = await this.request({url: `https://api.twitch.tv/helix/chat/badges?broadcaster_id=${userId}`});

    return this.respond(res);
  }

  getGlobalChatBadges = async () => {
    const res = await this.request({url: `https://api.twitch.tv/helix/chat/badges/global`});

    return this.respond(res);
  }

  getEmoteSets = async emoteSetID => {
    const res = await this.request({url: `https://api.twitch.tv/helix/chat/emotes/set?${emoteSetID.map(em => `emote_set_id=${em}`).join('&')}`});

    return this.respond(res);
  }
}

export default TwitchApi;