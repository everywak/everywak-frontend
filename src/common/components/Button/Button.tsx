import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { isExternalUrl } from 'common/functions';

import styles from './Button.module.scss';

export type ButtonProps = {
  className?: string;
  color?:
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
  size?: 'small' | 'medium' | 'large';
  href?: string;
  target?: string;
  hideLabel?: boolean;
  disabled?: boolean;
  outlined?: boolean;
  onClick?: (e: React.MouseEvent) => any;
  children?: React.ReactNode;
  [key: string]: any;
};

export function Button({
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
}: ButtonProps): React.ReactElement {
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
    if (isExternalUrl(href)) {
      // 외부 링크
      return (
        <a {...props} href={href} target={target ?? '_blank'} rel="noopener noreferrer">
          {children}
        </a>
      );
    } else {
      // 내부 링크
      return (
        <Link {...props} to={href} target={target ?? '_self'}>
          {children}
        </Link>
      );
    }
  }
  return <button {...props}>{children}</button>;
}
