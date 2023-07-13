import React, { useEffect } from 'react';

/**
 * 전역 이벤트 리스너를 등록합니다.
 * 
 * @param {string} type 
 * @param {(this: Window, ev: any) => any} handler 
 * @param {React.DependencyList | undefined} deps 
 */
function useWindowEvent(type, handler, deps) {
  useEffect(() => {
    type.split(' ').forEach(type => window.addEventListener(type, handler));
    return () => type.split(' ').forEach(type => window.removeEventListener(type, handler));
  }, deps);
}

export default useWindowEvent;