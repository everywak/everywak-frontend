import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ChannelStateType,
  ChannelType,
  DraggingPlayerStateType,
  LayoutType,
} from '@/utils/types/withlive.type';
import { useStorage, useWindowEvent } from 'hooks';
import { useChannels } from './hooks/useChannels';

export type Values = {
  channels: ChannelType[];
  isEnabledMultiView: boolean;
  watchingChannels: ChannelStateType[];
  multiViewLayout: LayoutType;
  isFullscreen: boolean;
  isExpanded: boolean;
  isChatVisible: boolean;
  chatChannelIds: string[];
  draggingPlayerState: DraggingPlayerStateType;
};

export type Actions = {
  setIsEnabledMultiView: (isEnabledMultiView: boolean) => void;

  setWatchingChannels: (channels: ChannelStateType[]) => void;
  addWatchingChannel: (channelId: string) => void;
  setWatchingChannelOrder: (channelId: string, order: number) => void;
  updateWatchingChannel: (channelId: string, channel: ChannelStateType) => void;
  removeWatchingChannel: (channelId: string) => void;

  setMultiViewLayout: (multiViewLayout: LayoutType) => void;
  setIsFullscreen: (isFullscreen: boolean) => void;
  setIsExpanded: (isExpanded: boolean) => void;
  setIsChatVisible: (isChatVisible: boolean) => void;
  setChatChannelIds: (chatChannelIds: string[]) => void;

  updateDraggingPlayerState: (state: Partial<DraggingPlayerStateType>) => void;
};

const WithliveValuesContext = createContext<Values | undefined>(undefined);
const WithliveActionsContext = createContext<Actions | undefined>(undefined);

interface Props {
  readonly children: React.ReactNode;
}

