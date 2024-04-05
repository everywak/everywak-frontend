import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import BasicButton from '../../../common/Components/Button/BasicButton';
import Spinner from '../../../common/Components/Spinner';

import * as func from '../../../common/functions';

import styles from './WaktoonEpisodeViewer.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function WaktoonEpisodeViewer({location, history}) {

  const { articleId } = useParams();
  func.setBrowserTitle(`왁툰 작품 - ${articleId}`);
  
  useEffect(() => {
    setTimeout(() => func.redirectTo(`https://cafe.naver.com/steamindiegame/${articleId}`), 1000);
  }, []);

  return (
    <div className={cx('WaktoonEpisodeViewer')}>
      <header><h1 className="title">왁굳 코믹스</h1></header>
      <div className="sectionWrapper">
        <div className="msg">에피소드 페이지로 이동중입니다.</div>
        <div className="episodeNumber">에피소드 넘버 : {articleId}</div>
        <Spinner />
      </div>
    </div>
  );
}