import { TypedEmitter } from 'utils/typed-emitter';
import { ChatItem } from '../LiveChat.type';

export interface LiveChatEventMap {
  chat: (chats: ChatItem[]) => void;
  connect: () => void;
  disconnect: () => void;
  authorize: () => void;
  join: (channelId: string) => void;
  leave: (channelId: string) => void;
  error: (error: string) => void;
}

export abstract class LiveChatAdapterClass extends TypedEmitter<LiveChatEventMap> {
  protected serverAddress: string;

  private _isConnected: boolean;
  public get isConnected() {
    return this._isConnected;
  }
  protected set isConnected(value: boolean) {
    const oldValue = this._isConnected;
    this._isConnected = value;
    if (oldValue === value) return;
    this.emit(value ? 'connect' : 'disconnect');
  }

  private _isAuthorized: boolean;
  public get isAuthorized(): boolean {
    return this._isAuthorized;
  }
  protected set isAuthorized(value: boolean) {
    const oldValue = this._isAuthorized;
    this._isAuthorized = value;
    if (oldValue === value || !value) return;
    this.emit('authorize');
  }

  protected accessToken: string;
  protected channels: string[];

  constructor() {
    super();
    this.serverAddress = '';
    this._isConnected = false;
    this._isAuthorized = false;
    this.accessToken = '';
    this.channels = [];
  }

  // connection
  abstract connect(): void;
  abstract disconnect(): void;
  abstract authorize(token: string): void;

  abstract joinChannel(channelId: string[]): void;
  abstract leaveChannel(channelId: string[]): void;
  getChannels() {
    return this.channels;
  }
  protected addChannel(channelId: string) {
    if (this.channels.includes(channelId)) return;
    this.channels.push(channelId);
    this.emit('join', channelId);
  }
  protected removeChannel(channelId: string) {
    if (!this.channels.includes(channelId)) return;
    this.channels = this.channels.filter((id) => id !== channelId);
    this.emit('leave', channelId);
  }

  abstract sendChat(channelId: string, message: string): void;
}
