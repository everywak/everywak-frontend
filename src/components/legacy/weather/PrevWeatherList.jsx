import React, { useEffect, useState } from 'react';

import { orderNickname } from './weather.common';

import PrevWeatherItem from './PrevWeatherItem';

import SkeletonLoader from 'common/components/legacy/SkeletonLoader';
import * as service from 'services/Isedol';

import './PrevWeatherList.scss';
import cx from 'classnames';

const skeleton = <PrevWeatherItem weather="sunny" isSkeleton />;

/**
 * 최근 날씨 아이템 리스트
 *
 * @param {{date: string, items: [], isLoading: boolean}} props
 * @returns {JSX.Element}
 */
function PrevWeatherList({ date = '000000', items, isLoading }) {
  const list =
    items &&
    items
      .sort((a, b) => orderNickname[a.nickname] - orderNickname[b.nickname])
      .map((item) => (
        <PrevWeatherItem
          key={item.nickname}
          name={item.nickname}
          state={item.rawInfo}
          weather={item.weather}
        />
      ));

  const dateTarget = new Date(
    '20' + date.slice(0, 2),
    parseInt(date.slice(2, 4)) - 1,
    date.slice(4, 6),
  );
  const dateString = `${dateTarget.getMonth() + 1}/${dateTarget.getDate()}(${'일월화수목금토'[dateTarget.getDay()]})`;

  return (
    <ul className="PrevWeatherList">
      {isLoading ? (
        <>
          <SkeletonLoader
            skeleton={
              <div className="date skeleton">
                <div className="skeletonItem">00/00(ㅇ)</div>
              </div>
            }
            length={1}
          />
          <SkeletonLoader skeleton={skeleton} length={6} />
          <SkeletonLoader skeleton={<div className="date dummy">{dateString}</div>} length={1} />
        </>
      ) : (
        <>
          <div className="date">{dateString}</div>
          {list}
          <div className="date dummy">{dateString}</div>
        </>
      )}
    </ul>
  );
}

export default PrevWeatherList;
