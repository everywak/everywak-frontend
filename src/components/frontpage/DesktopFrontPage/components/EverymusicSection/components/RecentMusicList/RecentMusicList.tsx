import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import HorizontalScrollableList from '@/common/components/legacy/HorizontalScrollableList/HorizontalScrollableList';
import { VideoItem, Props as VideoItemProps } from '@/components/video/VideoItem/VideoItem';
import Spinner from '@/common/components/legacy/Spinner';

import * as Everywak from '@/services/everywak/v2/index';

import styles from './RecentMusicList.module.scss';

const now = new Date();
const lastWeek = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate() - 14,
);

export const RecentMusicList = () => {
  const [isLoading, setLoading] = useState(true);
  const [musicList, setMusicList] = useState<VideoItemProps[]>([]);

  useEffect(() => {
    const fetchRecentMusic = async (reset = true) => {
      const musicList =
        await Everywak.music.getMusics({
          orderBy: 'time',
          perPage: 30,
        });


      if (musicList) {
        setMusicList(
          musicList.filter((item) => new Date(item.video.publishedTimestamp) >= lastWeek)
          .map((item) => {
            const thumbnail = item.video.thumbnails.includes('default.jpg') ? item.video.thumbnails.replace('default.jpg', 'hqdefault.jpg') : item.video.thumbnails;
            return {
              href: `https://youtu.be/${item.video.videoId}`,
              thumbnail: thumbnail,
              title: item.title,
              datetime: new Date(item.video.publishedTimestamp),
              authorProfileImg: '',
              duration: item.video.duration,
              viewCount: item.video.viewCount,
            };
          }),
        );
        setLoading(false);
      }
    };
    fetchRecentMusic();
  }, []);

  const className = clsx('RecentMusicList', styles.container);

  if (isLoading) {
    return (
      <div className={className}>
        <HorizontalScrollableList backgroundColor="var(--color-background-white)">
          <ul className={styles.list}>
            <Spinner className={styles.spinner} />
          </ul>
        </HorizontalScrollableList>
      </div>
    );
  }

  const list = musicList.map((item, i) => (
    <VideoItem key={i} {...item} size="tiny" hideThumbnail />
  ));

  return (
    <div className={className}>
      <HorizontalScrollableList backgroundColor="var(--color-background-white)">
        {list.length > 0 ? (
          <ul className={styles.list}>{list}</ul>
        ) : (
          <div className={styles.empty}>최근 2주간 신곡이 올라오지 않았어요.</div>
        )}
      </HorizontalScrollableList>
    </div>
  );
};
