import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import AppListItemIcon from './AppListItemIcon';

import styles from './AppListItem.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function AppListItem ({
  title = '제목',
  description = '어쩌구저쩌구 설명',
  icon = null,
  iconPadding = '0px',
  themeColor = '#d3d3d3',
  href = '',
  size = 'normal', // normal || small || tiny
}) {

  const content = <>
    <div className={styles.thumbWrapper}>
      <AppListItemIcon src={icon} alt={title} iconPadding={iconPadding} themeColor={themeColor} />
    </div>
    <div className={styles.descWrapper}>
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>{description}</div>
    </div>
  </>;

  return (
    href.slice(0, 4) == 'http' ? 
    <a href={href} className={cx('AppListItem', size)}>{content}</a> :
    <Link to={href} className={cx('AppListItem', size)}>{content}</Link> 
  );
}
  
export default AppListItem;