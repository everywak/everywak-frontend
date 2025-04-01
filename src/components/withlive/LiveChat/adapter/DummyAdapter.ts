import { LiveChatAdapterClass } from './LiveChatAdapterClass';

export class DummyAdapter extends LiveChatAdapterClass {
  constructor() {
    super();
    setInterval(() => {
      if (this.isConnected) {
        this.performEvent('chat', [
          {
            type: 'chat',
            channelId: 'asdf',
            id: '' + Date.now(),
            profile: {
              id: 'id',
              name: '닉네임',
              badge: [
                {
                  id: '1',
                  name: '1개월 구독자',
                  icon: 'https://static.file.afreecatv.com/spcon/514365c0f92a9b601.png?_=1707179859',
                },
              ],
              color: ['#1915bf', '#eb500d', '#0c80d3', '#0b6d82'][
                Math.floor(Math.random() * 4)
              ],
            },
            content: [
              'content content content content content content'.slice(
                0,
                Math.floor(Math.random() * 50),
              ),
            ],
            timestamp: Date.now(),
            accentColor: '',
          },
        ]);
      }
    }, 100);
  }

  connect() {
    this.isConnected = true;
  }

  disconnect() {
    this.isConnected = false;
  }

  authorize(token: string) {
    this.accessToken = token;
    this.isAuthorized = true;
  }

  joinChannel(channelId: string[]): void {
    channelId.forEach(id => this.addChannel(id));
  }

  leaveChannel(channelId: string[]): void {
    channelId.forEach(id => this.removeChannel(id));
  }

  sendChat(channelId: string, message: string): void {
    this.performEvent('chat', [
      {
        type: 'chat',
        channelId,
        id: '' + Date.now(),
        profile: {
          id: 'asdf1234',
          name: '나',
          badge: [
            {
              id: '1',
              name: '1개월 구독자',
              icon: 'https://static.file.afreecatv.com/spcon/514365c0f92a9b601.png?_=1707179859',
            },
          ],
          color: '#1915bf',
        },
        content: [message],
        timestamp: Date.now(),
        accentColor: '',
      },
    ]);
  }
}
