import React from 'react';
import { Cookies } from 'react-cookie';

import TwitchApi from '../../services/TwitchApi';

const cookies = new Cookies();

const setCookie = (name, value, option) => cookies.set(name, value, { ...option })
const getCookie = name => cookies.get(name)

/**
 * @typedef TwitchChatItemData
 * @property {'USERCHAT'|'SYSMSG'} type
 * @property {object} tags
 * @property {string} userID
 * @property {{
 * color: string, badges: array, displayName: string, userID: string
 * }} profile
 * @property {array} content
 * @property {string} rawContent
 * @property {string} key
 */

class TwitchChatClientCore {
  
  static CLOSED     = 0;
  static CONNECTED  = 1;
  static FAILED     = 3;
  static AUTHORIZED = 10;
  static JOINED     = 11;

  static LOGOUTED   = 0;
  static LOGINING   = 1;
  static LOGINED    = 2;
  
  constructor({
    clientId, channelName,
    onChangeOAuthState, onChangeIRCState, onUpdateEmoteSet, onChat
  }) {
    this.clientId = clientId || '';
    this.channelName = channelName || '';
    
    this.maxChatCount = 1000;
    /**
     * @type {TwitchChatItemData[]}
     */
    this.chatList = [];

    this.oauth = '';
    this.oauthState = TwitchChatClientCore.LOGOUTED;

    this.IRCState  = TwitchChatClientCore.CLOSED;
    this.connRetries = 0;

    this.selfInfo = '';
    this.userLoginId = '';

    this.badges = {};
    this.emoteSets = [];

    this.twitchApi = null;

    // handlers
    this.onChangeOAuthState = onChangeOAuthState || (e => {});
    this.onChangeIRCState = onChangeIRCState || (e => {});
    this.onUpdateEmoteSet = onUpdateEmoteSet || (e => {});
    this.onChat = onChat || (e => {});
  }
  
  /**
   * Initialize Twitch API Adapter.
   * @see TwitchApi
   * @returns {TwitchApi}
   */
   getTwitchApi = () => {
    if (!this.twitchApi && this.clientId && this.oauth) {
      this.twitchApi = new TwitchApi({
        clientId: this.clientId,
        token: this.oauth,
      });
    }

    return this.twitchApi;
  }

  /**
   * Create a WebSocket to communicate with Twitch Chat Server.
   */
  connectTwitchIRC = () => {
    this.twitchIRC = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

    // bind event handler
    this.twitchIRC.onopen    = this.onOpen;
    this.twitchIRC.onclose   = this.onClose;
    this.twitchIRC.onmessage = this.onMessage;
    this.twitchIRC.onerror   = this.onError;

    // start loop pingpong
    this.loopPingPong = setInterval(() => this.sendMessage('PING :tmi.twitch.tv'), 300*1000);
  }

  /**
   * Get the client's OAuth token.
   */
  loadClientOAuth = token => {
    if (token) {
      setCookie('TWITCH_AUTH', token);
    }

    this.setOAuthState(TwitchChatClientCore.LOGINING);
    this.setOAuthToken(getCookie('TWITCH_AUTH'));
  }

  setOAuthToken = newToken => {
    const oldToken = this.oauth;
    this.oauth = newToken;
    if (oldToken !== newToken) {
      this.loginTwitchIRC();
    }
  }

  /**
   * Set IRC state
   * 
   * @param {Number} newState
   * @see IRCState
   */
  setIRCState = newState => {
    const oldState = this.IRCState;
    this.IRCState = newState;
    if (oldState !== newState) {
      this.onChangeIRCState(newState);
    }
  }

  /**
   * Set OAuth state
   * 
   * @param {Number} newState
   * @see oauthState
   */
  setOAuthState = newState => {
    const oldState = this.oauthState;
    this.oauthState = newState;
    if (oldState !== newState) {
      this.onChangeOAuthState(newState);
      if (newState === TwitchChatClientCore.LOGINING) {
        this.connectTwitchIRC();
      }
    }
  }

