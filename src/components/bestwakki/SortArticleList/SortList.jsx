import React, { useCallback, useEffect, useState, useRef } from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

import './SortList.scss';
import cx from 'classnames';

const options = [
  {
    name: '최신순',
    value: 'time',
  },
  {
    name: '오래된 순',
    value: 'time_oldest',
  },
  {
    name: '좋아요순',
    value: 'up',
  },
  {
    name: '댓글순',
    value: 'comment',
  },
  {
    name: '조회순',
    value: 'read',
  },
];

function SortList({ name, value, onChange }) {
  const [prevValue, setPrevValue] = useState('time');
  const [HoverRect, setHoverRect] = useState('div');

  const onClickItem = (newValue) => {
    if (value !== newValue) {
      setPrevValue(value);
    }
    onChange({
      target: {
        name: name,
        value: newValue,
      },
    });
  };

  const refThis = useRef();
  const refPrevItem = useRef();
  const refSelectedItem = useRef();
  const showAnimSortTarget = useCallback(() => {
    if (!refThis.current || !refPrevItem.current || !refSelectedItem.current) {
      return;
    }

    const parentRect = refThis.current.getBoundingClientRect();
    const currentRect = refPrevItem.current.getBoundingClientRect();
    const targetRect = refSelectedItem.current.getBoundingClientRect();

    const px = currentRect.left - parentRect.left,
      x = targetRect.left - parentRect.left,
      pw = currentRect.right - currentRect.left,
      w = targetRect.right - targetRect.left;

    const animSortTarget = keyframes`
      0% {
        left: ${px + 'px'};
        width: ${pw + 'px'};
      }
      100% {
        left: ${x + 'px'};
        width: ${w + 'px'};
      }
    `;
    setHoverRect(styled.div`
      animation: ${animSortTarget} 0.3s 0s 1 ease normal forwards;
    `);
  }, [prevValue, value, refThis.current, refSelectedItem.current]);

  useEffect(showAnimSortTarget, [showAnimSortTarget]);

  const list = options.map((item) => (
    <div
      key={`SortList_${item.value}`}
      className={cx('sortItem', { selected: item.value === value })}
      data-value={item.value}
      onClick={() => onClickItem(item.value)}
      ref={item.value === value ? refSelectedItem : item.value === prevValue ? refPrevItem : null}
    >
      <span>{item.name}</span>
    </div>
  ));

  return (
    <div id="SortList" className="SortList" ref={refThis}>
      <HoverRect className="hoverRect" id="hoverRect" />
      {list}
    </div>
  );
}

export default SortList;
