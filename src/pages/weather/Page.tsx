import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { KeyboardArrowLeftRounded } from '@mui/icons-material';
import * as func from 'common/functions';
import { Header, Footer, SectionHeader, BasicImage } from 'common/components';
import { PrevWeatherSection, TodayWeatherSection } from 'components/weather';
import styles from './Page.module.scss';

export const Weather = () => {
  func.setBrowserTitle('이세계 날씨');

  return (
    <>
      <Header />
      <main className={clsx('Weather', styles.container)}>
        <div className={styles.headerWrapper}>
          <Link to="/" className={styles.back}>
            <KeyboardArrowLeftRounded fontSize="small" /> 에브리왁굳 홈으로
          </Link>
          <h1 className={styles.title}>오늘 이세계 날씨는?</h1>
        </div>
        <div className={styles.weatherSection}>
          <TodayWeatherSection />
          <PrevWeatherSection />
          <SectionHeader title="제공" size="max" />
          <BasicImage
            className={styles.credit}
            src="/images/weather/credit/credit.png"
            alt="이세계 뱅온정보 팀 제공"
          />
        </div>
      </main>
      <Footer />
    </>
  );
};
export default Weather;
