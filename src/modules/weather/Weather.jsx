import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';

import Header from '../../common/Header/Header';
import Footer from '../../common/Footer/Footer';
import BasicImage from '../../common/Components/Image/BasicImage';

import SectionHeader from '../frontpage/SectionHeader';

import TodayWeatherSection from './TodayWeatherSection';
import PrevWeatherSection from './PrevWeatherSection';

import styles from './Weather.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 날씨 페이지
 * 
 * @param {{}} props 
 * @returns {JSX.Element}
 */
function Weather(props) {
  func.setBrowserTitle('이세계 일기예보');

  return (
    <div className="Weather">
      <Header />
      <main className="contentWrapper">
        <div className="headerWrapper">
          <Link to="/" className="back">
            <KeyboardArrowLeftRoundedIcon fontSize="small"/> 에브리왁굳 홈으로
          </Link>
          <h1 className="title">오늘 이세계 날씨는?</h1>
        </div>
        <div className="weatherSection">
          <TodayWeatherSection />
          <PrevWeatherSection />
          <SectionHeader title="제공" size="max" />
          <BasicImage className="credit" src="/images/weather/credit/credit.png" />
        </div>
      </main>
    </div>
  );
}

export default Weather;