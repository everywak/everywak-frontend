import React from 'react';
import { useLocation } from 'react-router-dom';

import * as func from '../../common/functions';
import BasicButton from '../../common/components/legacy/Button/BasicButton';
import LinkButton from '../../common/components/legacy/Button/LinkButton';
import Spinner from '../../common/components/legacy/Spinner';

import styles from './NotFoundPage.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function NotFoundPage() {
  const location = useLocation();
  func.setBrowserTitle(`404 - ${location.pathname + location.search}`);

  return (
    <div className={cx('NotFoundPage')}>
      <Spinner />
      <div className={styles.wrapper}>
        <span className={styles.c404}>404</span>
        <span className={styles.description}>준비 중이거나 존재하지 않는 페이지입니다.</span>
        <img className={styles.img404} src="/images/404.jpg" alt="404" />
        <div className={styles.btnArea}>
          <BasicButton onClick={(e) => window.history.goBack()} background="#3b3">
            뒤로 가기
          </BasicButton>
          <LinkButton to="/">에브리왁굳 메인으로</LinkButton>
        </div>
      </div>
    </div>
  );
}
