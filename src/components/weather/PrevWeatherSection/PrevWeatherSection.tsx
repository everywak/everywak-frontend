import React from 'react';
import clsx from 'clsx';

import { PrevWeatherList } from './PrevWeatherList';
import { useWeather } from 'hooks/useWeather';

import styles from './PrevWeatherSection.module.scss';

export interface Props {
  length?: number;
}

export const PrevWeatherSection = ({ length = 4 }: Props) => {
  const { isLoading, weatherInfo } = useWeather();

  if (isLoading) {
    return (
      <section className={clsx('PrevWeatherSection', styles.container)}>
        <PrevWeatherList isLoading />
        <div className={styles.weatherBorder} />
        <PrevWeatherList isLoading />
        <div className={styles.weatherBorder} />
        <PrevWeatherList isLoading />
        <div className={styles.weatherBorder} />
        <PrevWeatherList isLoading />
        <div className={styles.weatherBorder} />
      </section>
    );
  }

  const weatherList = weatherInfo.recent.slice(0, length).map((item, i) => (
    <>
      <PrevWeatherList key={`${i}_false`} items={item} date={item[0].date} />
      <div className={styles.weatherBorder} />
    </>
  ));

  return (
    <section className={clsx('PrevWeatherSection', styles.container)}>{weatherList.flat()}</section>
  );
};
