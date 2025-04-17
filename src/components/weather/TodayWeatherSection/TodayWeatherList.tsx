import React from 'react';
import clsx from 'clsx';
import { OBI } from 'services/everywak/v2/types/obi';
import SkeletonLoader from 'common/components/legacy/SkeletonLoader';
import { orderNickname } from '../weather.common';
import { TodayWeatherItem } from './TodayWeatherItem';
import styles from './TodayWeatherList.module.scss';

const skeleton = <TodayWeatherItem name="ㅇㅇㅇ" state="ㅇㅇㅇ" weather="sunny" isSkeleton />;

export interface Props {
  items: OBI[];
  isLoading: boolean;
}

export const TodayWeatherList = ({ items, isLoading }: Props) => {
  const list = items?.map((item) => (
    <TodayWeatherItem
      key={item.member.name}
      name={item.member.name}
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
