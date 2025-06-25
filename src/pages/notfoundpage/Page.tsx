import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import * as func from '@/common/functions';
import { Button } from '@/common/components';
import Spinner from '@/common/components/legacy/Spinner';

import styles from './Page.module.scss';

export const Page = () => {
  const location = useLocation();
  func.setBrowserTitle(`404 - ${location.pathname + location.search}`);
  const navigate = useNavigate();

  return (
    <div className={clsx('NotFoundPage', styles.container)}>
      <Spinner />
      <div className={styles.wrapper}>
        <span className={styles.c404}>404</span>
        <span className={styles.description}>준비 중이거나 존재하지 않는 페이지입니다.</span>
        <img className={styles.img404} src="/images/404.jpg" alt="404" />
        <div className={styles.btnArea}>
          <Button onClick={() => navigate(-1)} color="green" size="large">
            뒤로 가기
          </Button>
          <Button href="/" size="large">
            에브리왁굳 메인으로
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Page;
