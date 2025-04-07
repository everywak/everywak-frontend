import React from 'react';

import Spinner from '../Components/Spinner';

import styles from './SuspenseFallback.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function SuspenseFallback() {
  return (
    <div className={cx('SuspenseFallback')}>
      <div className={styles.sectionWrapper}>
        <Spinner />
      </div>
    </div>
  );
}
