import React from 'react';
import clsx from 'clsx';
import * as service from 'services/Isedol';
import SkeletonLoader from 'common/components/legacy/SkeletonLoader';
import { orderNickname } from '../weather.common';
import { TodayWeatherItem } from './TodayWeatherItem';
import styles from './TodayWeatherList.module.scss';

const skeleton = <TodayWeatherItem name="ㅇㅇㅇ" state="ㅇㅇㅇ" weather="sunny" isSkeleton />;

export interface Props {
  items: service.OBIInfoItem[];
  isLoading: boolean;
}

export const TodayWeatherList = ({ items, isLoading }: Props) => {
  const list =
    items &&
    items
      .sort(
        (a, b) =>
          orderNickname[a.nickname as keyof typeof orderNickname] -
          orderNickname[b.nickname as keyof typeof orderNickname],
      )
      .map((item) => (
        <TodayWeatherItem
          key={item.nickname}
          name={item.nickname}
          state={item.rawInfo}
          weather={item.weather}
          description={item.description}
        />
      ));

  return (
    <ul className={clsx('TodayWeatherList', styles.container)}>
      {isLoading ? <SkeletonLoader skeleton={skeleton} length={6} /> : list}
    </ul>
  );
};
