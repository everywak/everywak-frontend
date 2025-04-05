import React, { useCallback, useState } from 'react';
import clsx from 'clsx';
import { useWindowEvent } from 'hooks/useWindowEvent';
import styles from './StretchableContainer.module.scss';

export interface Props {
  className?: string;
  rotation?: 'left' | 'right' | 'top' | 'bottom';
  defaultSize?: number;
  minSize?: number;
  sliderSize?: number;
  children: React.ReactNode;
}

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

  const onDragStartHandler: React.PointerEventHandler<HTMLDivElement> = useCallback((e) => {
    e.preventDefault();
    const pos = ['left', 'right'].includes(rotation) ? e.clientX : e.clientY;
    setDragState({
      isDragging: true,
      prevScrollPos: pos,
      prevSize: size,
      newSize: size,
    });
  }, [rotation, size]);
  const onDragHandler = ((e: PointerEvent) => {
    if (dragState.isDragging) {
      e.preventDefault();
      const pos = ['left', 'right'].includes(rotation) ? e.clientX : e.clientY;

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
  }) as EventListener;
  const onDragEndHandler = (_: any) => {
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
  useWindowEvent('pointermove', onDragHandler, [dragState]);
  useWindowEvent('pointerup', onDragEndHandler, [dragState]);

  return (
    <div
      className={clsx(styles.container, className, {
        [styles.right]: rotation === 'right',
        [styles.left]: rotation === 'left',
        [styles.top]: rotation === 'top',
        [styles.bottom]: rotation === 'bottom',
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
        className={clsx(styles.dimmer, {
          [styles.dragged]: dragState.isDragging,
        })}
      >
      </div>
      <div
        className={clsx(styles.slider, {
          [styles.focused]: dragState.isDragging,
        })}
        onPointerDown={onDragStartHandler}
        onDragStart={(_) => false}
      ></div>
      <div
        className={clsx(styles.sizeControlWrapper, {
          [styles.dragged]: dragState.isDragging,
        })}
      >
        <div className={styles.sizeControlOverlay}></div>
      </div>
    </div>
  );
}
