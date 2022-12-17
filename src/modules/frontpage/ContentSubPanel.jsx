import React, { Component } from 'react';

import SectionSubHeader from './SectionSubHeader';

import styles from './ContentSubPanel.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * ContentPanel 안에 들어가는 content sub panel
 * 
 * @param {{title: string, description?: string, moreLabel?: string, moreLink?: string, width: 'packed'|'spaceBetween', children: JSX.Element | string}} props 
 * @returns {JSX.Element}
 */
function ContentSubPanel({ className, title, description, moreLabel, moreLink, width = 'packed', children }) {
  return (
    <section className={cx('ContentSubPanel', className)}>
      <SectionSubHeader title={title} description={description} moreLabel={moreLabel} moreLink={moreLink} size="big" width={width} />
      <div className="contentWrapper">
        {children}
      </div>
    </section>
  );
}

export default ContentSubPanel;