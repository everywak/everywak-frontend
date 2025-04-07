import clsx from 'clsx';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useWithliveActions } from 'contexts/WithliveContext';
import styles from './ChannelItem.module.scss';

export interface Props {
  channelId: string;
  profileImageUrl: string;
  isLive: boolean;
  isWatching: boolean;
  thumbnailUrl?: string;
  title?: string;
  setHoverChannel: (
    hoverChannel: {
      thumbnailUrl: string;
      title: string;
      top: number;
    } | null,
  ) => void;
}

export function ChannelItem(props: Props) {
  const { addWatchingChannel } = useWithliveActions();
  const contentRef = useRef<HTMLDivElement>(null);

  const onHover = () => {
    if (props.isLive && props.thumbnailUrl && props.title) {
      props.setHoverChannel({
        thumbnailUrl: props.thumbnailUrl,
        title: props.title,
        top: contentRef.current?.getBoundingClientRect().top ?? 0,
      });
    } else {
      props.setHoverChannel(null);
    }
  };

  return (
    <motion.div
      ref={contentRef}
      className={clsx(styles.container, {
        [styles.live]: props.isLive,
        [styles.watching]: props.isWatching,
      })}
      onClick={() => addWatchingChannel(props.channelId)}
      onMouseEnter={onHover}
      layout
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
        mass: 0.5,
      }}
    >
      <div className={styles.imageWrapper}>
        <img src={props.profileImageUrl} alt={props.channelId} />
      </div>
      <div className={styles.watchingMarker}></div>
    </motion.div>
  );
}
