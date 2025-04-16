import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import { Waktaverse } from 'common/constants';
import * as func from 'common/functions';
import * as videoApi from 'services/everywak.video';

import { Props as VideoItemProps, VideoItemSize } from '../VideoItem/VideoItem';

import styles from './VideoContentList.module.scss';
import { VideoSlideList } from '../VideoSlideList/VideoSlideList';
import { VideoGridList } from '../VideoGridList/VideoGridList';

export interface Props {
  className?: string;
  options: {
    type: 'all' | 'youtubeVideo' | 'youtubeClip' | 'youtubeVOD';
    orderBy?: 'time' | 'time_oldest' | 'view';
    twitchId?: string;
    queryTxt?: string;
    beginAt?: number;
    endAt?: number;
  };
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

  useEffect(() => {
    const fetchVideoContent = async () => {
      if (shorts) {
        options.queryTxt = 'horts';
      }

      const response = await videoApi.getVideos(options as any);
      const { videoList } = response.result;

      const urlPrefix = shorts ? 'https://www.youtube.com/shorts/' : 'https://youtu.be/';

      if (videoList) {
        setVideoList(
          videoList.map((item: any) => {
            const target = Waktaverse.find((mb) => mb.login_name === item.twitchId)!;
            const thumbnails = JSON.parse(item.thumbnails);
            const thumbnail = thumbnails.high ||
              thumbnails.medium ||
              thumbnails.default || { url: '' };
            return {
              href: `${urlPrefix}${item.videoId}`,
              thumbnail: thumbnail.url,
              title: item.title,
              datetime: item.publishedAt * 1000,
              formattedDateTime: func.formatDateTimeString(new Date(item.publishedAt * 1000)),
              author: item.nickname,
              duration: item.duration,
              viewCount: item.viewCount,
              authorProfileImg: target.profileImg?.replace('{size}', '240'),
            };
          }),
        );
      }
      setIsLoading(false);
    };
    fetchVideoContent();
  }, [options, shorts]);

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
