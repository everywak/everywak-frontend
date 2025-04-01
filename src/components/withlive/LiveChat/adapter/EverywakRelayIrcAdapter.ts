import { ChatEmote, ChatItemCommonChat } from '../LiveChat.type';
import { LiveChatAdapterClass } from './LiveChatAdapterClass';

import * as Everywak from 'services/api-v2/index';

// TODO: 접속 에러 발생시 재시도 구현
// TODO: CAP cmd 제대로 구현
// TODO: 최초 로딩시 구독 뱃지, 이모티콘 리스트 표시되게
// TODO: ogq스티커 구현
// TODO: 채팅방 입장, 퇴장 메시지 구현
// TODO: 채금, 밴 메시지 구현

export class EverywakRelayIrcAdapter extends LiveChatAdapterClass {
  private socket: WebSocket | null;
  private connRetries: number = 0;

  private subscriptionList: Record<string, { month: number; src: string }[]> =
    {};
  private emoteList: Record<string, { emote: ChatEmote[]; regex: RegExp }> = {};

  constructor() {
    super();
    this.serverAddress = 'wss://irc.everywak.kr';
    this.socket = null;
  }

  connect() {
    if (
      this.isConnected ||
      (this.socket && this.socket.readyState <= WebSocket.CLOSING)
    ) {
      return;
    }
    this.socket = new WebSocket(this.serverAddress);
    this.socket.addEventListener('open', () => {
      this.isConnected = true;
      this.authorize('');
    });
    this.socket.addEventListener('close', () => {
      this.isConnected = false;
      this.isAuthorized = false;
    });
    this.socket.addEventListener('message', this.messageHandler);
    this.socket.addEventListener('error', (e) => console.log(e));
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeEventListener('message', this.messageHandler);
      this.socket.close();
    }
  }

  authorize(token: string) {
    this.accessToken = token;

    this.send(`PASS oauth:${this.accessToken}`);
    this.send('NICK EverywakChat');
    this.send(
      'CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership',
    );
  }

  joinChannel(channelId: string[]): void {
    channelId.forEach((id) => this.send(`JOIN #${id}`));
  }

  leaveChannel(channelId: string[]): void {
    channelId.forEach((id) => this.send(`PART #${id}`));
  }

  messageHandler = (event: MessageEvent<string>) => {
    const res = event.data.split('\r\n').map((str) => {
      const arr = str.split(' ');
      const result = arr.splice(0, event.data[0] === '@' ? 3 : 2);

      result.push(arr.join(' '));
      return result;
    });

    res.forEach(async (data) => {
      if (this.isConnected && !this.isAuthorized) {
        if (data[2] === '* :Login authentication failed') {
          console.log('Login authentication failed.');
        }
        if (data[1] == '376') {
          this.isAuthorized = true;
          console.log('Login authentication completed successfully.');
        }
      } else if (this.isConnected && this.isAuthorized) {
        if (data[1] == 'JOIN') {
          const channelId = data[2].slice(1).split(' ')[0];
          this.addChannel(channelId);

          if (!this.subscriptionList[channelId]) {
            this.fetchSubscriptionList(channelId);
          }
          if (!this.emoteList[channelId]) {
            this.fetchEmoteList(channelId);
          }

          // reset retry count
          this.connRetries = 0;

          // this.appendSystemMessage({
          //   key: `joinedChannel:${Date.now()}`,
          //   msg: `${data[2].slice(1)} 채팅방 입장`
          // })
        } else {
          this.chatHandler(data);
        }
      }
      if (data[0] === 'PING') {
        this.send(`PONG :irc.everywak.kr`);
      }
    });
  };

  chatHandler = (data: string[]) => {
    if ('PART' === data[1]) {
      this.removeChannel(data[2].slice(1).split(' ')[0]);
      return;
    }

    if (data[2] == 'PRIVMSG') {
      const channelId = data[3].match(/#[a-z]*\/([a-z0-9_-]*) /)?.[1];
      if (!channelId) {
        return;
      }
      this.emit('chat', [
        this.parseChat({
          tag: data[0],
          id: data[1],
          msg: data[3].split(':').length > 1 ? data[3].split(':')[1] : data[3],
          channelId: channelId,
        }),
      ]);
    }
  };

  parseChat = ({
    tag,
    id,
    msg,
    channelId = '#',
  }: {
    tag: string;
    id: string;
    msg: string;
    channelId: string;
  }): ChatItemCommonChat => {
    const tags = this.parseTag(tag);

    const badge = [];
    if (tags.subscription) {
      badge.push({
        id: `${channelId}-sub-${tags.subscription}`,
        name: `${tags.subscription}개월 구독자`,
        icon:
          this.subscriptionList[channelId]?.reduce((badge, sub) =>
            sub.month <= parseInt(tags.subscription) ? sub : badge,
          )?.src || '',
      });
    }
    if (tags.manager) {
      badge.push({
        id: 'manager',
        name: '매니저',
        icon: '',
      });
    } else if (tags.fan) {
      badge.push({
        id: 'fan',
        name: '팬클럽',
        icon: '',
      });
    }

    const content = this.parseEmote(
      msg,
      channelId,
      parseInt(tags.subscription) > 0,
    );

    const regexMsg = new RegExp(
      `:(?<loginName>[\\w\\d-_]+)!\\k<loginName>@\\k<loginName>\\.irc\\.everywak\\.kr`,
    );

    const displayName = tags['display-name'];
    const userID = id.match(regexMsg)?.groups?.loginName || '';
    const color = tags.color;
    // const badgeList = badges.map((bg: any) => {
    //   if (bg) {
    //     return {
    //       id: bg.id,
    //       src_1x: bg.image_url_1x,
    //       src_2x: bg.image_url_2x,
    //       src_3x: bg.image_url_4x,
    //     };
    //   }
    // });

    return {
      type: 'chat',
      channelId: channelId.slice(1),
      id: tags.id || '' + Date.now() + Math.random(),
      profile: {
        color: color,
        name: displayName,
        id: userID,
        badge,
      },
      timestamp: parseInt(tags['tmi-sent-ts']),
      content,
      accentColor: '',
    };
  };

  parseTag = (tag: string) => {
    const tags: Record<string, string> = {};
    tag
      .slice(1)
      .split(';')
      .map((t) => {
        const [k, v] = t.split('=');
        tags[k] = v;
      });
    return tags;
  };

  parseEmote = (
    msg: string,
    channelId: string,
    isSubscriber: boolean,
  ): (string | ChatEmote)[] => {
    const result: (string | ChatEmote)[] = [];

    if (!isSubscriber || !this.emoteList[channelId]) {
      result.push(msg);
      return result;
    }

    const emoteList = this.emoteList[channelId];

    const emoteMap: Record<string, ChatEmote> = {};
    emoteList.emote.forEach((emote) => {
      emoteMap['/' + emote.name + '/'] = emote;
    });

    const matches = msg.matchAll(emoteList.regex);
    let lastIdx = 0;

    for (const match of matches) {
      if (match.index !== 0 && !match.index) {
        continue;
      }
      const emote = emoteMap[match[0]];
      if (emote) {
        result.push(msg.slice(lastIdx, match.index));
        result.push(emote);
        lastIdx = match.index + match[0].length;
      }
    }
    result.push(msg.slice(lastIdx));

    return result;
  };

  send = (message: string) => {
    if (this.socket && this.isConnected) {
      this.socket.send(message);
    }
  };

  sendChat(channelId: string, message: string): void {}

  private async fetchSubscriptionList(channelId: string) {
    const [platform, channelName] = channelId.split('/');
    try {
      const streamInfo = await Everywak.afreeca.getStream(channelName);
      if (streamInfo.CHANNEL.RESULT === 1) {
        const subList = streamInfo.CHANNEL.PCON_OBJECT.tier1.map((sub) => ({
          month: sub.MONTH,
          src: sub.FILENAME,
        }));
        this.subscriptionList[channelName] = subList;
      }
    } catch (e) {
      console.error(e);
    }
  }

  private async fetchEmoteList(channelId: string) {
    const [platform, channelName] = channelId.split('/');
    try {
      const emoteList = await Everywak.afreeca.getEmote(channelName);
      if (emoteList.result === 1) {
        const emote = emoteList.data.map((emote) => ({
          name: emote.title,
          id: emote.title,
          imgPc: `https://static.file.afreecatv.com/signature_emoticon/${channelName}/${emote.pc_img}`,
          imgMobile: `https://static.file.afreecatv.com/signature_emoticon/${channelName}/${emote.mobile_img}`,
          groupId: channelId,
          groupName: channelId,
          isMoving: emote.move_img === 'Y',
        }));
        this.emoteList[channelName] = {
          emote,
          regex: new RegExp(
            `(${emote.map((emote) => `\\/${emote.name}\\/`).join('|')})`,
            'g',
          ),
        };
      }
    } catch (e) {
      console.error(e);
    }
  }
}
