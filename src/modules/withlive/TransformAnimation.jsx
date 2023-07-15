import React, { useEffect, useState, useRef } from 'react';

import styles from './TransformAnimation.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function TransformAnimation({ className = '', children, ...rest }) {

  const [targetRect, setTargetRect] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    transition: 2,
  });

  const refElement = useRef();

  const diffRect = (prevRect, newRect) => {
    return (prevRect.top !== newRect?.top ||
      prevRect.left !== newRect?.left ||
      prevRect.width !== newRect?.width ||
      prevRect.height !== newRect?.height
    );
  };

  const updatePosition = () => {
    const newRect = refElement?.current?.getBoundingClientRect();
    if (diffRect(targetRect, newRect)) {
      setTargetRect({
        top: newRect.top,
        left: newRect.left,
        width: newRect.width,
        height: newRect.height,
        transition: Math.max(targetRect.transition - 1, 0),
      });
    }
  };

  useEffect(() => {
    const loop = setInterval(updatePosition, 10);
    return () => clearInterval(loop);
  }, [targetRect]);

  const style = {
    '--top': targetRect.top,
    '--left': targetRect.left,
    '--width': targetRect.width,
    '--height': targetRect.height,
  };

  return <div ref={refElement} className={cx('TransformAnimation', className)} {...rest}>

    <div className={cx('transformAnimation_contentWrapper', { transition: targetRect.transition == 0 })} style={style}>
      {children}
    </div>
  </div>;
}
