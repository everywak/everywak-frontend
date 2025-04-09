import React from 'react';
import clsx from 'clsx';

import styles from './SubSection.module.scss';
import { SubSectionHeader } from '../SubSectionHeader/SubSectionHeader';

export interface Props {
  children: React.ReactNode;
  className?: string;
  title: string;
}

export const SubSection = ({ className, title, children }: Props) => {
  return (
    <section className={clsx('SubSection', styles.container, className)}>
      <SubSectionHeader className={styles.title} title={title} />
      <div className={styles.content}>{children}</div>
    </section>
  );
};
