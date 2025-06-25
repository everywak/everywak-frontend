import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import SkeletonLoader from '@/common/components/legacy/SkeletonLoader';
import { Desktop, NotDesktop } from '@/common/MediaQuery';

import { OBI } from '@/services/everywak/v2/types/obi';
import { WeatherItem } from './WeatherItem';

import styles from './WeatherList.module.scss';

const skeleton = (
  <WeatherItem className={styles.item} name="ㅇㅇㅇ" state="ㅇㅇㅇ" weather="sunny" isSkeleton />
);

/**
 * Frontpage에 표시되는 날씨 아이템 리스트
 */
export const WeatherList = ({ items, isLoading }: { items: OBI[]; isLoading: boolean }) => {
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

  const list = items?.map((item) => (
    <WeatherItem
      key={item.member.name}
      className={styles.item}
      name={item.member.name}
      state={item.rawInfo}
      weather={item.weather}
    />
  ));

  return (
    <div className={styles.container}>
      <ul className={styles.itemList}>
        <Desktop>{isLoading ? <SkeletonLoader skeleton={skeleton} length={6} /> : list}</Desktop>
        <NotDesktop>
          <button className={styles.arrowButton} onClick={prevPage}>
            <div className={styles.line}></div>
            <div className={styles.lineBottom}></div>
          </button>
          {list.slice(page * 2, page * 2 + 2)}
          <button className={clsx(styles.arrowButton, styles.right)} onClick={nextPage}>
            <div className={styles.line}></div>
            <div className={styles.lineBottom}></div>
          </button>
        </NotDesktop>
      </ul>
      <div className={styles.present}>이세돌 뱅온정보 팀 제공</div>
    </div>
  );
};
