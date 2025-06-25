import React from 'react';
import clsx from 'clsx';
import { useWeather } from '@/hooks/useWeather';
import { TodayWeatherList } from './TodayWeatherList';
import styles from './TodayWeatherSection.module.scss';

export const TodayWeatherSection = () => {
  const { isLoading, weatherInfo } = useWeather();

  return (
    <section className={clsx('TodayWeatherSection', styles.container)}>
      <TodayWeatherList isLoading={isLoading} items={weatherInfo.latest} />
    </section>
  );
};
