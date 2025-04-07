import React from 'react';

import BasicImage from '../../common/Components/Image/BasicImage';

import styles from './FrontBestwakkiItem.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 메인 페이지에 표시되는 왁물원 인기글 아이템
 *
 * @param {{name: string, state: string, weather: string}} props
 * @returns {JSX.Element}
 */
function FrontBestwakkiItem({ subject, board, thumbnail, articleId }) {
  return (
    <a
      href={`https://cafe.naver.com/steamindiegame/${articleId}`}
      className={cx('FrontBestwakkiItem')}
      target="_blank"
    >
      <div className={styles.thumbnailWrapper}>
        <BasicImage className={styles.thumbnail} src={thumbnail} noReferrer />
      </div>
      <div className={styles.infoWrapper}>
        <div className={styles.board}>{board}</div>
        <div className={styles.subject}>{subject}</div>
      </div>
    </a>
  );
}

export default FrontBestwakkiItem;
