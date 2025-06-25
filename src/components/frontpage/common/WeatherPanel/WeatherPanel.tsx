import React from 'react';

import { useWeather } from '@/hooks/useWeather';
import { Desktop, NotDesktop } from '@/common/MediaQuery';
import { SectionHeader } from '@/common/components';

import { AsidePanel } from '@/components/frontpage/DesktopFrontPage/components';
import { getHourString, getRelativeDateString } from '@/components/weather/weather.common';
import { WeatherList } from './WeatherList';

import styles from './WeatherPanel.module.scss';

export const WeatherPanel = () => {
  const { isLoading, weatherInfo } = useWeather();

  const updatedTime = new Date(weatherInfo.updatedTime);
  const dateStr = getRelativeDateString(updatedTime);
  const timeHours = updatedTime.getHours();
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
          <WeatherList isLoading={isLoading} items={weatherInfo.latest} />
        </AsidePanel>
      </Desktop>
      <NotDesktop>
        <div className={styles.container}>
          <WeatherList isLoading={isLoading} items={weatherInfo.latest} />
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
