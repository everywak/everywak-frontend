import React from 'react';
import clsx from 'clsx';
import SkeletonLoader from '@/common/components/legacy/SkeletonLoader';
import { OBI } from '@/services/everywak/v2/types/obi';
import { PrevWeatherItem } from './PrevWeatherItem';
import styles from './PrevWeatherList.module.scss';

const skeleton = <PrevWeatherItem weather="sunny" isSkeleton />;

export interface Props {
  date?: string;
  items?: OBI[];
  isLoading?: boolean;
}

export const PrevWeatherList = ({ date = '000000', items, isLoading }: Props) => {
  const list = items?.map((item) => (
    <PrevWeatherItem key={item.member.name} weather={item.weather} />
  ));

  const year = parseInt(date.slice(0, 2));
  const month = parseInt(date.slice(2, 4));
  const day = parseInt(date.slice(4, 6));
  const dateTarget = new Date(year + 2000, month - 1, day);

  const dateString = `${month}/${day}(${dateTarget.toLocaleString('ko-KR', { weekday: 'short' })})`;

  return (
    <ul className={clsx('PrevWeatherList', styles.container)}>
      {isLoading ? (
        <>
          <SkeletonLoader
            skeleton={
              <div className={clsx(styles.date, 'skeleton')}>
                <div className="skeletonItem">00/00(ㅇ)</div>
              </div>
            }
            length={1}
          />
          <SkeletonLoader skeleton={skeleton} length={6} />
        </>
      ) : (
        <>
          <div className={styles.date}>{dateString}</div>
          {list}
        </>
      )}
    </ul>
  );
};
