import React, { useEffect } from 'react';

/**
 * 전역 이벤트 리스너를 등록합니다.
 */
export function useWindowEvent(
  type: string,
  handler: EventListenerOrEventListenerObject,
  deps?: React.DependencyList,
) {
  useEffect(() => {
    const eventTypes = type.split(' ');
    eventTypes.forEach((type) => window.addEventListener(type, handler));
    return () =>
      eventTypes.forEach((type) => window.removeEventListener(type, handler));
  }, deps);
}