  setChannelName = newChannel => {
    const oldChannel = this.channelName;
    this.channelName = newChannel;
    if (oldChannel !== newChannel) {
      if (this.IRCState === TwitchChatClientCore.JOINED) { // rejoin
        this.sendMessage(`PART #${oldChannel}`);
        this.sendMessage(`JOIN #${newChannel}`);
      }
    }
  }

  onOpen = e => {
    if (process.env.NODE_ENV == 'development') { console.log('Connected to Twitch Chat.'); }

    this.setIRCState(TwitchChatClientCore.CONNECTED);
    this.loginTwitchIRC();
  };

  /**
   * Send request of login to Twitch chat.
   */
  loginTwitchIRC = () => {
    this.sendMessage(`PASS oauth:${this.oauth}`);
    this.sendMessage('NICK TwitchChatClient');
    this.sendMessage('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
  }

  onClose = e => {
    console.log('Twitch IRC WebSocket is closed.');
    this.setOAuthState(TwitchChatClientCore.LOGOUTED);
    this.setIRCState(TwitchChatClientCore.CLOSED);
    clearInterval(this.loopPingPong);

    if (this.oauth != undefined && this.oauth != '' && !e.wasClean) { // retry login now,2,4,8 secs..
      setTimeout(this.connectTwitchIRC, Math.pow(2, this.connRetries++) * 1000);
    }
  };

  onMessage = e => {
    const res = e.data.split('\r\n').map(str => {
      const arr = str.split(' ');
      const result = arr.splice(0, e.data.substr(0, 1) === '@' ? 3 : 2);

      result.push(arr.join(' '));
      return result;
    });
    if (process.env.NODE_ENV == 'development') { console.log('Twitch IRC WebSocket has sended a message.'); console.log(res); }

    res.map(async data => {
      switch(this.IRCState) {
        case TwitchChatClientCore.CONNECTED:
          if (data[2] === '* :Login authentication failed') {
            this.setIRCState(TwitchChatClientCore.FAILED);
            this.setOAuthState(TwitchChatClientCore.LOGOUTED);
            console.log('Login authentication failed.');
          }
          if (data[1] == '376') {
            this.setIRCState(TwitchChatClientCore.AUTHORIZED);
            this.sendMessage(`JOIN #${this.channelName}`);
            console.log('Login authentication completed successfully.');
          }
          break;

        case TwitchChatClientCore.AUTHORIZED:
          if (data[1] == 'JOIN') {
            this.setIRCState(TwitchChatClientCore.JOINED);
            this.setOAuthState(TwitchChatClientCore.LOGINED);

            // reset retry count
            this.connRetries = 0; 

            this.appendSystemMessage({
              key: `joinedChannel:${Date.now()}`,
              msg: `${data[2].slice(1)} 채팅방 입장`
            })
            const twitchApi = this.getTwitchApi();
            const user = await twitchApi.getUsers(this.channelName);
            // load chat's bagdes
            const badgesChannel = await twitchApi.getChannelChatBadges(user[0].id);
            const badgesGlobal = await twitchApi.getGlobalChatBadges();
            badgesGlobal.map(b => {
              b.versions.map(bg => {
                this.badges[b.set_id + '/' + bg.id] = {
                  id: b.set_id + '/' + bg.id,
                  image_url_1x: bg.image_url_1x,
                  image_url_2x: bg.image_url_2x,
                  image_url_4x: bg.image_url_4x,
                }
              });
            });
            badgesChannel.map(b => {
              b.versions.map(bg => {
                this.badges[b.set_id + '/' + bg.id] = {
                  image_url_1x: bg.image_url_1x,
                  image_url_2x: bg.image_url_2x,
                  image_url_4x: bg.image_url_4x,
                }
              });
            });

            // set my login id
            this.userLoginId = data[0].substr(1, data[0].indexOf('!') - 1);
          }
          break;
        case TwitchChatClientCore.JOINED:
          this.handleChatMessage(data);
          if (data[0] === 'PING') {
            this.sendMessage('PONG :tmi.twitch.tv');
          }
          break;
      }
    });
  };

  onError = e => {
    console.log('Cannot connect to Twitch chat server.');
    this.setIRCState(TwitchChatClientCore.FAILED);
  };

  handleChatMessage = data => {
    if (process.env.NODE_ENV == 'development') { console.log(data); }

    if (data[2] == 'PRIVMSG') {
      this.receiveChat({tag: data[0], id: data[1], msg: data[3].split(':').length > 1 ? data[3].split(':')[1] : data[3]});
    } else if (data[2] && data[2].match(/^USERSTATE/)) {
      this.updateSelfInfo(data);
    } else if ('PART' === data[1]) {
      const { loginName } = data[0].match(/:(?<loginName>[\w\d-_]+)!\k<loginName>@\k<loginName>\.tmi\.twitch\.tv/).groups;
      if (this.userLoginId === loginName) { // is me
        this.setIRCState(TwitchChatClientCore.AUTHORIZED);
      }
    }
  }

  /**
   * Update my chat profile.
   * 
   * @param {Array} data
   */
  updateSelfInfo = async data => {
    this.selfInfo = data[0];
    
    const tags = this.parseTag(this.selfInfo);
    await this.updateEmoteSet(tags['emote-sets']);
  }

  /**
   * Send a command to Twitch IRC.
   * 
   * @param {String} data
   */
  sendMessage = data => {
    if ([ TwitchChatClientCore.CONNECTED, TwitchChatClientCore.AUTHORIZED, TwitchChatClientCore.JOINED ].includes(this.IRCState)) {
      this.twitchIRC.send(data);
      return true;
    } else {
      return false;
    }
  };

  /**
   * Send a chat message to Twitch IRC.
   * 
   * @see chatInput
   * @returns If message sended.
   */
  sendChat = msg => {
    if (this.IRCState === TwitchChatClientCore.JOINED) {
      this.sendMessage(`PRIVMSG #${this.channelName} :${msg}`);
      const myUserLoginId = `:${this.userLoginId}!${this.userLoginId}@${this.userLoginId}.tmi.twitch.tv`;
      if (msg != '') {
        this.receiveChat({
          tag: `${this.selfInfo};id=my-chat-${Math.random() * 9999999}`, 
          id: myUserLoginId, 
          msg, 
          mine: true,
        });
        return true;
      }
    }
    return false;
  }

  /**
   * Handle a received chat message from Twitch IRC
   * 
   * @see handleChatMessage
   * @param {String} tag
   * @param {String} id
   * @param {String} msg
   */
  receiveChat = async ({ tag, id, msg, mine = false }) => {
    const tags = this.parseTag(tag);
    
    const badges    = this.parseBadge(tags.badges);
    const emotes    = this.parseEmote(tags.emotes);

    // parse emotes
    this.emoteSets.map(ems => {
      for(let i = 0; i < msg.length; i++) {
        const pos = msg.indexOf(ems.name, i);
        if(pos != -1) {
          emotes.push({
            id: ems.id, 
            pos: [[pos, pos + ems.name.length - 1]],
          });
          i += pos + ems.name.length - 1;
        }
      }
    })

    const content     = this.replaceEmote(msg, emotes);
    const displayName = tags['display-name'];
    const userID      = id.match(/:(?<loginName>[\w\d-_]+)!\k<loginName>@\k<loginName>\.tmi\.twitch\.tv/).groups.loginName;
    const color       = tags.color;
    const badgeList   = badges.map(bg => {
      if (bg) {
        return ({
          id: bg.id,
          src_1x: bg.image_url_1x, 
          src_2x: bg.image_url_2x, 
          src_3x: bg.image_url_4x,
        });
      }
    }
    );

    const chat = {
      type: 'USERCHAT',
      tags: tags,
      userId: userID,
      profile: {
        color: color,
        badges: badgeList,
        displayName,
        userID,
      },
      content: content,
      rawContent: msg,
      key: tags.id,
    };

    // append chat to list
    this.appendToChatList(chat);
  }

  appendSystemMessage = ({id, msg}) => {
    
    const message = {
      type: 'SYSMSG',
      key: id,
      content: msg,
    };

    // append chat to list
    this.appendToChatList(message);
  }

  /**
   * Parse and save emoteSets that can be used in this chat.
   */
  updateEmoteSet = async emoteSetsRaw => {
    const emoteSets = this.parseEmoteSets(emoteSetsRaw);

    if (emoteSets.length > 0 && this.emoteSets.length === 0) {
      const twitchApi = this.getTwitchApi();
      const emoteSetsData = await twitchApi.getEmoteSets(emoteSets);
      this.emoteSets = emoteSetsData;
      this.onUpdateEmoteSet(this.emoteSets);
    }
  }

  /**
   * Append chatItem to chatList.
   * 
   * @see TwitchChatClientCore.receiveChat
   * @param {TwitchChatItemData} chat A chat to append
   */
  appendToChatList = chat => {
    this.chatList = [...this.chatList, chat].slice(-this.maxChatCount);
    this.onChat({
      last: chat,
      chatList: this.chatList,
    });
  }

  /**
   * Parse tags ftom '@tag=value;tag=value'
   * 
   * @return {Object} tags
   */
  parseTag = tag => {
    const tags = {};
    tag.substr(1).split(';').map(t => {
      const [k, v] = t.split('=');
      tags[k] = v;
    });
    return tags;
  }

  /**
   * Parse emote info from tag data
   * 
   * @return {Array} emote data
   */
  parseEmote = data => {
    const emotes = [];

    if (!data) { return emotes; }
    
    // parse emote data
    data.replace(';', '') // id:pos/id:pos,pos/id:pos,pos
    .split('/').map(em => { // [ id:pos, id:pos,pos, id:pos,pos ]
      const [ id, pos ] = em.split(':');
      emotes.push({
        id: id, 
        pos: pos.split(',').map(p => {const [b, e] = p.split('-'); return [parseInt(b), parseInt(e)];}),
      });
    });
    return emotes;
  }

  /**
   * Parse emote sets from tag data
   * 
   * @return {Array} emote sets data
   */
  parseEmoteSets = data => {
    if (!data) { return []; }
    
    // parse emote sets data
    return data.replace(';', '').split(',');
  }

  /**
   * Parse badge info from tag data
   * 
   * @return {Array} badge data
   */
  parseBadge = data => {
    const badges = [];

    if (!data) { return badges; }
    
    // parse badge data
    data.split(',').map(bg => { // badge/id,badge/id,badge/id
      badges.push(this.badges[bg]);
    });
    return badges;
  }

  /**
   * Replace emote string to emote tag
   * 
   * @return {Array}
   */
  replaceEmote = (str, emotes) => {

    if (!emotes || emotes.length == 0) { return [str]; } // skip if not exist emotes

    const content = [];
    let cursor = 0, i = 0;
    for(i = 0; i < str.length; i++) {
      const emo = emotes.find(em => em.pos.find(p => p[0] === i));
      if (emo) {
        const pos = emo.pos.filter(p => p[0] === i)[0];
        content.push(str.substring(cursor, i)); // push prev
        content.push({emoteId: emo.id}); // push emote
        i = pos[1]; //skip
        cursor = pos[1] + 1;
        continue;
      }
    }
    if (cursor != str.length) {
      content.push(str.substring(cursor, str.length)); // push last string
    }

    return content;
  }

  /**
   * Close Twitch chat service
   */
  close = () => {
    this.sendMessage(`PART #${this.channelName}`);
    this.twitchIRC.close();
  }
}

export default TwitchChatClientCore;