import React, { useEffect, useState } from 'react';

import SkeletonLoader from '../../common/Components/SkeletonLoader';
import { Desktop, NotDesktop } from '../../common/MediaQuery';

import { orderNickname } from './weather.common';
import FrontWeatherItem from './FrontWeatherItem';

import './FrontWeatherList.scss';
import cx from 'classnames';

const skeleton = <FrontWeatherItem name="ㅇㅇㅇ" state="ㅇㅇㅇ" weather="sunny" isSkeleton />;

/**
 * Frontpage에 표시되는 날씨 아이템 리스트
 *
 * @param {{items: [], isLoading: boolean}} props
 * @returns {JSX.Element}
 */
function FrontWeatherList({ items, isLoading }) {
  const [page, setPage] = useState(0);
  const prevPage = () => {
    setPage((page) => (--page + 3) % 3);
  };
  const nextPage = () => {
    setPage((page) => ++page % 3);
  };
  useEffect(() => {
    const loopSlidePage = setTimeout(nextPage, 5000);

    return () => {
      clearTimeout(loopSlidePage);
    };
  }, [page]);

  const list =
    items &&
    items
      .sort((a, b) => orderNickname[a.nickname] - orderNickname[b.nickname])
      .map((item) => (
        <FrontWeatherItem name={item.nickname} state={item.rawInfo} weather={item.weather} />
      ));

  return (
    <div className="FrontWeatherList">
      <ul className="itemList">
        <Desktop>{isLoading ? <SkeletonLoader skeleton={skeleton} length={6} /> : list}</Desktop>
        <NotDesktop>
          <button className="arrowButton" onClick={prevPage}>
            <div className="line"></div>
            <div className="lineBottom"></div>
          </button>
          {list.slice(page * 2, page * 2 + 2)}
          <button className="arrowButton right" onClick={nextPage}>
            <div className="line"></div>
            <div className="lineBottom"></div>
          </button>
        </NotDesktop>
      </ul>
      <div className="present">이세돌 뱅온정보 팀 제공</div>
    </div>
  );
}

export default FrontWeatherList;
