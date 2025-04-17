import React from 'react';
import clsx from 'clsx';
import { orderNickname } from '../weather.common';
import SkeletonLoader from 'common/components/legacy/SkeletonLoader';
import * as service from 'services/Isedol';
import { PrevWeatherItem } from './PrevWeatherItem';
import styles from './PrevWeatherList.module.scss';

const skeleton = <PrevWeatherItem weather="sunny" isSkeleton />;
export interface Props {
  date?: string;
  items?: service.OBIInfoItem[];
  isLoading?: boolean;
}

export const PrevWeatherList = ({ date = '000000', items, isLoading }: Props) => {
  const list = items
    ?.sort(
      (a, b) =>
        orderNickname[a.nickname as keyof typeof orderNickname] -
        orderNickname[b.nickname as keyof typeof orderNickname],
    )
    .map((item) => <PrevWeatherItem key={item.nickname} weather={item.weather} />);

  const dateTarget = new Date(
    parseInt('20' + date.slice(0, 2)),
    parseInt(date.slice(2, 4)) - 1,
    parseInt(date.slice(4, 6)),
  );
  const dateString = `${dateTarget.getMonth() + 1}/${dateTarget.getDate()}(${'일월화수목금토'[dateTarget.getDay()]})`;

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
