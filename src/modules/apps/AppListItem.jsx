import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import AppListItemIcon from './AppListItemIcon';

import styles from './AppListItem.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class AppListItem extends Component {
  static defaultProps = {
    title: '제목',
    description: '어쩌구저쩌구 설명',
    icon: null,
    iconPadding: '0px',
    themeColor: '#d3d3d3',
    href: '',
  }

  render() {
    const { title, description, icon, iconPadding, themeColor, href } = this.props;

    const content = <React.Fragment>
      <div className="thumbWrapper">
        <AppListItemIcon src={icon} alt={title} iconPadding={iconPadding} themeColor={themeColor} />
      </div>
      <div className="descWrapper">
        <div className="title">{title}</div>
        <div className="description">{description}</div>
      </div>
    </React.Fragment>;

    return (
      href.slice(0, 4) == 'http' ? 
      <a href={href} className="AppListItem">{content}</a> :
      <Link to={href} className="AppListItem">{content}</Link> 
    );
  }
}
  
export default AppListItem;