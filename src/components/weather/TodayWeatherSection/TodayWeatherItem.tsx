import React, { CSSProperties } from 'react';
import clsx from 'clsx';
import { BasicImage } from 'common/components';
import { personalColor } from '../weather.common';
import styles from './TodayWeatherItem.module.scss';

export interface Props {
  name: string;
  state: string;
  description?: string;
  weather: string;
  isSkeleton?: boolean;
}

export const TodayWeatherItem = ({
  name = 'null',
  state,
  description = '',
  weather,
  isSkeleton,
}: Props): JSX.Element => {
  const color =
    name !== 'null'
      ? ({
          '--color': `var(--color-${personalColor[name as keyof typeof personalColor]})`,
        } as CSSProperties)
      : {};

  return (
    <div className={clsx('TodayWeatherItem', styles.container, { skeleton: isSkeleton })}>
      <div className={styles.nameWrapper}>
        <div className={styles.personalColorPoint} style={color}></div>
        <div className={clsx(styles.name, { skeletonItem: isSkeleton })}>{name}</div>
      </div>
      <div className={styles.infoWrapper}>
        <div className={clsx(styles.iconWrapper, { skeletonItem: isSkeleton })}>
          <BasicImage
            className={styles.weatherImg}
            src={`https://ssl.gstatic.com/onebox/weather/128/${weather || 'fog'}.png`}
            alt={weather}
            noReferrer
          />
        </div>
        <div className={styles.descWrapper}>
          <div className={clsx(styles.state, { skeletonItem: isSkeleton })}>{state}</div>
          {description && (
            <div className={clsx(styles.description, { skeletonItem: isSkeleton })}>
              {description
                .split('\n')
                .map((line) => line)
                .join('\n')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
