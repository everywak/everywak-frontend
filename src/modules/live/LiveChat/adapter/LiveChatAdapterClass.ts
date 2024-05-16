import { ChatItem } from '../LiveChat.type';

export type EventName =
  | 'chat'
  | 'connect'
  | 'disconnect'
  | 'authorize'
  | 'join'
  | 'leave'
  | 'error';
export type LiveChatEvent<T> = (param: T) => void;
export interface LiveChatEventMap {
  chat: ChatItem[];
  connect: undefined;
  disconnect: undefined;
  authorize: undefined;
  join: string;
  leave: string;
  error: string;
}

export abstract class LiveChatAdapterClass {
  protected serverAddress: string;

  private _isConnected: boolean;
  public get isConnected() {
    return this._isConnected;
  }
  protected set isConnected(value: boolean) {
    const oldValue = this._isConnected;
    this._isConnected = value;
    if (oldValue === value) return;
    this.performEvent(value ? 'connect' : 'disconnect', undefined);
  }

  private _isAuthorized: boolean;
  public get isAuthorized(): boolean {
    return this._isAuthorized;
  }
  protected set isAuthorized(value: boolean) {
    const oldValue = this._isAuthorized;
    this._isAuthorized = value;
    if (oldValue === value || !value) return;
    this.performEvent('authorize', undefined);
  }

  protected accessToken: string;
  protected channels: string[];

  constructor() {
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

  // events
  private eventListeners: {
    [T in EventName]: LiveChatEvent<LiveChatEventMap[T]>[];
  } = {
    chat: [],
    connect: [],
    disconnect: [],
    authorize: [],
    join: [],
    leave: [],
    error: [],
  };
  addEventListener<T extends EventName>(
    event: T,
    handler: LiveChatEvent<LiveChatEventMap[T]>,
  ) {
    this.eventListeners[event]?.push(handler);
  }
  removeEventListener<T extends EventName>(
    event: T,
    handler: LiveChatEvent<LiveChatEventMap[T]>,
  ) {
    (this.eventListeners[event] as LiveChatEvent<LiveChatEventMap[T]>[]) =
      this.eventListeners[event]?.filter((h) => h !== handler);
  }
  performEvent<T extends EventName>(event: T, param: LiveChatEventMap[T]) {
    this.eventListeners[event].forEach((handler) => handler(param));
  }

  abstract joinChannel(channelId: string[]): void;
  abstract leaveChannel(channelId: string[]): void;
  getChannels() {
    return this.channels;
  }
  protected addChannel(channelId: string) {
    if (this.channels.includes(channelId)) return;
    this.channels.push(channelId);
    this.performEvent('join', channelId);
  }
  protected removeChannel(channelId: string) {
    if (!this.channels.includes(channelId)) return;
    this.channels = this.channels.filter((id) => id !== channelId);
    this.performEvent('leave', channelId);
  }

  abstract sendChat(channelId: string, message: string): void;
}
