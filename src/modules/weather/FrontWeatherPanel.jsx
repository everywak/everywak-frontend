import React, { useEffect, useState } from 'react';

import * as service from '../../services/Isedol';
import { Desktop, NotDesktop } from '../../common/MediaQuery';

import AsidePanel from '../frontpage/AsidePanel';
import SectionHeader from '../frontpage/SectionHeader';

import { MILLISECONDS_OF_DAY } from './weather.common';
import FrontWeatherList from './FrontWeatherList';

import './FrontWeatherPanel.scss';
import cx from 'classnames';

/**
 * 현재 시각을 기준으로 date의 상대시간을 출력합니다.
 * @param {Date} date
 * @returns {string}
 */
const getRelativeDateString = (date) => {
  const today = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  ).getTime();
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dateCount = (today - target) / MILLISECONDS_OF_DAY;
  if (dateCount === 0) {
    return '오늘';
  } else if (dateCount === 1) {
    return '어제';
  } else {
    return `${dateCount}일 전`;
  }
};

/**
 * 시간대 문자열을 출력합니다.
 *
 * @param {number} hours
 * @returns {string}
 */
const getHourString = (hours) => {
  if (hours == 0 || hours >= 22) {
    // 22~0
    return '밤';
  } else if (hours <= 5) {
    // 1~5
    return '새벽';
  } else if (hours <= 9) {
    // 6~9
    return '아침';
  } else if (hours <= 11) {
    // 10~11
    return '오전';
  } else if (hours == 12) {
    // 12
    return '낮';
  } else if (hours <= 17) {
    // 13~17
    return '오후';
  } else {
    // 18~21
    return '저녁';
  }
};

/**
 * Frontpage에 표시되는 날씨 리스트 AsidePanel
 *
 * @param {{}} props
 * @returns {JSX.Element}
 */
function FrontWeatherPanel(props) {
  const [isLoading, setLoading] = useState(true);
  const [weatherInfo, setWeatherInfo] = useState(
    /** @type {OBIData: [], updatedTime: Date} */ {
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
  const hourString = getHourString(timeHours);
  const updatedDateString = isLoading
    ? '불러오는 중...'
    : `${dateStr} ${hourString} ${timeHours > 12 ? timeHours % 12 : timeHours}시 기준`;

  return (
    <>
      <Desktop>
        <AsidePanel title="이세계 날씨" description={updatedDateString} moreLink="/weather">
          <FrontWeatherList isLoading={isLoading} items={weatherInfo.OBIData} />
        </AsidePanel>
      </Desktop>
      <NotDesktop>
        <div className="FrontWeatherMobilePanel">
          <FrontWeatherList isLoading={isLoading} items={weatherInfo.OBIData} />
          <div className="headerWrapper">
            <SectionHeader
              description={updatedDateString}
              moreLabel="더 보기"
              moreLink="/weather"
            />
          </div>
        </div>
      </NotDesktop>
    </>
  );
}

export default FrontWeatherPanel;
