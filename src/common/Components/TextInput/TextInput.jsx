import React from 'react';

//import * as func from '../../funtions';

import styles from './TextInput.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 문자열 입력 바
 * 
 * @param {{
 * className?: String, 
 * name: String, 
 * value: String, 
 * placeholder?: String,
 * onChange: function,
 * }} props 
 */
 export default function TextInput({ className = '', name = '', value = '', placeholder = '', onChange = () => {} }) {

  return (
    <div className={cx('TextInput', className)}>
      <input type="text" name={name} value={value} 
        placeholder={placeholder} 
        onChange={onChange} />
    </div>
  );
}