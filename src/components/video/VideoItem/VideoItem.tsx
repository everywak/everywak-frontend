import React from 'react';
import clsx from 'clsx';

import { BasicImage, CommonLink } from '@/common/components';
import { formatDateTimeString, formatNumberShort } from '@/common/functions';

import styles from './VideoItem.module.scss';

export type VideoItemSize = 'tiny' | 'small' | 'medium';

export interface Props {
  className?: string;
  href: string;
  thumbnail: string;
  title: string;
  datetime: Date;
  duration?: number;
  viewCount?: number;
  authorProfileImg: string;
  onClick?: (e: React.MouseEvent) => void;
  hideThumbnail?: boolean;
  size?: VideoItemSize;
  shorts?: boolean;
}

export const VideoItem = (props: Props) => {
  const {
    className,
    href,
    thumbnail,
    title,
    datetime,
    duration,
    viewCount,
    authorProfileImg,
    onClick,
    hideThumbnail,
    size = 'medium',
    shorts,
  } = props;

  const formattedViewCount = formatNumberShort(viewCount || 0);
  const formattedDuration =
    `${(duration || 0) / 60 > 60 ? '' + Math.floor((duration || 0) / 3600) + ':' : ''}` +
    `0${Math.floor((duration || 0) / 60) % 60}`.slice(-2) +
    ':' +
    `0${Math.floor((duration || 0) % 60)}`.slice(-2);
  const formattedDateTime = formatDateTimeString(new Date(datetime));

  return (
    <li
      className={clsx('VideoItem', styles.container, className, {
        [styles.tiny]: size === 'tiny',
        [styles.small]: size === 'small',
        [styles.shorts]: shorts,
      })}
    >
      <CommonLink href={href} onClick={onClick}>
        <div className={styles.previewWrapper}>
          <BasicImage className={styles.previewImg} src={thumbnail} alt={title} />
          {viewCount !== undefined && (
            <span className={styles.viewCount}>{formattedViewCount}회 시청</span>
          )}
          {duration !== undefined && <span className={styles.duration}>{formattedDuration}</span>}
        </div>
        <div className={clsx(styles.infoArea, { [styles.hideThumbnail]: hideThumbnail })}>
          <BasicImage
            className={styles.profileCircle}
            src={authorProfileImg}
            alt="채널 프로필 이미지"
          />
          <div className={styles.descArea}>
            <div className={styles.title}>{title}</div>
            <span className={styles.viewCount}>조회수 {formattedViewCount}회</span>
            <div className={styles.uploadedTime}>{formattedDateTime}</div>
          </div>
        </div>
      </CommonLink>
    </li>
  );
};
