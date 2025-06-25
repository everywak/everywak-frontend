import clsx from 'clsx';
import { useWithliveActions, useWithliveValues } from '@/contexts/withlive';
import { ChannelStateType } from '@/utils/types/withlive.type';
import { MultiViewControl } from './components';
import styles from './PlayerOverlay.module.scss';

export interface Props {
  player: ChannelStateType;
  size: 'full' | 'normal' | 'simple';
  isAnimating: boolean;
}

export const PlayerOverlay = ({ player, size, isAnimating }: Props) => {
  const { draggingPlayerState } = useWithliveValues();
  const { updateDraggingPlayerState, setWatchingChannelOrder } = useWithliveActions();
  return (
    <div className={clsx('PlayerOverlay', styles.container)} draggable={false}>
      <MultiViewControl className={styles.control} player={player} size={size} />
      {draggingPlayerState.isDragging && (
        <div
          className={clsx(styles.draggingArea, {
            [styles.target]: draggingPlayerState.order === player.order,
          })}
          onPointerEnter={() => {
            if (
              !(isAnimating && draggingPlayerState.prevOrder === player.order) &&
              draggingPlayerState.order !== player.order
            ) {
              updateDraggingPlayerState({
                prevOrder: draggingPlayerState.order,
                order: player.order,
              });
              setWatchingChannelOrder(draggingPlayerState.targetMemberId, player.order);
            }
          }}
        ></div>
      )}
    </div>
  );
};
