import React, { useState, useEffect } from 'react';

import './StreamTimer.scss';
import cx from 'classnames';

export default function StreamTimer({startedTime = Date.now()}) {
  
  const [seconds, setSeconds] = useState(0);

  function updateTimer() {
    const currTime = Date.now();
    const currSeconds = parseInt((currTime - startedTime) / 1000);
    if (startedTime !== 0 && seconds != currSeconds) {
      setSeconds(currSeconds);
    }
  }

  useEffect(() => {
    const loopTimer = setInterval(updateTimer, 1000);

    return () => {
      clearInterval(loopTimer);
    }
  }, [startedTime]);

  return (
    <div className={cx('StreamTimer', {hide: startedTime == 0})}>
      {formatTimeString(seconds)}
    </div>
  );
}

/**
 * period를 hh:mm:ss 형태로 변환합니다.
 * 
 * @param {number} time 
 * @returns {string} hh:mm:ss
 */
function formatTimeString(time) {
  const hours = parseInt(time / 3600);
  const minutes = parseInt(time / 60) % 60;
  const seconds = parseInt(time % 60);

  return `${hours}:${formatInt(minutes)}:${formatInt(seconds)}`;
}

/**
 * 정수를 두자리 문자열로 변환합니다.
 * 
 * @param {number} n 
 * @return {string}
 */
function formatInt(n) {
  return ('0' + parseInt(n)).slice(-2);
}