export const WithliveProvider = (props: Props): React.ReactNode => {
  const { channels } = useChannels();
  const [isEnabledMultiView, setIsEnabledMultiView] = useStorage<boolean>(
    'everywak.withlive.multiview.enable',
    false,
  );
  const [watchingChannels, setWatchingChannels] = useStorage<ChannelStateType[]>(
    'everywak.withlive.multiview.players',
    [],
  );
  const [multiViewLayout, setMultiViewLayout] = useStorage<LayoutType>(
    'everywak.withlive.multiview.layout',
    'one-side-r',
  );
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isChatVisible, setIsChatVisible] = useState<boolean>(true);
  const [chatChannelIds, setChatChannelIds] = useState<string[]>([]);

  const [draggingPlayerState, setDraggingPlayerState] = useState<DraggingPlayerStateType>({
    isDragging: false,
    targetMemberId: '',
    prevOrder: -1,
    order: -1,
  });

  const addWatchingChannel = (memberId: string) => {
    if (channels.findIndex((channel) => channel.memberId === memberId) === -1) {
      return;
    }
    setWatchingChannels((old) => {
      const oldWatchingChannels = [...old].sort((a, b) => b.order - a.order); // order 내림차순
      const watchingChannelIndex = oldWatchingChannels.findIndex((c) => c.memberId === memberId);
      if (watchingChannelIndex == -1) {
        oldWatchingChannels.push({
          memberId,
          isActive: true,
          order: 0,
          position: {
            x: 0,
            y: 0,
          },
          size: {
            width: 0,
            height: 0,
          },
        });
      } else {
        // 이미 시청중이면 맨 앞으로
        const wacthingChannel = oldWatchingChannels[watchingChannelIndex];
        wacthingChannel.isActive = true;
        oldWatchingChannels.splice(watchingChannelIndex, 1);
        oldWatchingChannels.push(wacthingChannel);
      }
      for (let i = 0; i < oldWatchingChannels.length; i++) {
        oldWatchingChannels[i].order = oldWatchingChannels.length - i - 1;
      }

      // memberId 오름차순
      return oldWatchingChannels.sort((a, b) => a.memberId.localeCompare(b.memberId));
    });
  };

  const setWatchingChannelOrder = (memberId: string, value: number) => {
    setWatchingChannels((channels) => {
      const fromIndex = channels.findIndex((channel) => channel.memberId === memberId);
      const toIndex = channels.findIndex((channel) => channel.order === value);
      if (value >= 0 && value < channels.length && fromIndex !== -1 && toIndex !== -1) {
        const fromOrder = channels[fromIndex].order;
        channels[fromIndex] = { ...channels[fromIndex], order: value };
        channels[toIndex] = { ...channels[toIndex], order: fromOrder };
      }
      return [...channels].sort((a, b) => a.memberId.localeCompare(b.memberId));
    });
  };

  const updateWatchingChannel = (channelId: string, channel: ChannelStateType) => {
    setWatchingChannels((channels) => {
      const index = channels.findIndex((channel) => channel.memberId === channelId);
      if (index !== -1) {
        channels[index] = channel;
      }
      return [...channels];
    });
  };

  const removeWatchingChannel = (memberId: string) => {
    if (watchingChannels.findIndex((channel) => channel.memberId === memberId) === -1) {
      return;
    }
    setWatchingChannels((old) => {
      const oldWatchingChannels = [...old].sort((a, b) => a.order - b.order); // order 오름차순
      const targetIndex = oldWatchingChannels.findIndex((c) => c.memberId === memberId);
      if (targetIndex === -1) {
        return old;
      }
      oldWatchingChannels.splice(targetIndex, 1);
      for (let i = targetIndex; i < oldWatchingChannels.length; i++) {
        oldWatchingChannels[i].order = i;
      }

      // memberId 오름차순
      return oldWatchingChannels.sort((a, b) => a.memberId.localeCompare(b.memberId));
    });
  };

  const updateDraggingPlayerState = (state: Partial<DraggingPlayerStateType>) =>
    setDraggingPlayerState((old) => ({
      ...old,
      ...state,
    }));

  useWindowEvent(
    'pointerup',
    () => {
      if (!draggingPlayerState.isDragging) {
        return;
      }
      setDraggingPlayerState((old) => {
        if (old.order !== -1) {
          setWatchingChannelOrder(old.targetMemberId, old.order);
        }
        return {
          ...old,
          isDragging: false,
        };
      });
    },
    [draggingPlayerState],
  );

  useEffect(() => {
    const onlineChannels = channels.filter((channel) => channel.streamInfo?.isLive);
    if (onlineChannels.length > 0 && watchingChannels.length === 0) {
      addWatchingChannel(onlineChannels[0].memberId);
    }
  }, [channels, watchingChannels]);

  return (
    <WithliveValuesContext.Provider
      value={{
        channels,
        isEnabledMultiView,
        watchingChannels,
        multiViewLayout,
        isFullscreen,
        isExpanded,
        isChatVisible,
        chatChannelIds,
        draggingPlayerState,
      }}
    >
      <WithliveActionsContext.Provider
        value={{
          setIsEnabledMultiView,
          setWatchingChannels,
          addWatchingChannel,
          setWatchingChannelOrder,
          updateWatchingChannel,
          removeWatchingChannel,
          setMultiViewLayout,
          setIsFullscreen,
          setIsExpanded,
          setIsChatVisible,
          setChatChannelIds,
          updateDraggingPlayerState,
        }}
      >
        {props.children}
      </WithliveActionsContext.Provider>
    </WithliveValuesContext.Provider>
  );
};

export function useWithliveValues(): Values {
  const context = useContext(WithliveValuesContext);
  if (!context) {
    throw new Error('useWithliveValues must be used within WithliveProvider');
  }
  return context;
}

export function useWithliveActions(): Actions {
  const context = useContext(WithliveActionsContext);
  if (!context) {
    throw new Error('useWithliveActions must be used within WithliveProvider');
  }
  return context;
}
