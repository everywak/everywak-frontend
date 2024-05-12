import React, { useEffect, useState } from 'react';

import useWindowEvent from '../../../hooks/useWindowEvent';

import './BottomNavigationBar.scss';
import cx from 'classnames';

var prevScrollY = -1;

/**
 * 하단 네비게이션 바
 * 
 * @param {{
 * className?: string, 
 * accentColor: String, 
 * children?: JSX.Element|String}} props 
 */
function BottomNavigationBar(props) {
  
  const {
    className, 
    accentColor, 
    children,
    ...rest
  } = props;

  const [isOpened, setOpened] = useState(true);

  const onScrollWindowHandler = () => {

    if (window.scrollY < 50) {
      setOpened(true);
    } else if (prevScrollY > 0) {
      if (prevScrollY < window.scrollY) { // scroll down
        setOpened(false);
      } else { // scroll up
        setOpened(true);
      }
    }
    prevScrollY = window.scrollY;
  };

  useWindowEvent('scroll', onScrollWindowHandler, []);

  return (
    <div className={cx("BottomNavigationBar", className, {isOpened})} style={{'--accentColor': accentColor}} {...rest}>
      {children}
    </div>
  );
}

export default BottomNavigationBar;