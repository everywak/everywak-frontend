import React from 'react';

import styles from './Buttons.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 기본 버튼
 * 
 * @param {{background?: string, className?: string, onClick?: function, children?: JSX.Element|String}} props 
 */
function BasicButton(props) {
  
  const {
    background,
    className, 
    onClick, 
    children, 
    ...rest
  } = props;

  return (
    <button className={cx("BasicButton", className)} onClick={onClick} {...rest} style={{background: background}}>
      {children}
    </button>
  );
}

export default BasicButton;