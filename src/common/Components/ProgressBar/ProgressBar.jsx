import React, { useCallback, useEffect, useRef, useState } from 'react';

import styles from './ProgressBar.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 드래그시 변경값 전달
 * 
 * @param {number} max 
 * @param {string} actionType 
 * @param {string} name 
 * @param {({target: {name: string, value: number}}) => void} onChange 
 * @returns {[React.MutableRefObject<undefined>, React.Dispatch<React.SetStateAction<boolean>>]}
 */
const useDragChange = (max, actionType, name, onChange) => {
  const refProgress = useRef();
  const getRefOffset = useCallback(() => {
    const el = refProgress.current;
    if (!el) { return; }

    const rect = el.getBoundingClientRect();
    const offset = { 
      top: rect.top + window.scrollY, 
      left: rect.left + window.scrollX, 
    };

    return offset;
  }, [refProgress]);
  const [mouseDown, setMouseDown] = useState(false);
  useEffect(() => {
    const onMouseUpHandler = e => setMouseDown(false);
    const onMouseMoveHandler = e => {
      if (actionType !== 'drag') { return; }
      if (!mouseDown) { return; }

      const offset = getRefOffset();
      if (!offset) { return; }

      const targetValue = Math.min(Math.max(e.pageX - offset.left, 0), max);
      onChange({target: {
        name,
        value: targetValue,
      }});
    };
    document.addEventListener('mouseup', onMouseUpHandler);
    document.addEventListener('mousemove', onMouseMoveHandler);

    return () => {
      document.removeEventListener('mouseup', onMouseUpHandler);
      document.removeEventListener('mousemove', onMouseMoveHandler);
    }
  }, [getRefOffset, mouseDown, max, actionType, name, onChange]);

  return [refProgress, setMouseDown];
}

/**
 * 진행바
 * 
 * @param {{
 * className?: string, 
 * name: string, 
 * value: number, 
 * max: number, 
 * onChange?: ({target: {name: string, value: number}}) => void, 
 * actionType?: 'click'|'drag',
 * accentColor: string}} props 
 */
function ProgressBar(props) {
  const {
    className, 
    name,
    value, 
    max, 
    onChange, 
    actionType = 'click', 
    accentColor,
    ...rest
  } = props;

  const [previewValue, setPreviewValue] = useState(value);
  const onMouseMoveHandler = e => {
    const targetValue = e.nativeEvent.offsetX / e.target.clientWidth * max;
    setPreviewValue(targetValue);
  };
  const onChangeHandler = e => {
    const targetValue = e.nativeEvent.offsetX / e.target.clientWidth * max;
    onChange({target: {
      name,
      value: targetValue,
    }});
  };

  const [refProgress, setMouseDown] = useDragChange(max, actionType, name, onChange);

  return (
    <div className={cx("ProgressBar", className)} {...rest} style={{'--accentColor': accentColor}}>
      <progress className="preview" max={max} value={previewValue} />
      <progress 
        className="progressBar" 
        ref={refProgress}
        max={max} value={value}
        onMouseMove={onMouseMoveHandler}
        onClick={onChangeHandler}
        onMouseDown={e => {onChangeHandler(e);setMouseDown(true)}} />
    </div>
  );
}

export default ProgressBar;