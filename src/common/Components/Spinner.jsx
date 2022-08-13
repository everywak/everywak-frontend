import React from 'react';

import styles from './Spinner.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 
 * @param {{caption?: String}} props 
 */
function Spinner({caption = ''}) {

  return (
    <div className="Spinner">
      <div className="spinnerWrapper">
        <img src="/images/spinner.svg" className="spinnerAnim" alt="" />
        <div className="caption">{caption}</div>
      </div>
    </div>
  );

}

export default Spinner;