import React from 'react';

import styles from './Spinner.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 
 * @param {{className?: string, caption?: string}} props 
 */
function Spinner({ className, caption = '' }) {

  return (
    <div className={cx('Spinner', className)}>
      <div className="spinnerWrapper">
        <img src="/images/spinner.svg" className="spinnerAnim" alt="" />
        <div className="caption">{caption}</div>
      </div>
    </div>
  );

}

export default Spinner;