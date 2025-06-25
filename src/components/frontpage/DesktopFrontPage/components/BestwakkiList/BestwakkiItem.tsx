import React from 'react';
import clsx from 'clsx';

import styles from './BestwakkiItem.module.scss';
import { BasicImage } from '@/common/components';

export interface Props {
  subject: string;
  board: string;
  thumbnail: string | null;
  articleId: number;
}

export const BestwakkiItem = ({ subject, board, thumbnail, articleId }: Props) => {
  return (
    <a
      href={`https://cafe.naver.com/steamindiegame/${articleId}`}
      className={clsx('BestwakkiItem', styles.container)}
      target="_blank"
    >
      <div className={styles.thumbnailWrapper}>
        <BasicImage className={styles.thumbnail} src={thumbnail ?? ''} alt={subject} noReferrer />
      </div>
      <div className={styles.infoWrapper}>
        <div className={styles.board}>{board}</div>
        <div className={styles.subject}>{subject}</div>
      </div>
    </a>
  );
};
