import React from 'react';
import clsx from 'clsx';
import { EverywakLogo } from '../EverywakLogo/EverywakLogo';
import styles from './Header.module.scss';

export interface Props {
  className?: string;
}

export const Header = (props: Props) => {
  return (
    <header className={clsx('Header', styles.container, props.className)}>
      <div className={styles.left}></div>
      <EverywakLogo className={styles.logo} type="text" />
      <div className={styles.right}></div>
    </header>
  );
};
