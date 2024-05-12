import React from 'react';

import BasicButton from './BasicButton';

import cx from 'classnames';

/**
 * 토글 버튼
 * 
 * @param {{name: string, value: boolean, disabled: boolean, onChange?: ({target: {name: string, value: boolean}}) => void, className?: string, onClick?: function, children?: JSX.Element|String}} props 
 */
function ToggleButton(props) {
  const {
    name, 
    value, 
    onChange,
    onClick, 
    className, 
    children, 
    ...rest
  } = props;

  return (
    <BasicButton className={cx('ToggleButton', className, {on: value})} onClick={e => {onChange({target: {name, value: !value}}); onClick && onClick(e) }} {...rest}>
      {children}
    </BasicButton>
  );
}

export default ToggleButton;