import { useEffect, useRef } from 'react';
import { EverywakRelayIrcAdapter } from './adapter/EverywakRelayIrcAdapter';
import { LiveChatAdapterClass } from './adapter/LiveChatAdapterClass';
import { useLiveChatActions, useLiveChatValue } from './LiveChat.context';

const diffChannel = (oldChannels: string[], newChannels: string[]) => {
  const willLeaves = oldChannels.filter(
    (channel) => !newChannels.includes(channel),
  );
  const willJoins = newChannels.filter(
    (channel) => !oldChannels.includes(channel),
  );
  return { willLeaves, willJoins };
};

export type Props = {
  channelId: string[];
};

export function LiveChatAdapter(props: Props) {
  const { addChatItem, setChannelId } = useLiveChatActions();
  const { channelId } = useLiveChatValue();

  const adapter = useRef<LiveChatAdapterClass>();

  // initialize adapter
  useEffect(() => {
    if (!adapter.current) {
      adapter.current = new EverywakRelayIrcAdapter();
    }
    const joinChannel = () => adapter.current?.joinChannel(channelId);
    adapter.current?.addEventListener('authorize', joinChannel);
    if (!adapter.current.isConnected) {
      adapter.current.connect();
    }
    return () => {
      adapter.current?.removeEventListener('authorize', joinChannel);
    };
  }, [channelId]);

  // add chat event listener
  useEffect(() => {
    if (adapter.current) {
      adapter.current.addEventListener('chat', addChatItem);
      return () => adapter.current?.removeEventListener('chat', addChatItem);
    }
    return () => {};
  }, [addChatItem]);

  // join channel
  useEffect(() => {
    if (adapter.current && adapter.current.isAuthorized) {
      const { willLeaves, willJoins } = diffChannel(
        [...adapter.current.getChannels()],
        channelId,
      );
      adapter.current.leaveChannel(willLeaves);
      adapter.current.joinChannel(willJoins);
    }
  }, [channelId]);

  // 채널 id 전달
  useEffect(() => {
    setChannelId(props.channelId);
  }, [props.channelId]);

  return <></>;
}
