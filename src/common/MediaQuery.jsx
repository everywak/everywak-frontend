import React from 'react';
import { useMediaQuery } from 'react-responsive';

import * as DeviceWidth from './constants';

/**
 * 데스크탑 환경에서만 표시됩니다.
 * 
 * @param {{children: ReactNode}} props 
 * @returns {JSX.Element}
 */
export function Desktop({ children }) {

  const isDesktop = useMediaQuery({ minWidth: DeviceWidth.tabletSmallWidth });

  return (<>
    { isDesktop && children }
  </>)
}
/**
 * 데스크탑이 아닌 환경에서만 표시됩니다.
 * 
 * @param {{children: JSX.Element|String}} props 
 * @returns {JSX.Element}
 */
export function NotDesktop({ children }) {

  const isNotDesktop = useMediaQuery({ maxWidth: DeviceWidth.tabletSmallWidth - 1 });

  return (<>
    { isNotDesktop && children }
  </>)
}
/**
 * 태블릿 환경에서만 표시됩니다.
 * 
 * @param {{children: JSX.Element|String}} props 
 * @returns {JSX.Element}
 */
export function Tablet({ children }) {

  const isTablet = useMediaQuery({ minWidth: DeviceWidth.mobileLargeWidth, maxWidth: DeviceWidth.tabletSmallWidth - 1 });

  return (<>
    { isTablet && children }
  </>)
}
/**
 * 모바일 환경에서만 표시됩니다.
 * 
 * @param {{children: JSX.Element|String}} props 
 * @returns {JSX.Element}
 */
export function Mobile({ children }) {

  const isMobile = useMediaQuery({ maxWidth: DeviceWidth.mobileLargeWidth - 1 });

  return (<>
    { isMobile && children }
  </>)
}