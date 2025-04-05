import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import TransparentButton from '../Button/TransparentButton';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

import './HorizontalScrollableList.scss';
import cx from 'classnames';

const SCROLL_DISABLE = -1;
const SCROLL_START = 0;
const SCROLL_MIDDLE = 1;
const SCROLL_END = 2;

export interface Props {
  className?: string;
  children?: React.ReactNode;
  backgroundColor?: string;
  scrollAmount?: number;
  controlWidth?: number;
  scrollThreshold?: number;
}
/**
 * PC 환경을 지원하는 가로 스크롤링 리스트
 */
function HorizontalScrollableList({
  children,
  backgroundColor = '#ffffff',
  scrollAmount = 300,
  controlWidth = 64,
  scrollThreshold = 3,
}: Props) {
  const [scrollState, setScrollState] = useState(SCROLL_DISABLE);

  const refContent = useRef<HTMLDivElement>(null);

  const loopScrollHandler = useCallback(() => {
    if (!refContent.current) {
      return;
    }

    const { clientWidth, scrollLeft, scrollWidth } = refContent.current;
    if (clientWidth === scrollWidth) {
      setScrollState(SCROLL_DISABLE);
    } else if (scrollLeft < scrollThreshold) {
      setScrollState(SCROLL_START);
    } else if (scrollLeft + clientWidth > scrollWidth - scrollThreshold) {
      setScrollState(SCROLL_END);
    } else {
      setScrollState(SCROLL_MIDDLE);
    }
  }, [scrollState]);

  useEffect(() => {
    const loop = setInterval(loopScrollHandler, 100);
    return () => {
      clearInterval(loop);
    };
  }, [loopScrollHandler]);

  function onClickScroll(rot: 1 | -1) {
    if (refContent.current) {
      refContent.current.scrollTo({
        left: refContent.current.scrollLeft + rot * scrollAmount,
        behavior: 'smooth',
      });
    }
  }

  const listStyle = {
    '--backgroundColor': backgroundColor,
    '--backgroundTransparentColor': backgroundColor + '00',
    '--controlWidth': controlWidth + 'px',
  } as CSSProperties;

  return (
    <div className={cx('HorizontalScrollableList')} style={listStyle}>
      <div className="listWrapper" ref={refContent}>
        {children}
      </div>
      <TransparentButton
        className={cx('btnControl', 'btnScrollLeft', {
          hideBtn: !(scrollState == SCROLL_MIDDLE || scrollState == SCROLL_END),
        })}
        onClick={() => onClickScroll(-1)}
      >
        <KeyboardArrowLeftRoundedIcon fontSize="large" />
      </TransparentButton>
      <TransparentButton
        className={cx('btnControl', 'btnScrollRight', {
          hideBtn: !(
            scrollState == SCROLL_MIDDLE || scrollState == SCROLL_START
          ),
        })}
        onClick={() => onClickScroll(1)}
      >
        <KeyboardArrowRightRoundedIcon fontSize="large" />
      </TransparentButton>
    </div>
  );
}

export default HorizontalScrollableList;
