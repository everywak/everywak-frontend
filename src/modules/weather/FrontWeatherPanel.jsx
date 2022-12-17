import React, { useEffect, useState } from 'react';

import { MILLISECONDS_OF_DAY } from './weather.common';
import FrontWeatherList from './FrontWeatherList';

import AsidePanel from '../frontpage/AsidePanel';

import * as service from '../../services/Isedol';

import styles from './FrontWeatherPanel.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 현재 시각을 기준으로 date의 상대시간을 출력합니다.
 * @param {Date} date 
 * @returns {string}
 */
const getRelativeDateString = date => {
  const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime();
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dateCount = (today - target) / MILLISECONDS_OF_DAY;
  if (dateCount === 0) {
    return '오늘';
  } else if (dateCount === 1) {
    return '어제';
  } else  {
    return `${dateCount}일 전`;
  }
}

/**
 * Frontpage에 표시되는 날씨 리스트 AsidePanel
 * 
 * @param {{}} props 
 * @returns {JSX.Element}
 */
function FrontWeatherPanel(props) {
  const [isLoading, setLoading] = useState(true);
  const [weatherInfo, setWeatherInfo] = useState(/** @type {OBIData: [], updatedTime: Date} */{
    OBIData: [], 
    updatedTime: new Date(), 
  });

  const updateIsedolWeather = async () => {

    const { OBIData, updatedTimeStamp } = (await service.getOBI()).result;
    console.log(updatedTimeStamp)
    if (OBIData) {
      setWeatherInfo({
        OBIData, 
        updatedTime: new Date(updatedTimeStamp), 
      });
      setLoading(false);
    }
  };
  useEffect(() => { updateIsedolWeather(); }, []);

  const dateStr = getRelativeDateString(weatherInfo.updatedTime);
  const timeHours = weatherInfo.updatedTime.getHours();
  const updatedDateString = isLoading ? '불러오는 중...' : `${dateStr} ${timeHours}시 기준`;

  return (
    <AsidePanel title="이세계 일기예보" description={updatedDateString} moreLink="/weather">
      <FrontWeatherList isLoading={isLoading} items={weatherInfo.OBIData} />
    </AsidePanel>
  );
}

export default FrontWeatherPanel;