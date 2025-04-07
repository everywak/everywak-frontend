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

import { Button } from 'common/components';
import { Tooltip } from '../../../../..';
import { ChannelStateType } from 'utils/types/withlive.type';
import {
  useWithliveActions,
  useWithliveValues,
} from 'contexts/WithliveContext';
import styles from './MultiViewControl.module.scss';
import { layoutIcons, layoutLabels } from './constants';

export interface Props {
  className?: string;
  player: ChannelStateType;
  size: 'full' | 'normal' | 'simple';
}
export const MultiViewControl = ({ className, player, size }: Props) => {
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
      <Control className={className} items={items} />
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
