import React from 'react';
import { Link } from 'react-router-dom';

import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

import './SectionSubHeader.scss';
import cx from 'classnames';

/**
 * 섹션 내 서브 섹션의 헤더
 * 
 * @param {{title: string}} props 
 * @returns {JSX.Element}
 */
function SectionSubHeader({ title }) {

  return (
    <header className={cx('SectionSubHeader')}>
      <div className="title">{title}</div>
    </header>
  );
}

export default SectionSubHeader;