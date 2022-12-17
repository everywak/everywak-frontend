import React from 'react';
import { Link } from 'react-router-dom';

import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

import styles from './SectionHeader.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 더 보기 링크가 있는 섹션 헤더
 * 
 * @param {{title: string, description: string, moreLabel: string, moreLink: string, width: 'packed'|'spaceBetween', size: 'big'|'medium'|'small'|'max'}} props 
 * @returns {JSX.Element}
 */
function SectionHeader({ title, description, moreLabel = '더 보기', moreLink, width = 'packed', size = 'medium' }) {

  return (
    <header className={cx('SectionHeader', {spaceBetween: width === 'spaceBetween'}, {big: size === 'big', medium: size === 'medium', small: size === 'small', max: size === 'max'})}>
      <div className="titleArea">
        <div className={cx('title')}>{title}</div>
        {description && <div className="subtitle">{description}</div>}
        {size === 'max' && <div className="bottomLine">&nbsp;</div>}
      </div>
      {
        moreLink &&
        <Link to={moreLink} className="more">
          {moreLabel} <KeyboardArrowRightRoundedIcon fontSize="small"/>
        </Link>
      }
    </header>
  );
}

export default SectionHeader;