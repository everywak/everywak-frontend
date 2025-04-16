import React, { useEffect, useState } from 'react';

import * as service from 'services/Isedol';
import { Desktop, NotDesktop } from 'common/MediaQuery';
import { SectionHeader } from 'common/components';

import { AsidePanel } from 'components/frontpage/DesktopFrontPage/components';
import { getHourString, getRelativeDateString } from 'components/weather/weather.common';
import { WeatherList } from './WeatherList';

import styles from './WeatherPanel.module.scss';

export const WeatherPanel = () => {
  const [isLoading, setLoading] = useState(true);
  const [weatherInfo, setWeatherInfo] = useState({
    OBIData: [] as service.OBIInfoItem[],
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

  const dateStr = getRelativeDateString(weatherInfo.updatedTime);
  const timeHours = weatherInfo.updatedTime.getHours();
  const hourString = getHourString(timeHours);
  const updatedDateString = isLoading
    ? '불러오는 중...'
    : `${dateStr} ${hourString} ${timeHours > 12 ? timeHours % 12 : timeHours}시 기준`;

  return (
    <>
      <Desktop>
        <AsidePanel
          title="이세계 날씨"
          description={updatedDateString}
          more={{ link: '/weather', label: '더 보기' }}
        >
          <WeatherList isLoading={isLoading} items={weatherInfo.OBIData} />
        </AsidePanel>
      </Desktop>
      <NotDesktop>
        <div className={styles.container}>
          <WeatherList isLoading={isLoading} items={weatherInfo.OBIData} />
          <div className={styles.headerWrapper}>
            <SectionHeader
              description={updatedDateString}
              more={{ label: '더 보기', link: '/weather' }}
            />
          </div>
        </div>
      </NotDesktop>
    </>
  );
};
