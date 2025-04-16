import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import HorizontalScrollableList from 'common/components/legacy/HorizontalScrollableList/HorizontalScrollableList';
import { VideoItem, Props as VideoItemProps } from 'components/video/VideoItem/VideoItem';
import Spinner from 'common/components/legacy/Spinner';

import * as service from 'services/Music';

import styles from './RecentMusicList.module.scss';

const now = new Date();
const lastWeek = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate() - ((now.getDay() + 1) % 7) - 7,
);

export const RecentMusicList = () => {
  const [isLoading, setLoading] = useState(true);
  const [musicList, setMusicList] = useState<VideoItemProps[]>([]);

  useEffect(() => {
    const fetchRecentMusic = async (reset = true) => {
      const { musicList } = (
        await service.getWakMusics({
          viewerRange: 'all',
          orderBy: 'time',
          perPage: 30,
          beginAt: Math.floor(lastWeek.getTime() / 1000),
        } as any)
      ).result;

      if (musicList) {
        setMusicList(
          musicList.map((item) => {
            return {
              href: `https://youtu.be/${item.videoId}`,
              thumbnail: item.thumbnail,
              title: item.title,
              datetime: new Date(item.publishedTimeStamp),
              authorProfileImg: '',
              duration: item.duration,
              viewCount: item.viewCountChanged,
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
