import React from 'react';
import clsx from 'clsx';

import styles from './Tooltip.module.scss';

export interface Props {
  className?: string;
  children: React.ReactNode;
  direction?: 'top' | 'bottom' | 'left' | 'right';
}
export const Tooltip = React.memo((props: Props) => {
  return (
    <div
      className={clsx(
        styles.container,
        props.className,
        styles[props.direction ?? 'bottom'],
      )}
    >
      {props.children}
    </div>
  );
});
