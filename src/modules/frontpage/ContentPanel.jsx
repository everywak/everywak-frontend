import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import SectionHeader from './SectionHeader';

import styles from './ContentPanel.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * Frontpage에 들어가는 content panel
 * 
 * @param {{title: string, description?: string, moreLabel?: string, moreLink?: string, width: 'packed'|'spaceBetween', children: JSX.Element | string}} props 
 * @returns {JSX.Element}
 */
function ContentPanel({ className, title, description, moreLabel, moreLink, width = 'packed', children }) {
  return (
    <section className={cx('ContentPanel', className)}>
      <SectionHeader title={title} description={description} moreLabel={moreLabel} moreLink={moreLink} size="big" width={width} />
      <div className="contentWrapper">
        {children}
      </div>
    </section>
  );
}

export default ContentPanel;