import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { KeyboardArrowRightRounded } from '@mui/icons-material';

import styles from './SectionHeader.module.scss';

export interface Props {
  title?: string;
  description?: string;
  more?: {
    label: string;
    link: string;
  };
  width?: 'packed' | 'spaceBetween';
  size?: 'big' | 'medium' | 'small' | 'max';
}

/**
 * 더 보기 링크가 있는 섹션 헤더
 */
export const SectionHeader = ({
  title,
  description,
  more,
  width = 'packed',
  size = 'medium',
}: Props) => {
  return (
    <header
      className={clsx('SectionHeader', styles.container, {
        [styles.spaceBetween]: width === 'spaceBetween',
        [styles.big]: size === 'big',
        [styles.medium]: size === 'medium',
        [styles.small]: size === 'small',
        [styles.max]: size === 'max',
      })}
    >
      <div className={styles.titleArea}>
        {title && <div className={styles.title}>{title}</div>}
        {description && <div className={styles.subtitle}>{description}</div>}
        {size === 'max' && <div className={styles.bottomLine}>&nbsp;</div>}
      </div>
      {more &&
        (more.link.match(/^http/) ? (
          <a href={more.link} className={styles.more}>
            {more.label} <KeyboardArrowRightRounded fontSize="small" />
          </a>
        ) : (
          <Link to={more.link} className={styles.more}>
            {more.label} <KeyboardArrowRightRounded fontSize="small" />
          </Link>
        ))}
    </header>
  );
};
