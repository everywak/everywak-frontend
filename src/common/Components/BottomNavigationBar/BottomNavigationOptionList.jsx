import React from 'react';

import BottomNavigationItemList from './BottomNavigationItemList';

import './BottomNavigationOptionList.scss';
import cx from 'classnames';

/**
 * 하단 네비게이션 바에 들어가는 옵션 리스트
 *
 * @param {{
 * name: string,
 * value: boolean,
 * onChange?: ({target: {name: string, value: boolean}}) => void,
 * items: {icon: JSX.Element, label?: String, value: String}[]}} props
 */
function BottomNavigationOptionList(props) {
  const { name, value, onChange, items } = props;

  const list = items.map((item) => (
    <li
      className={cx('navigationItem', { selected: value === item.value })}
      key={item.value}
      onClick={(e) => onChange({ target: { name, value: item.value } })}
    >
      <div className="icon">{item.icon}</div>
      <div className="label">{item.label}</div>
    </li>
  ));

  return (
    <BottomNavigationItemList className="BottomNavigationOptionList" itemLength={items.length}>
      {list}
    </BottomNavigationItemList>
  );
}

export default BottomNavigationOptionList;
