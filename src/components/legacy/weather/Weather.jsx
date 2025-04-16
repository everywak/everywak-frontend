import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';

import * as func from 'common/functions';
import BasicImage from 'common/components/legacy/Image/BasicImage';
import { Header, Footer, SectionHeader } from 'common/components';

import TodayWeatherSection from './TodayWeatherSection';
import PrevWeatherSection from './PrevWeatherSection';

import './Weather.scss';
import cx from 'classnames';

/**
 * 날씨 페이지
 *
 * @param {{}} props
 * @returns {JSX.Element}
 */
function Weather(props) {
  func.setBrowserTitle('이세계 날씨');

  return (
    <div className="Weather">
      <Header />
      <main className="contentWrapper">
        <div className="headerWrapper">
          <Link to="/" className="back">
            <KeyboardArrowLeftRoundedIcon fontSize="small" /> 에브리왁굳 홈으로
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
      <Footer />
    </div>
  );
}

export default Weather;
