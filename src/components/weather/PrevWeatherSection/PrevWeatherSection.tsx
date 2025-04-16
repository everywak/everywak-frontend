import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import { MILLISECONDS_OF_DAY } from 'common/constants';
import { PrevWeatherList } from './PrevWeatherList';

import * as service from 'services/Isedol';

import styles from './PrevWeatherSection.module.scss';

export interface Props {
  length?: number;
}

export const PrevWeatherSection = ({ length = 4 }: Props) => {
  const [weatherInfo, setWeatherInfo] = useState<{ date: string; data: service.OBIInfoItem[] }[]>(
    Array(length).fill(null),
  );

  useEffect(() => {
    const updateIsedolWeather = async (dateOffset: number) => {
      const targetDate = new Date(Date.now() - dateOffset * MILLISECONDS_OF_DAY);
      const date = `${('0' + targetDate.getFullYear()).slice(-2)}${('0' + (targetDate.getMonth() + 1)).slice(-2)}${('0' + targetDate.getDate()).slice(-2)}`;

      const apiResponse = await service.getOBI(date);
      const { OBIData } = apiResponse.result;
      if (OBIData) {
        setWeatherInfo((prevList) => {
          prevList[dateOffset - 1] = {
            data: OBIData,
            date,
          };
          return [...prevList];
        });
      }
    };
    Array(length)
      .fill(0)
      .forEach((_, i) => updateIsedolWeather(i + 1));
  }, []);

  const weatherList = weatherInfo.map((item, i) =>
    item ? (
      <>
        <PrevWeatherList key={`${i}_false`} items={item.data} date={item.date} />
        <div className={styles.weatherBorder} />
      </>
    ) : (
      <>
        <PrevWeatherList key={i} isLoading />
        <div className={styles.weatherBorder} />
      </>
    ),
  );

  return (
    <section className={clsx('PrevWeatherSection', styles.container)}>{weatherList.flat()}</section>
  );
};
