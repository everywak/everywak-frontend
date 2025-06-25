import React from 'react';
import clsx from 'clsx';
import { KeyboardArrowRightRounded } from '@mui/icons-material';
import { BasicImage, CommonLink } from '@/common/components';
import styles from './MusicChartItem.module.scss';

export interface Props {
  className?: string;
  rank: number;
  title: string;
  author: string;
  thumbnail: string;
  href: string;
}

export const MusicChartItem = ({ className, rank, title, author, thumbnail, href }: Props) => {
  return (
    <CommonLink className={clsx('MusicChartItem', styles.container, className)} href={href}>
      <div className={styles.rank}>{rank}</div>
      <BasicImage className={styles.thumbnail} src={thumbnail} alt={title} noReferrer />
      <div className={styles.infoWrapper}>
        <div className={styles.title}>{title}</div>
        <div className={styles.author}>{author}</div>
      </div>
      <KeyboardArrowRightRounded className={styles.moreIcon} fontSize="small" />
    </CommonLink>
  );
};
