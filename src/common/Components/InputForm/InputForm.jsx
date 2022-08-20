import React, { useEffect } from 'react';

import * as func from '../../funtions';

import styles from './InputForm.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 
 * @param {{
 * className: String, 
 * children: JSX.Element,
 * name: String, 
 * description?: String, 
 * }} props 
 * @returns {JSX.Element}
 */
function InputForm({className, children, name = '', description}) {
  return (
    <div className={cx('InputForm', className)}>
      <div className="name">{name}</div>
      <div className="formWrapper">
        <div className="inputWrapper">{children}</div>
        {description && <div className="description">{description}</div>}
      </div>
    </div>
  );
}

export default InputForm;