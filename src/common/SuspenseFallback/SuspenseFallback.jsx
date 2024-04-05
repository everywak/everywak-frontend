import React, { useState, useEffect } from 'react';

import Spinner from '../Components/Spinner';

import styles from './SuspenseFallback.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function SuspenseFallback() {

  return (
    <div className={cx('SuspenseFallback')}>
      <div className="sectionWrapper">
        <Spinner />
      </div>
    </div>
  );
}