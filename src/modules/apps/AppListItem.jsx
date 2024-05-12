import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import AppListItemIcon from './AppListItemIcon';

import './AppListItem.scss';
import cx from 'classnames/bind';

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
    <div className="thumbWrapper">
      <AppListItemIcon src={icon} alt={title} iconPadding={iconPadding} themeColor={themeColor} />
    </div>
    <div className="descWrapper">
      <div className="title">{title}</div>
      <div className="description">{description}</div>
    </div>
  </>;

  return (
    href.slice(0, 4) == 'http' ? 
    <a href={href} className={cx('AppListItem', size)}>{content}</a> :
    <Link to={href} className={cx('AppListItem', size)}>{content}</Link> 
  );
}
  
export default AppListItem;