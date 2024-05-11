import React from 'react';

import styles from './Spinner.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 
 * @param {{className?: string, caption?: string}} props 
 */
function Spinner({ className, caption = '' }) {

  return (
    <div className={cx('Spinner', className)}>
      <div className={styles.spinnerWrapper}>
        <img src="/images/spinner.svg" className={styles.spinnerAnim} alt="" />
        <div className={styles.caption}>{caption}</div>
      </div>
    </div>
  );

}

export default Spinner;