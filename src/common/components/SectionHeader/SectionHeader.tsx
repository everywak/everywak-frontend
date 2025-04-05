import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { KeyboardArrowRightRounded } from '@mui/icons-material';

import styles from './SectionHeader.module.scss';

export interface Props {
  title: string;
  description?: string;
  moreLabel?: string;
  moreLink?: string;
  width?: 'packed' | 'spaceBetween';
  size?: 'big' | 'medium' | 'small' | 'max';
}

/**
 * 더 보기 링크가 있는 섹션 헤더
 */
export function SectionHeader({
  title,
  description,
  moreLabel = '더 보기',
  moreLink,
  width = 'packed',
  size = 'medium',
}: Props) {
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
        <div className={styles.title}>{title}</div>
        {description && <div className={styles.subtitle}>{description}</div>}
        {size === 'max' && <div className={styles.bottomLine}>&nbsp;</div>}
      </div>
      {moreLink &&
        (moreLink.match(/^http/) ? (
          <a href={moreLink} className={styles.more}>
            {moreLabel} <KeyboardArrowRightRounded fontSize="small" />
          </a>
        ) : (
          <Link to={moreLink} className={styles.more}>
            {moreLabel} <KeyboardArrowRightRounded fontSize="small" />
          </Link>
        ))}
    </header>
  );
}
