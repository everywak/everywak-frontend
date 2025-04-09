import React, { CSSProperties } from 'react';
import clsx from 'clsx';
import styles from './AppListItemIcon.module.scss';

export interface Props {
  className?: string;
  src?: React.ReactNode;
  alt?: string;
  iconPadding?: string;
  themeColor?: string;
  hideShadow?: boolean;
}

export const AppListItemIcon = ({
  className,
  src,
  alt,
  iconPadding = '0px',
  themeColor = '#d3d3d3',
  hideShadow,
}: Props) => {
  const icon =
    typeof src == 'string' ? (
      <img
        src={src}
        alt={alt}
        onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
      />
    ) : (
      src
    );

  return (
    <div
      className={clsx('AppListItemIcon', styles.container, className)}
      style={{ '--themeColor': themeColor } as CSSProperties}
    >
      {!hideShadow && <div className={styles.bottomShadow}></div>}
      <div className={styles.iconWrapper}>
        <div
          className={styles.imgWrapper}
          style={{ '--iconPadding': iconPadding } as CSSProperties}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
