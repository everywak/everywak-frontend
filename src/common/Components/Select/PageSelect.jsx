import React from 'react';

import BasicButton from '../Button/BasicButton';
import NavigateBeforeRoundedIcon from '@material-ui/icons/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@material-ui/icons/NavigateNextRounded';
import FirstPageRoundedIcon from '@material-ui/icons/FirstPageRounded';
import LastPageRoundedIcon from '@material-ui/icons/LastPageRounded';

//import * as func from '../../funtions';

import styles from './PageSelect.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * Pagination용 Option
 * 
 * @param {{
 * className: String, 
 * max: Number,
 * name: String,
 * value: Number,
 * align: 'default'|'center',
 * maxLength: Number, 
 * onChange: ({target: {name: String, value: Number}}) => void,
 * }} props 
 * @returns {JSX.Element}
 */
function PageSelect({className, max = 1, name, value = 1, align = 'default', maxLength = 10, onChange = e => {}}) {

  const pageOffset = align === 'default' ?
    parseInt((value - 1) / maxLength) * maxLength + 1 :
    Math.max(value - parseInt(maxLength / 2), 1);

  function goBeforePage() {
    onChange({
      target: {
        name: name, 
        value: Math.max(pageOffset - 1, 1),
      }
    });
  }
  function goNextPage() {
    onChange({
      target: {
        name: name, 
        value: Math.min(pageOffset + maxLength, max),
      }
    });
  }
  function goFirst() {
    onChange({
      target: {
        name: name, 
        value: 1,
      }
    });
  }
  function goLast() {
    onChange({
      target: {
        name: name, 
        value: max,
      }
    });
  }

  const optionList = Array(maxLength).fill(0)
    .map((_, i) => pageOffset + i)
    .filter(n => n > 0 && n <= max)
    .map(n => (
    <BasicButton className={cx('option', {selected: n === value})} onClick={e => onChange({
      target: {
        name: name, 
        value: n,
      }
      })}>
      {n}
    </BasicButton>
  ))

  return (
    <div className={cx('PageSelect', className)}>
      {
        pageOffset !== 1 && 
        <>
        <BasicButton className={cx('option')} onClick={goFirst}>
          <FirstPageRoundedIcon fontSize='default' />
        </BasicButton>
        <BasicButton className={cx('option')} onClick={goBeforePage}>
          <NavigateBeforeRoundedIcon fontSize='default' />
        </BasicButton>
        </>
      }
      {optionList}
      {
        pageOffset !== parseInt((max - 1) / maxLength) * maxLength + 1 && 
        <>
        <BasicButton className={cx('option')} onClick={goNextPage}>
          <NavigateNextRoundedIcon fontSize='default' />
        </BasicButton>
        <BasicButton className={cx('option')} onClick={goLast}>
          <LastPageRoundedIcon fontSize='default' />
        </BasicButton>
        </>
      }
    </div>
  );
}

export default PageSelect;