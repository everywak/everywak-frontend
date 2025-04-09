import React from 'react';

import BasicButton from './BasicButton';

import cx from 'classnames';

/**
 * 투명 버튼
 *
 * @param {{className?: string, onClick?: function, children?: import('react').ReactNode}} props
 */
function TransparentButton(props) {
  const { background, className, children, ...rest } = props;

  return (
    <BasicButton className={cx('Transparent', className)} {...rest}>
      {children}
    </BasicButton>
  );
}

export default TransparentButton;
