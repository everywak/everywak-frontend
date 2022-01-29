import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './AppListItem.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class AppListItem extends Component {
  static defaultProps = {
    title: '제목',
    description: '어쩌구저쩌구 설명',
    thumbnail: null,
    href: '',
  }

  render() {
    const { title, description, thumbnail, href } = this.props;


    return (
      <Link to={href} className="AppListItem">
        <div className="thumbWrapper">
          <img className="thumb" src={thumbnail} alt={title} onError={e => (e.target.style.display = 'none')} />
        </div>
        <div className="descWrapper">
          <div className="title">{title}</div>
          <div className="description">{description}</div>
        </div>
      </Link> 
    );
  }
}
  
export default AppListItem;