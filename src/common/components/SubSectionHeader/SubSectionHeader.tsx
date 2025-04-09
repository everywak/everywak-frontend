import React from 'react';
import clsx from 'clsx';
import styles from './SubSectionHeader.module.scss';

export const SubSectionHeader = ({
  className,
  title,
}: {
  className?: React.ReactNode;
  title: string;
}) => {
  return (
    <header className={clsx('SubSectionHeader', styles.container, className)}>
      <div className={styles.title}>{title}</div>
    </header>
  );
};
