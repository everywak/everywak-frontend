import React, { useEffect, useState } from 'react';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';

import styles from './ViewerCounter.scss';

export default function ViewerCounter({viewer = 0}) {

  const [maxViewer, setMaxViewer] = useState(0);

  useEffect(() => {
    if (viewer > maxViewer) {
      setMaxViewer(viewer);
    }
  }, [viewer]);
  const formattedViewer = viewer.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
  const formattedMaxViewer = maxViewer.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
  return (<div className="ViewerCounter">
    <RemoveRedEyeRoundedIcon fontSize="small" />
    <span className="counterWrapper">
      {formattedViewer}
    </span>
    <div className="maxViewerWrapper">
      최고 시청자수: {formattedMaxViewer}명
    </div>
  </div>);
}
