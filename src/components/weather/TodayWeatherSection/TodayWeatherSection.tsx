import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import * as service from 'services/Isedol';
import { TodayWeatherList } from './TodayWeatherList';
import styles from './TodayWeatherSection.module.scss';

export const TodayWeatherSection = () => {
  const [isLoading, setLoading] = useState(true);
  const [weatherInfo, setWeatherInfo] = useState<{
    OBIData: service.OBIInfoItem[];
    updatedTime: Date;
  }>({
    OBIData: [],
    updatedTime: new Date(),
  });

  useEffect(() => {
    const fetchIsedolWeather = async () => {
      const { OBIData, updatedTimeStamp } = (await service.getOBI()).result;
      if (OBIData) {
        setWeatherInfo({
          OBIData,
          updatedTime: new Date(updatedTimeStamp),
        });
        setLoading(false);
      }
    };
    fetchIsedolWeather();
  }, []);

  return (
    <section className={clsx('TodayWeatherSection', styles.container)}>
      <TodayWeatherList isLoading={isLoading} items={weatherInfo.OBIData} />
    </section>
  );
};
