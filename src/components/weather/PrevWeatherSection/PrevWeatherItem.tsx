import React from 'react';
import clsx from 'clsx';
import { BasicImage } from '@/common/components';
import styles from './PrevWeatherItem.module.scss';

export interface Props {
  className?: string;
  weather: string;
  isSkeleton?: boolean;
}

export const PrevWeatherItem = (props: Props) => {
  return (
    <div className={clsx('PrevWeatherItem', styles.container, { skeleton: props.isSkeleton })}>
      <div className={clsx(styles.iconWrapper, { skeletonItem: props.isSkeleton })}>
        <BasicImage
          className={styles.weatherImg}
          src={`https://ssl.gstatic.com/onebox/weather/128/${props.weather || 'fog'}.png`}
          alt={props.weather}
          noReferrer
        />
      </div>
    </div>
  );
};

export default PrevWeatherItem;
