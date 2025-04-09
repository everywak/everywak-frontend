import React, { useEffect, useState } from 'react';

import { Waktaverse } from '../../common/constants';
import * as func from '../../common/functions';
import * as videoApi from '../../services/everywak.video';

import HorizontalScrollableList from '../../common/components/legacy/HorizontalScrollableList/HorizontalScrollableList';
import Spinner from 'common/components/legacy/Spinner';

import VideoItem from './VideoItem';

import './VideoContentList.scss';
import cx from 'classnames';

export interface Props {
  className?: string;
  options: {
    type: 'all' | 'youtubeVideo' | 'youtubeClip' | 'youtubeVOD';
    orderBy?: 'time' | 'time_oldest' | 'view';
    twitchId?: string;
    queryTxt?: string;
    beginAt?: string;
    endAt?: string;
  };
  type?: 'horizontal' | 'card';
  size?: 'small' | 'normal';
  shorts?: boolean;
  hideProfileCircle?: boolean;
  backgroundColor?: string;
}

function VideoContentList(props: Props) {
  const {
    className,
    options,
    type,
    size = 'normal',
    shorts = false,
    hideProfileCircle = false,
    backgroundColor = 'var(--color-background-white)',
    ...rest
  } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [videoList, setVideoList] = useState([]);

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
            key: `video-${item.videoId}`,
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
  useEffect(() => {
    fetchVideoContent();
  }, [options, shorts]);

  if (isLoading) {
    return (
      <div
        className={cx('VideoContentList', className, {
          shorts,
          hideProfileCircle,
        })}
        {...rest}
      >
        <HorizontalScrollableList backgroundColor={backgroundColor}>
          <ul className="list">
            <Spinner className="spinner" />
          </ul>
        </HorizontalScrollableList>
      </div>
    );
  }
  const list = videoList.map((item) => <VideoItem {...(item as any)} size={size} />);
  return (
    <div
      className={cx('VideoContentList', className, {
        shorts,
        hideProfileCircle,
      })}
      {...rest}
    >
      <HorizontalScrollableList backgroundColor={backgroundColor}>
        <ul className="list">{list}</ul>
      </HorizontalScrollableList>
    </div>
  );
}

export default VideoContentList;
