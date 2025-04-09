import React from 'react';
import clsx from 'clsx';
import { SectionHeader } from '../SectionHeader/SectionHeader';
import styles from './Section.module.scss';

export interface Props {
  className?: string;
  title: string;
  description?: string;
  more?: {
    label: string;
    link: string;
  };
  width?: 'packed' | 'spaceBetween';
  children: React.ReactNode;
}

/**
 * Frontpage에 들어가는 content panel
 */
export function Section({
  className,
  title,
  description,
  more,
  width = 'packed',
  children,
}: Props) {
  return (
    <section className={clsx('Section', styles.container, className)}>
      <SectionHeader title={title} description={description} more={more} size="big" width={width} />
      <div className={styles.contentWrapper}>{children}</div>
    </section>
  );
}
