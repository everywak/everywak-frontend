import React, { useMemo } from 'react';
import clsx from 'clsx';
import {
  ChatRounded,
  CloseRounded,
  DragIndicatorRounded,
  RectangleOutlined,
  RectangleRounded,
  SettingsOverscanRounded,
  SpeakerNotesOffRounded,
  ViewCarouselRounded,
  VisibilityOffRounded,
  VisibilityRounded,
} from '@mui/icons-material';
import {
  GridIcon,
  OneSideBottomIcon,
  OneSideLeftIcon,
  OneSideRightIcon,
  OneSideTopIcon,
} from 'assets/withlive-layout';
import { Button } from 'common/components';
import {
  useWithliveActions,
  useWithliveValues,
} from 'contexts/WithliveContext';
import { ChannelStateType, LayoutType } from 'utils/types/withlive.type';
import styles from './PlayerOverlay.module.scss';
import { Tooltip } from '../../..';

export interface Props {
  player: ChannelStateType;
  size: 'full' | 'normal' | 'simple';
  isAnimating: boolean;
}

export const PlayerOverlay = ({ player, size, isAnimating }: Props) => {
  const { draggingPlayerState } = useWithliveValues();
  const { updateDraggingPlayerState, setWatchingChannelOrder } =
    useWithliveActions();
  return (
    <div className={clsx('PlayerOverlay', styles.container)}>
      <MultiViewControl player={player} size={size} />
      {draggingPlayerState.isDragging && (
        <div
          className={clsx(styles.draggingArea, {
            [styles.target]: draggingPlayerState.order === player.order,
          })}
          onPointerEnter={() => {
            if (
              !(
                isAnimating && draggingPlayerState.prevOrder === player.order
              ) &&
              draggingPlayerState.order !== player.order
            ) {
              updateDraggingPlayerState({
                prevOrder: draggingPlayerState.order,
                order: player.order,
              });
              setWatchingChannelOrder(
                draggingPlayerState.targetMemberId,
                player.order,
              );
            }
          }}
        ></div>
      )}
    </div>
  );
};

const layoutIcons: Record<LayoutType, React.ReactNode> = {
  grid: <GridIcon />,
  'one-side-l': <OneSideLeftIcon />,
  'one-side-r': <OneSideRightIcon />,
  'one-side-t': <OneSideTopIcon />,
  'one-side-b': <OneSideBottomIcon />,
  free: <GridIcon />,
};

const layoutLabels: { value: LayoutType; label: string }[] = [
  {
    value: 'one-side-r',
    label: '하나에 집중-오른쪽',
  },
  {
    value: 'one-side-l',
    label: '하나에 집중-왼쪽',
  },
  {
    value: 'one-side-t',
    label: '하나에 집중-위쪽',
  },
  {
    value: 'one-side-b',
    label: '하나에 집중-아래쪽',
  },
  {
    value: 'grid',
    label: '그리드',
  },
];

