import React, { useState } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import {
  ChannelStateType,
  ChannelStreamInfoType,
  ChannelType,
  LayoutType,
} from 'utils/types/withlive.type';
import { AutoRefreshImage } from 'common/components/Image/variants';
import { useWithliveValues } from 'contexts/WithliveContext';
import { ChannelDetail } from '../ChannelDetail/ChannelDetail';
import { PlayerOverlay } from './components';
import styles from './StreamPlayer.module.scss';

export interface Props {
  className?: string;
  size: 'full' | 'normal' | 'simple'; // full: 채널정보까지 one-side의 main 포지션, normal: 채널정보 없이 조작키 오버레이 full, simple: 채널정보x, 조작키 최소
  player: ChannelStateType;
  channel: ChannelType;
  order: number;
  isExpanded?: boolean;
  multiViewLayout?: LayoutType;
  isEnabledMultiView?: boolean;
  isTargetDragging?: boolean;
}

export const StreamPlayer = (props: Props) => {
  const { isExpanded, multiViewLayout, isEnabledMultiView, draggingPlayerState } =
    useWithliveValues();
  return (
    <StreamPlayer_
      {...props}
      isExpanded={isExpanded}
      multiViewLayout={multiViewLayout}
      isEnabledMultiView={isEnabledMultiView}
      isTargetDragging={
        draggingPlayerState.isDragging &&
        draggingPlayerState.targetMemberId === props.channel.memberId
      }
    />
  );
};

const StreamPlayer_ = (props: Props) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const streamInfo = props.channel.streamInfo;
  return (
    <motion.div
      className={clsx(styles.container, props.className, {
        [styles.expanded]: props.isExpanded,
        [styles.grid]: props.isEnabledMultiView && props.multiViewLayout! === 'grid',
        [styles.oneSideV]:
          props.isEnabledMultiView &&
          (props.multiViewLayout! === 'one-side-t' || props.multiViewLayout! === 'one-side-b'),
        [styles.full]: props.size === 'full',
        [styles.normal]: props.size === 'normal',
        [styles.simple]: props.size === 'simple',
        [styles.isDragging]: props.isTargetDragging,
      })}
      style={{
        order: props.order + 1,
      }}
      data-order={props.order + 1}
      layout
      transition={{
        type: 'spring',
        stiffness: 1200,
        damping: 130,
        mass: props.isEnabledMultiView ? 3 : 0,
      }}
      onLayoutAnimationStart={() => setIsAnimating(true)}
      onLayoutAnimationComplete={() => setIsAnimating(false)}
    >
      <div className={styles.playerWrapper}>
        {(streamInfo?.isLive && props.player.isActive) ? (
          <Iframe streamInfo={streamInfo} />
        ) : (
          <AutoRefreshImage
            className={styles.offlineImage}
            src={
              streamInfo?.isLive
                ? streamInfo?.thumbnail
                : `/images/streamoffline/${props.player.memberId}.png`
            } // TODO: props.channel.offlineImage 백엔드 사이드로
            alt={`${props.channel.nickname} 오프라인`}
          />
        )}
        <PlayerOverlay player={props.player} size={props.size} isAnimating={isAnimating} />
      </div>
      {props.size === 'full' && !props.isExpanded && (
        <ChannelDetail className={styles.channelDetail} memberId={props.player.memberId} />
      )}
    </motion.div>
  );
};

const Iframe = React.memo(
  ({ streamInfo }: { streamInfo: ChannelStreamInfoType }) => (
    <iframe
      id={`streamembed_${streamInfo.platform}_${streamInfo.channelId}_${streamInfo.videoId}`}
      className={styles.embed}
      src={`https://play.sooplive.co.kr/${streamInfo.channelId}/embed?autoPlay=true`}
      allowFullScreen
    />
  ),
  (prevProps, nextProps) =>
    `${prevProps.streamInfo.platform}_${prevProps.streamInfo.channelId}_${prevProps.streamInfo.videoId}` ===
    `${nextProps.streamInfo.platform}_${nextProps.streamInfo.channelId}_${nextProps.streamInfo.videoId}`,
);
