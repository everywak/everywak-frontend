import React, { useState } from 'react';

import useWindowEvent from '../../../hooks/useWindowEvent';

import styles from './StretchableContainer.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 드래그로 크기 조절 가능한 컨테이너
 * 
 * @param {{className: string, rotation: 'left'|'right'|'top'|'bottom', defaultSize: number, minSize: number, sliderSize: number, children: JSX.Element|string}} props 
 * @returns {JSX.Element}
 */
function StretchableContainer({ className, rotation = 'right', defaultSize = 320, minSize = 180, sliderSize = 16, children }) {

  const [size, setSize] = useState(defaultSize);
  const [dragState, setDragState] = useState({
    isDragging: false,
    prevScrollPos: 0,
    prevSize: size,
    newSize: size,
  });

  const onDragStartHandler = e => {
    const pos = ['left', 'right'].includes(rotation) ? (e.type === 'touchstart' ? e.touches[0].pageX : e.pageX) : (e.type === 'touchstart' ? e.touches[0].pageY : e.pageY);
    setDragState({
      isDragging: true,
      prevScrollPos: pos,
      prevSize: size,
      newSize: size,
    });
  };
  const onDragHandler = e => {
    if (dragState.isDragging) {
      e.preventDefault();
      const pos = ['left', 'right'].includes(rotation) ? (e.type === 'touchstart' ? e.touches[0].pageX : e.pageX) : (e.type === 'touchstart' ? e.touches[0].pageY : e.pageY);
      const newSize = Math.max(dragState.prevSize - (pos - dragState.prevScrollPos), minSize);
      setDragState({
        ...dragState,
        newSize,
      });
    }
  };
  const onDragEndHandler = e => {
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

  return <div className={cx('StretchableContainer', className, {right: rotation === 'right', left: rotation === 'left', top: rotation === 'top', bottom: rotation === 'bottom'})} style={{'--size': `${size}px`, '--newSize': `${dragState.newSize}px`, '--sliderSize': `${sliderSize}px`}}>
    <div className={styles.contentWrapper}>
      {children}
    </div>
    <div className={cx('slider', {focused: dragState.isDragging})} onMouseDown={onDragStartHandler} onTouchStart={onDragStartHandler}></div>
    <div className={cx('sizeControlWrapper', {dragged: dragState.isDragging})}>
      <div className={styles.sizeControlOverlay}></div>
    </div>
  </div>;
}

export default StretchableContainer;