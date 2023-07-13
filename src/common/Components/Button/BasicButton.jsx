import React from 'react';

import styles from './Buttons.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 기본 버튼
 * 
 * @param {{background?: string, className?: string, description?: string, onClick?: function, disabled: boolean, children?: JSX.Element|String}} props 
 */
function BasicButton(props) {
  
  const {
    background,
    className, 
    description, 
    onClick, 
    children, 
    disabled,
    ...rest
  } = props;

  return (
    <button className={cx("BasicButton", className, {hasRibbon: description, disabled})} onClick={onClick} {...rest} style={{background: background}} disabled={disabled}>
      {children}
      {description &&
        <div className="description">{description}</div>
      }
    </button>
  );
}

export default BasicButton;