export interface MultiViewControlProps {
  player: ChannelStateType;
  size: 'full' | 'normal' | 'simple';
}
export const MultiViewControl = ({ player, size }: MultiViewControlProps) => {
  const {
    isExpanded,
    isEnabledMultiView,
    isChatVisible,
    multiViewLayout,
    watchingChannels,
    draggingPlayerState,
  } = useWithliveValues();
  const {
    setIsExpanded,
    setIsEnabledMultiView,
    setIsChatVisible,
    setMultiViewLayout,
    updateWatchingChannel,
    removeWatchingChannel,
    updateDraggingPlayerState,
  } = useWithliveActions();

  const items = useMemo<(ControlButtonProps | SubControlProps)[]>(
    () => [
      ...(isEnabledMultiView
        ? [
            {
              className: styles.drag,
              children: <DragIndicatorRounded />,
              onPointerDown: () => {
                updateDraggingPlayerState({
                  isDragging: true,
                  targetMemberId: player.memberId,
                  prevOrder: player.order,
                  order: player.order,
                });
              },
            },
            {
              tooltip: player.isActive ? '방송 일시정지' : '방송 재생',
              onClick: () =>
                updateWatchingChannel(player.memberId, {
                  ...player,
                  isActive: !player.isActive,
                }),
              children: player.isActive ? (
                <VisibilityRounded />
              ) : (
                <VisibilityOffRounded />
              ),
            },
            ...(watchingChannels.length > 1
              ? [
                  {
                    tooltip: '방송 끄기',
                    onClick: () => removeWatchingChannel(player.memberId),
                    children: <CloseRounded />,
                  },
                ]
              : []),
          ]
        : []),
      ...(size !== 'simple'
        ? [
            ...(isEnabledMultiView
              ? [
                  {
                    icon: layoutIcons[multiViewLayout],
                    items: layoutLabels.map((layout) => ({
                      tooltip: layout.label,
                      onClick: () => setMultiViewLayout(layout.value),
                      children: layoutIcons[layout.value],
                    })),
                  },
                ]
              : []),
            {
              tooltip: isEnabledMultiView ? '멀티뷰 끄기' : '멀티뷰',
              onClick: () => {
                isEnabledMultiView &&
                  !player.isActive &&
                  updateWatchingChannel(player.memberId, {
                    ...player,
                    isActive: true,
                  });
                setIsEnabledMultiView(!isEnabledMultiView);
              },
              children: isEnabledMultiView ? (
                <RectangleRounded />
              ) : (
                <ViewCarouselRounded />
              ),
            },
            {
              tooltip: isExpanded ? '스크린 모드 끄기' : '스크린 모드',
              onClick: () => setIsExpanded(!isExpanded),
              children: isExpanded ? (
                <RectangleOutlined />
              ) : (
                <SettingsOverscanRounded />
              ),
            },
            {
              tooltip: isChatVisible ? '채팅창 숨기기' : '채팅창 보기',
              onClick: () => setIsChatVisible(!isChatVisible),
              children: isChatVisible ? (
                <ChatRounded />
              ) : (
                <SpeakerNotesOffRounded />
              ),
            },
          ]
        : []),
    ],
    [
      isExpanded,
      isEnabledMultiView,
      isChatVisible,
      multiViewLayout,
      player.memberId,
      player.isActive,
      size,
      watchingChannels.length,
    ],
  );

  return (
    <div
      className={clsx(styles.controlWrapper, styles[size], {
        [styles.dragging]: draggingPlayerState.isDragging,
      })}
    >
      <Control items={items} />
    </div>
  );
};

export const Control = React.memo(
  ({
    className,
    items,
  }: {
    className?: string;
    items: (ControlButtonProps | SubControlProps)[];
  }) => (
    <ul className={clsx('ControlList', styles.control, className)}>
      {items.map((item, index) =>
        'items' in item ? (
          <SubControl key={index} {...item} />
        ) : (
          <ControlButton key={index} {...item} />
        ),
      )}
    </ul>
  ),
);

export interface ControlButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onPointerDown?: () => void;
  tooltip?: string;
}

export const ControlButton = ({
  children,
  className,
  onClick,
  onPointerDown,
  tooltip,
}: ControlButtonProps) => (
  <Button
    className={clsx(styles.controlButton, className)}
    onClick={onClick}
    onPointerDown={onPointerDown}
    color="white-transparent"
  >
    {children}
    {tooltip && <Tooltip>{tooltip}</Tooltip>}
  </Button>
);

export interface SubControlProps {
  className?: string;
  icon: React.ReactNode;
  items: ControlButtonProps[];
}

export const SubControl = ({ className, icon, items }: SubControlProps) => (
  <Button className={clsx(styles.subMenu, className)} color="white-transparent">
    {icon}
    <div className={styles.menuWrapper}>
      <Control className={styles.menu} items={items} />
    </div>
  </Button>
);
