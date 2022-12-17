import React from 'react';
import { Link } from 'react-router-dom';

import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

import SectionHeader from './SectionHeader';

import styles from './AsidePanel.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * Frontpage에 들어가는 aside panel
 * 
 * @param {{title: string, description?: string, moreLabel?: string, moreLink?: string, children: JSX.Element | string}} props 
 * @returns {JSX.Element}
 */
function AsidePanel({ title, description, moreLabel, moreLink, children }) {
  return (<section className="AsidePanel">
    <SectionHeader title={title} description={description} moreLabel={moreLabel} moreLink={moreLink} />
    <div className="contentWrapper">
      {children}
    </div>
  </section>);
}

export default AsidePanel;