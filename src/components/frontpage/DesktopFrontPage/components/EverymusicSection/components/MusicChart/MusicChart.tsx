import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import * as service from '@/services/Music';
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
      const { musicList } = (
        await service.getWakMusics({ viewerRange: 'daily', orderBy: 'view', perPage: 10 } as any)
      ).result;

      if (musicList) {
        setMusicList(
          musicList.map((item, i) => {
            return {
              rank: i + 1,
              href: `https://youtu.be/${item.videoId}`,
              thumbnail: item.thumbnail,
              title: item.title,
              author: item.singer,
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
