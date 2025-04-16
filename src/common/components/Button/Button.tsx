import React from 'react';
import clsx from 'clsx';
import { CommonLink } from '../CommonLink/CommonLink';
import styles from './Button.module.scss';

export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'black'
  | 'gray'
  | 'white'
  | 'red'
  | 'green'
  | 'primary-transparent'
  | 'secondary-transparent'
  | 'black-transparent'
  | 'gray-transparent'
  | 'white-transparent'
  | 'red-transparent'
  | 'green-transparent';

export type Props = {
  className?: string;
  color?: ButtonColor;
  size?: ButtonSize;
  href?: string;
  target?: string;
  hideLabel?: boolean;
  disabled?: boolean;
  outlined?: boolean;
  onClick?: (e: React.MouseEvent) => any;
  children?: React.ReactNode;
  [key: string]: any;
};

export const Button = ({
  className = '',
  color = 'primary',
  size = 'medium',
  href,
  target,
  hideLabel = false,
  disabled = false,
  outlined = false,
  onClick = () => {},
  children,
  ...rest
}: Props): React.ReactNode => {
  const props = {
    className: clsx(
      'Button',
      styles.container,
      className,
      { [styles.hideLabel]: hideLabel, [styles.disabled]: disabled, [styles.outlined]: outlined },
      styles[size],
      styles[color],
    ),
    onClick: onClick,
    ...rest,
  };
  if (href) {
    // 링크
    return (
      <CommonLink href={href} target={target ?? '_self'} {...props}>
        {children}
      </CommonLink>
    );
  }
  return <button {...props}>{children}</button>;
};
