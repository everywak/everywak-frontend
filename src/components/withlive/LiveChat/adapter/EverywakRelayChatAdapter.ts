import { ChatBadge, ChatEmote, ChatItemCommonChat } from '../LiveChat.type';
import { LiveChatAdapterClass } from './LiveChatAdapterClass';
import {
  ChannelChatBase,
  Chat,
  ChatChannelListResponse,
  ChatJoinResponse,
  ChatLoginResponse,
  ChatPartResponse,
  ChatPrivateMessageResponse,
  ChatType,
  ChatUserMessage,
} from './EverywakRelayChatAdapter/types.chat';
import { getCookie, setCookie } from 'utils/cookie';

export class EverywakRelayChatAdapter extends LiveChatAdapterClass {
  private socket: WebSocket | null;
  private connRetries: number = -1;
  private userId: string = getCookie('userId'); // TODO: replace with actual user id

  private loopPing: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.serverAddress = import.meta.env.VITE_CHAT_URL;
    this.socket = null;

    if (!getCookie('USER_CHAT_ID')) {
      setCookie('USER_CHAT_ID', `justinfan${Math.floor(100 + Math.random() * 900)}`);
    }
    this.userId = getCookie('USER_CHAT_ID');
  }

  connect = () => {
    if (this.isConnected || (this.socket && this.socket.readyState <= WebSocket.CLOSING)) {
      return;
    }
    this.connRetries = 0;
    this.socket = new WebSocket(this.serverAddress);
    this.socket.addEventListener('open', () => {
      this.isConnected = true;
      this.authorize(this.userId);
      this.loopPing = setInterval(() => {
        if (this.socket && this.isConnected) {
          this.send(ChatType.PING);
        }
      }, 10000);
    });
    this.socket.addEventListener('close', () => {
      this.isConnected = false;
      this.isAuthorized = false;
      clearInterval(this.loopPing!);
      this.loopPing = null;
      this.tryReconnect();
    });
    this.socket.addEventListener('message', this.messageHandler);
    this.socket.addEventListener('error', (e) => console.log(e));
  };

  disconnect = () => {
    if (this.socket) {
      this.socket.removeEventListener('message', this.messageHandler);
      this.socket.close();
    }
    clearTimeout(this.reconnectTimer!);
    this.reconnectTimer = null;
    this.connRetries = -1;
  };

  tryReconnect = () => {
    if (this.connRetries === -1) {
      return;
    }
    console.log(`Reconnect attempt ${this.connRetries + 1}`);
    this.reconnectTimer = setTimeout(
      () => {
        this.connRetries++;
        if (this.connRetries > 5) {
          console.error('Reconnect failed');
          clearTimeout(this.reconnectTimer!);
          this.reconnectTimer = null;
          return;
        }
        this.connect();
      },
      1000 * Math.pow(2, this.connRetries),
    );
  };

  authorize = (token: string) => {
    this.accessToken = token;

    this.send(ChatType.LOGIN, {
      userId: this.userId,
    });
  };

  joinChannel = (channelId: string[]) => {
    this.send(ChatType.JOIN, {
      userId: this.userId,
      channelIds: channelId,
    });
  };

  leaveChannel = (channelId: string[]) => {
    this.send(ChatType.PART, {
      userId: this.userId,
      channelIds: channelId,
    });
  };

  messageHandler = (message: MessageEvent<string>) => {
    try {
      const msg = JSON.parse(message.data) as Chat;
      switch (msg.type) {
        case ChatType.PING:
          break;
        case ChatType.LOGIN:
          this.onLogin(msg as ChatLoginResponse);
          break;
        case ChatType.JOIN:
          this.onJoin(msg as ChatJoinResponse);
          break;
        case ChatType.PART:
          this.onPart(msg as ChatPartResponse);
          break;
        case ChatType.CHLIST:
          this.onChannelList(msg as ChatChannelListResponse);
          break;
        case ChatType.SYSMSG:
        case ChatType.CHNOTICE:
        case ChatType.PRIVMSG:
        case ChatType.DONATION:
        case ChatType.BLOCK:
        case ChatType.ICEMODE:
        case ChatType.SLOWMODE:
        case ChatType.POLL:
          this.chatHandler(msg as ChannelChatBase);
          break;
        default:
          throw new Error('Unknown message type');
      }
    } catch (e) {
      console.error(e);
      console.warn(`Invalid message: ${JSON.stringify(e)}`);
    }
  };

  onLogin = (msg: ChatLoginResponse) => {
    this.isAuthorized = true;
    console.log('login success', msg);
  };

  onJoin = (msg: ChatJoinResponse) => {
    const channelIds = msg.body.channelIds ?? [];
    channelIds.forEach((channelId) => this.addChannel(channelId));

    // reset retry count
    this.connRetries = 0;

    // this.appendSystemMessage({
    //   key: `joinedChannel:${Date.now()}`,
    //   msg: `${data[2].slice(1)} 채팅방 입장`
    // })
  };
  onPart = (msg: ChatPartResponse) => {
    const { channelIds } = msg.body;
    channelIds.forEach((channelId) => this.removeChannel(channelId));

    // this.appendSystemMessage({
    //   key: `joinedChannel:${Date.now()}`,
    //   msg: `${data[2].slice(1)} 채팅방 퇴장`
    // })
  };
  onChannelList = (msg: ChatChannelListResponse) => {};

  chatHandler = (msg: ChannelChatBase) => {
    switch (msg.type) {
      case ChatType.PRIVMSG: {
        this.emit('chat', [this.parseChat(msg as ChatPrivateMessageResponse)]);
        break;
      }
      case ChatType.SYSMSG:
      case ChatType.CHNOTICE:
      case ChatType.DONATION:
      case ChatType.BLOCK:
      case ChatType.ICEMODE:
      case ChatType.SLOWMODE:
      case ChatType.POLL:
        break;
    }
  };

  parseChat = (msg: ChatPrivateMessageResponse): ChatItemCommonChat => {
    const { channelId } = msg;
    const badge: ChatBadge[] = [];
    msg.body.profile.badges.forEach((tag) => {
      switch (tag.name) {
        case 'streamer':
          badge.push({
            id: 'streamer',
            name: '스트리머',
            icon: '',
          });
          break;
        case 'manager':
          badge.push({
            id: 'manager',
            name: '매니저',
            icon: '',
          });
          break;
        case 'topfan':
          badge.push({
            id: 'topfan',
            name: '열혈팬',
            icon: '',
          });
          break;
        case 'fan':
          badge.push({
            id: 'fan',
            name: '팬클럽',
            icon: '',
          });
          break;
        default: {
          if (tag.name.startsWith('sub/')) {
            try {
              const month = parseInt(tag.name.replace('sub/', ''));
              badge.push({
                id: `${channelId}-${tag.name.replace('/', '-')}`,
                name: `${month}개월 구독자`,
                icon: tag.imgUrl,
              });
            } catch (e) {
              console.error(e);
              console.warn(`Invalid badge name: ${tag.name}`);
            }
          } else {
            badge.push({
              id: tag.name,
              name: tag.name,
              icon: tag.imgUrl,
            });
          }
        }
      }
    });

    const content = this.parseEmote(msg.body.message);

    return {
      type: 'chat',
      channelId,
      id: '' + Date.now() + '' + Math.random(),
      profile: {
        color: `#${msg.body.profile.color}`,
        colorDarkmode: `#${msg.body.profile.colorDarkmode}`,
        name: msg.body.profile.nickname,
        id: msg.body.profile.userId.replace(/\(\d\)/, ''),
        badge,
      },
      timestamp: msg.body.timestamp,
      content,
      accentColor: '',
    };
  };

  parseEmote = (content: ChatUserMessage[]) => {
    const result: (string | ChatEmote)[] = [];
    content.forEach((msg) => {
      if (msg.type === 'text') {
        result.push(msg.text);
      } else if (msg.type === 'emote') {
        result.push({
          name: msg.name,
          id: msg.name,
          imgPc: msg.imgUrl,
          imgMobile: msg.imgUrl,
          groupId: msg.name,
          groupName: msg.name,
          isMoving: false,
        });
      }
    });
    return result;
  };

  send = (type: ChatType, body?: any) => {
    if (!this.socket || this.socket?.readyState !== this.socket.OPEN || !this.isConnected) {
      return;
      //throw new Error(`Socket is not opened`);
    }
    this.socket.send(
      JSON.stringify({
        type,
        ...(body ? { body } : {}),
      }),
    );
  };

  sendChat(channelId: string, message: string): void {
    throw new Error('Method not implemented.');
  }
}
