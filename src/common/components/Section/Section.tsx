import React from 'react';
import clsx from 'clsx';
import { SectionHeader } from '../SectionHeader/SectionHeader';
import styles from './Section.module.scss';

export interface Props {
  className?: string;
  title: string;
  description?: string;
  moreLabel?: string;
  moreLink?: string;
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
  moreLabel,
  moreLink,
  width = 'packed',
  children,
}: Props) {
  return (
    <section className={clsx('ContentPanel', styles.container, className)}>
      <SectionHeader
        title={title}
        description={description}
        moreLabel={moreLabel}
        moreLink={moreLink}
        size="big"
        width={width}
      />
      <div className={styles.contentWrapper}>{children}</div>
    </section>
  );
}
