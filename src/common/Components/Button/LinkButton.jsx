import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Buttons.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 링크 버튼
 * 
 * @param {{
 * to?: string, 
 * href?: string,
 * target?: string,
 * background?: string, 
 * className?: string, 
 * onClick?: function, 
 * children?: JSX.Element|String}} props 
 */
function LinkButton(props) {

  const {
    to, 
    href,
    target,
    className, 
    onClick, 
    background, 
    children, 
    ...rest
  } = props;

  return (
    href ?
    <a href={href} target={target || '_blank'} className={cx("BasicButton", "Link", className)} onClick={onClick} style={{background: background}} {...rest}>
      {children}
    </a> :
    <Link to={to} className={cx("BasicButton", "Link", className)} onClick={onClick} style={{background: background}} {...rest}>
      {children}
    </Link>
  );
}

export default LinkButton;