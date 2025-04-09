import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

import styles from './StreamTimer.module.scss';

export const StreamTimer = ({ startedTime = Date.now() }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const currTime = Date.now();
      const currSeconds = Math.floor((currTime - startedTime) / 1000);
      if (startedTime !== 0 && seconds != currSeconds) {
        setSeconds(currSeconds);
      }
    };
    const loopTimer = setInterval(updateTimer, 1000);

    return () => {
      clearInterval(loopTimer);
    };
  }, [startedTime]);

  return (
    <div className={clsx('StreamTimer', styles.container, { hide: startedTime == 0 })}>
      {formatTimeString(seconds)}
    </div>
  );
};

/**
 * period를 hh:mm:ss 형태로 변환합니다.
 */
const formatTimeString = (time: number): string => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor(time / 60) % 60;
  const seconds = Math.floor(time % 60);

  return `${hours}:${formatInt(minutes)}:${formatInt(seconds)}`;
};

/**
 * 정수를 두 자리 문자열로 변환합니다.
 */
const formatInt = (n: number): string => {
  return ('0' + Math.floor(n)).slice(-2);
};
