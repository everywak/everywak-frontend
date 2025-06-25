import React, { useEffect, useState } from 'react';
import { RemoveRedEyeRounded } from '@mui/icons-material';
import clsx from 'clsx';

import { formatNumberWithCommas } from '@/common/functions';

import styles from './ViewerCounter.module.scss';

export const ViewerCounter = ({ viewer = 0 }) => {
  const [maxViewer, setMaxViewer] = useState(0);

  useEffect(() => {
    if (viewer > maxViewer) {
      setMaxViewer(viewer);
    }
  }, [viewer]);
  const formattedViewer = formatNumberWithCommas(viewer);
  const formattedMaxViewer = formatNumberWithCommas(maxViewer);
  return (
    <div className={clsx('ViewerCounter', styles.container)}>
      <RemoveRedEyeRounded fontSize="small" />
      <span className={styles.counterWrapper}>{formattedViewer}</span>
      <div className={styles.maxViewer}>최고 시청자수: {formattedMaxViewer}명</div>
    </div>
  );
};
