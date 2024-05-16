import React, { useState } from 'react';

import useWindowEvent from 'hooks/useWindowEvent';

import styles from './StretchableContainer.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export type Props = {
  className?: string;
  rotation?: 'left' | 'right' | 'top' | 'bottom';
  defaultSize?: number;
  minSize?: number;
  sliderSize?: number;
  children: React.ReactNode;
};

export default function StretchableContainer({
  className,
  rotation = 'right',
  defaultSize = 320,
  minSize = 180,
  sliderSize = 16,
  children,
}: Props) {
  const [size, setSize] = useState(defaultSize);
  const [dragState, setDragState] = useState({
    isDragging: false,
    prevScrollPos: 0,
    prevSize: size,
    newSize: size,
  });

  const onDragStartHandler: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const pos = ['left', 'right'].includes(rotation)
      ? e.type === 'touchstart'
        ? e.touches[0].clientX
        : e.clientX
      : e.type === 'touchstart'
      ? e.touches[0].clientY
      : e.clientY;
    setDragState({
      isDragging: true,
      prevScrollPos: pos,
      prevSize: size,
      newSize: size,
    });
  };
  const onDragHandler: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (dragState.isDragging) {
      e.preventDefault();
      const pos = ['left', 'right'].includes(rotation)
        ? e.type === 'touchstart'
          ? e.touches[0].clientX
          : e.clientX
        : e.type === 'touchstart'
        ? e.touches[0].clientY
        : e.clientY;

      const direction = ['left', 'top'].includes(rotation) ? -1 : 1;
      const newSize = Math.max(
        dragState.prevSize - (pos - dragState.prevScrollPos) * direction,
        minSize,
      );
      setDragState({
        ...dragState,
        newSize,
      });
    }
  };
  const onDragEndHandler = (e) => {
    if (dragState.isDragging) {
      setSize(dragState.newSize);
      setDragState({
        isDragging: false,
        prevScrollPos: 0,
        prevSize: dragState.newSize,
        newSize: dragState.newSize,
      });
    }
  };
  useWindowEvent('mousemove touchmove', onDragHandler, [dragState]);
  useWindowEvent('mouseup touchend', onDragEndHandler, [dragState]);

  return (
    <div
      className={cx('StretchableContainer', className, {
        right: rotation === 'right',
        left: rotation === 'left',
        top: rotation === 'top',
        bottom: rotation === 'bottom',
      })}
      style={
        {
          '--size': `${size}px`,
          '--newSize': `${dragState.newSize}px`,
          '--sliderSize': `${sliderSize}px`,
        } as React.CSSProperties
      }
    >
      <div className={styles.contentWrapper}>{children}</div>
      <div
        className={cx('slider', { focused: dragState.isDragging })}
        onMouseDown={onDragStartHandler}
        onTouchStart={onDragStartHandler}
      ></div>
      <div
        className={cx('sizeControlWrapper', { dragged: dragState.isDragging })}
      >
        <div className={styles.sizeControlOverlay}></div>
      </div>
    </div>
  );
}
