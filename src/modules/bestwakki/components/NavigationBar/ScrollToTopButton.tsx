import React from 'react';

import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';

import { Button } from 'common/components';

import styles from './ScrollToTopButton.module.scss';
import clsx from 'clsx';

/**
 * 페이지 최상단으로 이동하는 버튼
 */
export default function ScrollToTopButton({ show = false }) {
  const gotoTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <Button
      className={clsx('ScrollToTopButton', styles.container, { [styles.show]: show })}
      color="white"
      onClick={gotoTop}
    >
      <KeyboardArrowUpRoundedIcon fontSize="small" />
    </Button>
  );
}
