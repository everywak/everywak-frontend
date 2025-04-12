import { useEffect, useRef } from 'react';
import { EverywakRelayChatAdapter } from './adapter/EverywakRelayChatAdapter';
import { LiveChatAdapterClass } from './adapter/LiveChatAdapterClass';
import { useLiveChatActions, useLiveChatValue } from './LiveChat.context';
import { useWithliveValues } from 'contexts/withlive';

const diffChannel = (oldChannels: string[], newChannels: string[]) => {
  const willLeaves = oldChannels.filter((channel) => !newChannels.includes(channel));
  const willJoins = newChannels.filter((channel) => !oldChannels.includes(channel));
  return { willLeaves, willJoins };
};

export type Props = {
  channelIds: string[];
};

export function LiveChatAdapter(props: Props) {
  const { watchingChannels } = useWithliveValues();
  const { addChatItem, setChannelId, setConnected, setAuthorized } = useLiveChatActions();
  const { channelId, option } = useLiveChatValue();

  const adapter = useRef<LiveChatAdapterClass>();

  // initialize adapter
  useEffect(() => {
    if (!adapter.current) {
      adapter.current = new EverywakRelayChatAdapter();
    }
    return () => {
      adapter.current?.disconnect();
    };
  }, []);
  useEffect(() => {
    const joinChannel = () => adapter.current?.joinChannel(channelId);
    adapter.current?.on('authorize', joinChannel);
    if (!adapter.current?.isConnected) {
      adapter.current?.connect();
    }
    return () => {
      adapter.current?.off('authorize', joinChannel);
    };
  }, [channelId]);

  // add chat event listener
  useEffect(() => {
    if (adapter.current) {
      adapter.current.on('chat', addChatItem);
      const onConnected = () => {
        setConnected(true);
      };
      const onDisconnected = () => {
        setConnected(false);
        setAuthorized(false);
      };
      const onAuthorized = () => {
        setAuthorized(true);
      };
      adapter.current.on('connect', onConnected);
      adapter.current.on('disconnect', onDisconnected);
      adapter.current.on('authorize', onAuthorized);
      return () => {
        adapter.current?.off('chat', addChatItem);
        adapter.current?.off('connect', onConnected);
        adapter.current?.off('disconnect', onDisconnected);
      };
    }
    return () => {};
  }, [addChatItem]);

  // join channel
  useEffect(() => {
    if (adapter.current && adapter.current.isAuthorized) {
      const { willLeaves, willJoins } = diffChannel([...adapter.current.getChannels()], channelId);
      willLeaves.length > 0 && adapter.current.leaveChannel(willLeaves);
      willJoins.length > 0 && adapter.current.joinChannel(willJoins);
    }
  }, [channelId]);

  // 채널 id 전달
  useEffect(() => {
    if (!option.isShowAllMultiView) {
      const mainChannel = watchingChannels.find((channel) => channel.order === 0);
      mainChannel && setChannelId([mainChannel.memberId]);
    } else {
      setChannelId(props.channelIds);
    }
  }, [JSON.stringify(props.channelIds), watchingChannels, option.isShowAllMultiView]);

  return <></>;
}
