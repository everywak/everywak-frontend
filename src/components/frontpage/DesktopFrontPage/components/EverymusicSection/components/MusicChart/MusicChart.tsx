import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import * as Everywak from '@/services/everywak/v2/index';
import { MusicChartItem, Props as MusicChartItemProps } from './MusicChartItem';
import styles from './MusicChart.module.scss';

export interface Props {
  className?: string;
  title?: string;
  description?: string;
  more?: {
    label: string;
    link: string;
  };
}

export const MusicChart = (props: Props) => {
  const [musicList, setMusicList] = useState<MusicChartItemProps[]>([]);

  useEffect(() => {
    const fetchChart = async () => {
      const musicList =
        await Everywak.music.getMusicChart({
          duration: 'daily',
          orderBy: 'view',
          perPage: 10
        } as any)
        ;

      if (musicList) {
        setMusicList(
          musicList.map((item, i) => {
            const thumbnail = item.music.video.thumbnails.includes('default.jpg')
              ? item.music.video.thumbnails.replace('default.jpg', 'maxresdefault.jpg')
              : item.music.video.thumbnails;
            return {
              rank: i + 1,
              href: `https://youtu.be/${item.music.video.videoId}`,
              thumbnail: thumbnail,
              title: item.music.title,
              author: item.music.singerName,
            };
          }),
        );
      }
    };
    fetchChart();
  }, []);

  const list = musicList.map((item, i) => (
    <MusicChartItem key={i} className={styles.item} {...item} />
  ));

  return (
    <div className={clsx('MusicChart', styles.container)}>
      <ul className={styles.list}>{list.slice(0, 5)}</ul>
      <ul className={styles.list}>{list.slice(5, 10)}</ul>
    </div>
  );
};
