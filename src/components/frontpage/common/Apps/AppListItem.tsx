import React from 'react';
import clsx from 'clsx';
import { AppListItemIcon } from './AppListItemIcon';
import { CommonLink } from 'common/components';
import styles from './AppListItem.module.scss';

export interface Props {
  className?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  iconPadding?: string;
  themeColor?: string;
  href?: string;
  size?: 'normal' | 'small' | 'tiny';
  hideShadow?: boolean;
}

export const AppListItem = ({
  className,
  title = '제목',
  description = '어쩌구저쩌구 설명',
  icon,
  iconPadding = '0px',
  themeColor = '#d3d3d3',
  href = '',
  size = 'normal', // normal || small || tiny
  hideShadow,
}: Props) => {
  const content = (
    <>
      <div className={styles.thumbWrapper}>
        <AppListItemIcon
          className={styles.icon}
          src={icon}
          alt={title}
          iconPadding={iconPadding}
          themeColor={themeColor}
          hideShadow={hideShadow}
        />
      </div>
      <div className={styles.descWrapper}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </>
  );

  return (
    <CommonLink
      href={href}
      className={clsx('AppListItem', styles.container, className, styles[size])}
    >
      {content}
    </CommonLink>
  );
};
