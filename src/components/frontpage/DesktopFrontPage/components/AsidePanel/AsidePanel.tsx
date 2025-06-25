import React from 'react';
import clsx from 'clsx';
import { SectionHeader } from '@/common/components';

import styles from './AsidePanel.module.scss';

export interface Props {
  className?: string;
  children: React.ReactNode;
  title: string;
  description?: string;
  more?: {
    label: string;
    link: string;
  };
}
export const AsidePanel = ({ className, title, description, more, children }: Props) => {
  return (
    <section
      className={clsx('AsidePanel', styles.container, className, {
        [styles.headerOnly]: !children,
      })}
    >
      <SectionHeader title={title} description={description} more={more} width="spaceBetween" />
      {children && <div className={styles.content}>{children}</div>}
    </section>
  );
};
