import React from 'react';
import { Link } from 'react-router-dom';

import BottomNavigationItemList from './BottomNavigationItemList';

import styles from './BottomNavigationLinkList.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 하단 네비게이션 바에 들어가는 링크 리스트
 * 
 * @param {{
 * name: string, 
 * value: boolean, 
 * onChange?: ({target: {name: string, value: boolean}}) => void, 
 * items: {icon: JSX.Element, label?: String, value: String}[]}} props 
 */
function BottomNavigationLinkList(props) {
  
  const {
    items,
  } = props;

  const list = items.map(item => <Link className={cx('navigationItem')} to={item.href} key={item.key}>
    <div className="icon">{item.icon}</div>
    <div className="label">{item.label}</div>
  </Link>);

  return (
    <BottomNavigationItemList className="BottomNavigationLinkList" itemLength={items.length}>
      {list}
    </BottomNavigationItemList>
  );
}

export default BottomNavigationLinkList;