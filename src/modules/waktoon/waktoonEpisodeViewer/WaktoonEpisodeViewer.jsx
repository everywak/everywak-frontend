import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Spinner from '../../../common/Components/Spinner';

import * as func from '../../../common/functions';

import './WaktoonEpisodeViewer.scss';
import cx from 'classnames';

export default function WaktoonEpisodeViewer() {

  const { articleId } = useParams();
  func.setBrowserTitle(`왁툰 작품 - ${articleId}`);
  
  const navigate = useNavigate()
  useEffect(() => {
    setTimeout(navigate, 1000, `https://cafe.naver.com/steamindiegame/${articleId}`);
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