import React, { useState } from 'react';
import clsx from 'clsx';
import { ExpandMoreRounded } from '@mui/icons-material';
import { Button } from '@/common/components';
import { VideoItem, Props as VideoItemProps, VideoItemSize } from '../VideoItem/VideoItem';
import styles from './VideoGridList.module.scss';

export interface Props {
  items: VideoItemProps[];
  defaultShowCount?: number;
  perPageCount?: number;
  maximumShowCount?: number;
  moreTarget?: string;
  isLoading?: boolean;
  onMore?: () => void;
  listStyle?: 'grid' | 'list';
  size?: VideoItemSize;
  shorts?: boolean;
}

export const VideoGridList = (props: Props) => {
  const {
    items,
    defaultShowCount = 8,
    perPageCount = 8,
    maximumShowCount = 30,
    moreTarget,
    isLoading,
    onMore = () => {},
    listStyle = 'grid',
    size = 'medium',
    shorts,
  } = props;

  const [showCount, setShowCount] = useState(defaultShowCount);

  const onClickMore = () => {
    showMoreItems();
    onMore();
  };

  const showMoreItems = () => {
    setShowCount(showCount + perPageCount);
  };

  const list = items
    .slice(0, showCount)
    .map((item) => (
      <VideoItem key={item.href} className={styles.item} size={size} {...item} shorts={shorts} />
    ));

  return (
    <div
      className={clsx('VideoGridList', styles.container, {
        [styles.listStyleList]: listStyle == 'list',
        listStyleList: listStyle == 'list',
      })}
    >
      <ul className={styles.itemList}>{list}</ul>
      {showCount < maximumShowCount && (
        <div className={styles.more}>
          <Button
            className={styles.moreLoad}
            color="black-transparent"
            onClick={onClickMore}
            size="large"
          >
            <ExpandMoreRounded />
          </Button>
        </div>
      )}
    </div>
  );
};
