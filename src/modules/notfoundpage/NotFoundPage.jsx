import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import * as func from '../../common/funtions';
import BasicButton from '../../common/Components/Button/BasicButton';
import LinkButton from '../../common/Components/Button/LinkButton';
import Spinner from '../../common/Components/Spinner';

import styles from './NotFoundPage.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function NotFoundPage() {

  const history = useHistory();

  const location = useLocation();
  func.setBrowserTitle(`404 - ${location.pathname + location.search}`);

  return (
    <div className={cx('NotFoundPage')}>
      <Spinner />
      <div className="wrapper">
        <span className="c404">404</span>
        <span className="description">준비 중이거나 존재하지 않는 페이지입니다.</span>
        <img className="img404" src="/images/404.jpg" alt="404"/>
        <div className="btnArea">
          <BasicButton onClick={e => history.goBack()} background="#3b3">뒤로 가기</BasicButton>
          <LinkButton to="/">에브리왁굳 메인으로</LinkButton>
        </div>
      </div>
    </div>
  );
}