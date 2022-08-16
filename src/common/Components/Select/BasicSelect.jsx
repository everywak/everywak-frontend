import React, { useEffect } from 'react';

import BasicButton from '../Button/BasicButton';

//import * as func from '../../funtions';

import styles from './BasicSelect.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 탭 레이아웃의 Option
 * 
 * @param {{
 * className: String, 
 * options: {name: String, value: String}[],
 * name: String,
 * value: String,
 * onChange: ({target: {name: String, value: String}}) => void,
 * }} props 
 * @returns {JSX.Element}
 */
function BasicSelect({className, options, name, value, onChange = e => {}}) {

  const optionList = options.map(opt => (
    <BasicButton className={cx('option', {selected: opt.value === value})} onClick={e => onChange({
      target: {
        name: name,
        value: opt.value,
      }
      })}>
      {opt.name}
    </BasicButton>
  ))

  return (
    <div className={cx('BasicSelect', className)}>
      {optionList}
    </div>
  );
}

export default BasicSelect;