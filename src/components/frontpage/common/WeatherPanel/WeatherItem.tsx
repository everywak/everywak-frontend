import React from 'react';
import clsx from 'clsx';
import { BasicImage } from 'common/components';
import styles from './WeatherItem.module.scss';

export interface Props {
  className?: string;
  name: string;
  state: string;
  weather: string;
  isSkeleton?: boolean;
}

export const WeatherItem = ({ className, name, state, weather, isSkeleton }: Props) => {
  return (
    <div className={clsx('WeatherItem', styles.container, className, { skeleton: isSkeleton })}>
      <div className={clsx(styles.iconWrapper, { skeletonItem: isSkeleton })}>
        <BasicImage
          className={styles.weatherImg}
          src={`https://ssl.gstatic.com/onebox/weather/64/${weather || 'fog'}.png`}
          alt={weather}
          noReferrer
        />
      </div>
      <div className={styles.infoWrapper}>
        <div className={clsx(styles.name, { skeletonItem: isSkeleton })}>{name}</div>
        <div className={clsx(styles.state, { skeletonItem: isSkeleton })}>{state}</div>
      </div>
    </div>
  );
};
