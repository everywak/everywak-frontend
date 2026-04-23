import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import { Waktaverse } from '@/common/constants';
import * as func from '@/common/functions';
import * as Everywak from '@/services/everywak/v2/index';

import { Props as VideoItemProps, VideoItemSize } from '../VideoItem/VideoItem';

import styles from './VideoContentList.module.scss';
import { VideoSlideList } from '../VideoSlideList/VideoSlideList';
import { VideoGridList } from '../VideoGridList/VideoGridList';
import { useQueryMember } from '@/hooks';
import { SearchVideoParams } from '@/services/everywak/v2/types/video';

export interface Props {
  className?: string;
  options: SearchVideoParams;
  type?: 'slide' | 'grid' | 'list';
  size?: VideoItemSize;
  shorts?: boolean;
  hideProfileCircle?: boolean;
  backgroundColor?: string;
  defaultShowCount?: number;
  perPageCount?: number;
  maximumShowCount?: number;
}

export const VideoContentList = (props: Props) => {
  const {
    className,
    options,
    type,
    size = 'medium',
    shorts = false,
    hideProfileCircle = false,
    backgroundColor = 'var(--color-background-white)',
    defaultShowCount,
    perPageCount,
    maximumShowCount,
    ...rest
  } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [videoList, setVideoList] = useState<VideoItemProps[]>([]);

  const { isLoading: isMemberLoading, data: members } = useQueryMember();

  useEffect(() => {
    const fetchVideoContent = async () => {
      if (shorts) {
        options.isShorts = true;
      }

      const videoList = await Everywak.video.getVideos(options);

      const urlPrefix = shorts ? 'https://www.youtube.com/shorts/' : 'https://youtu.be/';

      if (videoList && !isMemberLoading && members) {
        setVideoList(
          videoList.map((item) => {
            const member = members.find((member) => member.id === item.member.id);
            const date = new Date(item.publishedTimestamp);
            const itemProps: VideoItemProps = {
              href: `${urlPrefix}${item.videoId}`,
              thumbnail: item.thumbnails,
              title: item.title,
              datetime: date,
              duration: item.duration,
              viewCount: item.viewCount,
              authorProfileImg: member?.profile.profileImage ?? '',
            };
            return itemProps;
          }),
        );
      }
      setIsLoading(false);
    };
    fetchVideoContent();
  }, [options, shorts, isMemberLoading, members]);

  return (
    <div
      className={clsx('VideoContentList', styles.container, className, {
        [styles.shorts]: shorts,
        [styles.hideProfileCircle]: hideProfileCircle,
      })}
      {...rest}
    >
      {type === 'slide' ? (
        <VideoSlideList
          items={videoList}
          size={size}
          backgroundColor={backgroundColor}
          isLoading={isLoading}
          shorts={shorts}
        />
      ) : (
        <VideoGridList
          items={videoList}
          size={size}
          listStyle={type}
          defaultShowCount={defaultShowCount}
          perPageCount={perPageCount}
          maximumShowCount={maximumShowCount}
          isLoading={isLoading}
          shorts={shorts}
        />
      )}
    </div>
  );
};
