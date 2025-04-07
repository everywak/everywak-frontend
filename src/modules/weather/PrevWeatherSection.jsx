import React, { useEffect, useState } from 'react';

import { MILLISECONDS_OF_DAY } from './weather.common';
import PrevWeatherList from './PrevWeatherList';

import * as service from '../../services/Isedol';

import './PrevWeatherSection.scss';
import cx from 'classnames';

/**
 * 최근 날씨 리스트 영역
 *
 * @param {{}} props
 * @returns {JSX.Element}
 */
function PrevWeatherSection({ length = 4 }) {
  const [weatherInfo, setWeatherInfo] = useState(
    /** @type {{date: string, data: []}[]} */
    Array(length).fill(null),
  );

  const updateIsedolWeather = async (i) => {
    const targetDate = new Date(Date.now() - i * MILLISECONDS_OF_DAY);
    const date = `${('0' + targetDate.getFullYear()).slice(-2)}${('0' + (targetDate.getMonth() + 1)).slice(-2)}${('0' + targetDate.getDate()).slice(-2)}`;

    const apiResponse = await service.getOBI(date);
    const { OBIData, updatedTimeStamp } = apiResponse.result;
    if (OBIData) {
      setWeatherInfo((prevList) => {
        prevList[i - 1] = {
          data: OBIData,
          date,
        };
        return [...prevList];
      });
    }
  };
  useEffect(() => {
    Array(length)
      .fill(0)
      .forEach((_, i) => updateIsedolWeather(i + 1));
  }, []);
  console.log(weatherInfo);

  const weatherList = weatherInfo.map((item, i) =>
    item
      ? [
          <PrevWeatherList
            key={`${i}_false`}
            isLoading={false}
            items={item.data}
            date={item.date}
          />,
          <div className="weatherBorder" />,
        ]
      : [
          <PrevWeatherList key={`${i}_true`} isLoading={true} items={null} />,
          <div className="weatherBorder" />,
        ],
  );

  return <section className="PrevWeatherSection">{weatherList.flat()}</section>;
}

export default PrevWeatherSection;
