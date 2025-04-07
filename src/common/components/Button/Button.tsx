import React from 'react';

import styles from './Button.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export type ButtonProps = {
  className?: string;
  color?:
    | 'primary'
    | 'secondary'
    | 'black'
    | 'gray'
    | 'white'
    | 'red'
    | 'primary-transparent'
    | 'secondary-transparent'
    | 'black-transparent'
    | 'gray-transparent'
    | 'white-transparent'
    | 'red-transparent';
  size?: 'small' | 'medium' | 'large';
  hideLabel?: boolean;
  disabled?: boolean;
  outlined?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => any;
  children?: React.ReactNode;
  [key: string]: any;
};

export function Button({
  className = '',
  color = 'primary',
  size = 'medium',
  hideLabel = false,
  disabled = false,
  outlined = false,
  onClick = (e: React.MouseEvent<HTMLButtonElement>) => {},
  children,
  ...rest
}: ButtonProps): React.ReactElement {
  return (
    <button
      className={cx(className, 'Button', { hideLabel, disabled, outlined }, size, color)}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
