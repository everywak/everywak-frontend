import React, { useEffect, useState } from 'react';

import { orderNickname } from './weather.common';
import TodayWeatherItem from './TodayWeatherItem';

import SkeletonLoader from '../../common/components/legacy/SkeletonLoader';
import * as service from '../../services/Isedol';

import './TodayWeatherList.scss';
import cx from 'classnames';

const skeleton = <TodayWeatherItem name="ㅇㅇㅇ" state="ㅇㅇㅇ" weather="sunny" isSkeleton />;

/**
 * 날씨 페이지 오늘 날씨 리스트
 *
 * @param {{items: [], isLoading: boolean}} props
 * @returns {JSX.Element}
 */
function TodayWeatherList({ items, isLoading }) {
  const list =
    items &&
    items
      .sort((a, b) => orderNickname[a.nickname] - orderNickname[b.nickname])
      .map((item) => (
        <TodayWeatherItem
          key={item.nickname}
          name={item.nickname}
          state={item.rawInfo}
          weather={item.weather}
          description={item.description}
        />
      ));

  return (
    <ul className="TodayWeatherList">
      {isLoading ? <SkeletonLoader skeleton={skeleton} length={6} /> : list}
    </ul>
  );
}

export default TodayWeatherList;
