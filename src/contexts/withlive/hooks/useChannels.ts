import { useMember, useQueryLive } from 'hooks';
import { useEffect, useState } from 'react';
import { ChannelStreamInfoType, ChannelType } from 'utils/types/withlive.type';

export const useChannels = () => {
  const [channels, setChannels] = useState<ChannelType[]>([]);

  const members = useMember();
  const { isLoading, data: lives, refetch } = useQueryLive();

  useEffect(() => {
    const loop = setInterval(() => {
      refetch();
    }, 10000);
    return () => {
      clearInterval(loop);
    };
  }, [refetch]);

  useEffect(() => {
    const channels = members.map<ChannelType>((member) => ({
      memberId: member.id,
      nickname: member.name,
      profileImage: member.profile.profileImage,
      offlineImage: member.profile.offlineImage,
      streamInfo: null,
    }));
    if (!isLoading && lives) {
      channels.forEach((channel) => {
        const live = lives.find((live) => live.id.split(':')[0] === channel.memberId);
        if (!live) {
          return;
        }
        const stream: ChannelStreamInfoType = {
          title: live.title,
          isLive: live.isLive,
          viewerCount: live.viewerCount,
          startedTime: new Date(live.startedTimestamp).getTime(),
          thumbnail: live.thumbnail,
          platform: live.livePlatform.type,
          channelId: live.livePlatform.channelId,
          videoId: live.videoId,
          chatId: live.chatId,
        };
        channel.streamInfo = stream;
      });
    }
    setChannels(channels);
  }, [isLoading, JSON.stringify(lives?.filter((live) => live.isLive)), members]);

  return {
    channels,
  };
};
