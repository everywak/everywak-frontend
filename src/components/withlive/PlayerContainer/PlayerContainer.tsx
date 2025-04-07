import { CSSProperties } from 'react';
import clsx from 'clsx';
import { AnimatePresence } from 'framer-motion';
import { ChannelStateType, ChannelType } from 'utils/types/withlive.type';
import { useWithliveValues } from 'contexts/WithliveContext';
import { StreamPlayer } from './components';
import styles from './PlayerContainer.module.scss';

// 여기서 멀티뷰 레이아웃 관리
export const PlayerContainer = () => {
  const { channels, watchingChannels, isEnabledMultiView, multiViewLayout } = useWithliveValues();

  const _watchingPlayers = watchingChannels
    .map((watchingChannel) => {
      const channel = channels.find((channel) => channel.memberId === watchingChannel.memberId);
      return {
        player: watchingChannel,
        channel,
      };
    })
    .filter((player) => player.channel) as {
    player: ChannelStateType;
    channel: ChannelType;
  }[];
  const watchingPlayers = _watchingPlayers.filter(
    ({ player }) =>
      player.order < (isEnabledMultiView ? (multiViewLayout.startsWith('one-side') ? 7 : 999) : 1),
  );

  const firstPlayerSize =
    isEnabledMultiView && !['one-side-r', 'one-side-l'].includes(multiViewLayout)
      ? 'normal'
      : 'full';
  const players = watchingPlayers.map(({ player, channel }) => (
    <StreamPlayer
      key={player.memberId}
      className={styles.player}
      player={player}
      channel={channel}
      size={player.order === 0 ? firstPlayerSize : 'simple'}
      order={player.order}
    />
  ));

  const count = watchingPlayers.length;
  const rowCount = Math.ceil(Math.sqrt(count));
  const colCount = rowCount === 1 ? 1 : count > rowCount * (rowCount - 1) ? rowCount : rowCount - 1;
  return (
    <section
      className={clsx(styles.container, {
        [styles.single]: !isEnabledMultiView,
        [styles.oneSide]: isEnabledMultiView && multiViewLayout.startsWith('one-side'),
        [styles.oneSideR]: isEnabledMultiView && multiViewLayout === 'one-side-r',
        [styles.oneSideL]: isEnabledMultiView && multiViewLayout === 'one-side-l',
        [styles.oneSideT]: isEnabledMultiView && multiViewLayout === 'one-side-t',
        [styles.oneSideB]: isEnabledMultiView && multiViewLayout === 'one-side-b',
        [styles.grid]: isEnabledMultiView && multiViewLayout === 'grid',
      })}
      style={
        {
          '--rows': rowCount,
          '--cols': colCount,
        } as CSSProperties
      }
    >
      <AnimatePresence>{players}</AnimatePresence>
    </section>
  );
};
