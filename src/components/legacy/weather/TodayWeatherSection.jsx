import React, { useEffect, useState } from 'react';

import { getRelativeDateString } from './weather.common';
import TodayWeatherList from './TodayWeatherList';

import * as service from 'services/Isedol';

import './TodayWeatherSection.scss';
import cx from 'classnames';

/**
 * 날씨 페이지 오늘 날씨 영역
 *
 * @param {{}} props
 * @returns {JSX.Element}
 */
function TodayWeatherSection(props) {
  const [isLoading, setLoading] = useState(true);
  const [weatherInfo, setWeatherInfo] = useState(
    /** @type {OBIData: service.OBIInfoItem[], updatedTime: Date} */ {
      OBIData: [],
      updatedTime: new Date(),
    },
  );

  const updateIsedolWeather = async () => {
    const { OBIData, updatedTimeStamp } = (await service.getOBI()).result;
    console.log(updatedTimeStamp);
    if (OBIData) {
      setWeatherInfo({
        OBIData,
        updatedTime: new Date(updatedTimeStamp),
      });
      setLoading(false);
    }
  };
  useEffect(() => {
    updateIsedolWeather();
  }, []);

  const dateStr = getRelativeDateString(weatherInfo.updatedTime);
  const timeHours = weatherInfo.updatedTime.getHours();
  const updatedDateString = isLoading ? '불러오는 중...' : `${dateStr} ${timeHours}시 기준`;

  return (
    <section className="TodayWeatherSection">
      <TodayWeatherList isLoading={isLoading} items={weatherInfo.OBIData} />
    </section>
  );
}

export default TodayWeatherSection;
