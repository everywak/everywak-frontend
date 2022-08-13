import React from 'react';

import BasicButton from './BasicButton';

import classNames from 'classnames/bind';
const cx = classNames;

/**
 * 투명 버튼
 * 
 * @param {{className?: string, onClick?: function, children?: JSX.Element|String}} props 
 */
function TransparentButton(props) {
  
  const {
    background, 
    className, 
    children, 
    ...rest
  } = props;

  return (
    <BasicButton className={cx("Transparent", className)} {...rest}>
      {children}
    </BasicButton>
  );
}

export default TransparentButton;