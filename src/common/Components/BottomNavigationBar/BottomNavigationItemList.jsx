import React from 'react';

import './BottomNavigationItemList.scss';
import cx from 'classnames';

/**
 * 하단 네비게이션 바에 들어가는 아이템 리스트
 * 
 * @param {{className: String, itemLength: Number, children: JSX.Element|String}} props 
 */
function BottomNavigationItemList({className, children, itemLength}) {
  return (
    <ul className={cx('BottomNavigationItemList', className)} style={{'--itemLength': itemLength}}>
      {children}
    </ul>
  );
}

export default BottomNavigationItemList;