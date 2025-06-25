import HorizontalScrollableList from '@/common/components/legacy/HorizontalScrollableList/HorizontalScrollableList';
import Spinner from '@/common/components/legacy/Spinner';
import { VideoItem, Props as VideoItemProps, VideoItemSize } from '../VideoItem/VideoItem';

import styles from './VideoSlideList.module.scss';

export interface Props {
  className?: string;
  items: VideoItemProps[];
  size?: VideoItemSize;
  isLoading?: boolean;
  backgroundColor?: string;
  shorts?: boolean;
}

export const VideoSlideList = (props: Props) => {
  const list = props.items.map((item) => (
    <VideoItem
      key={item.href}
      className={styles.item}
      size={props.size}
      shorts={props.shorts}
      {...item}
    />
  ));
  return (
    <HorizontalScrollableList className={styles.container} backgroundColor={props.backgroundColor}>
      <ul className={styles.list}>
        {props.isLoading ? <Spinner className={styles.spinner} /> : list}
      </ul>
    </HorizontalScrollableList>
  );
};
