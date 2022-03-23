import React from 'react';
import RemoveRedEyeRoundedIcon from '@material-ui/icons/RemoveRedEyeRounded';

import styles from './ViewerCounter.scss';

export default function ViewerCounter({viewer = 0}) {
  const formattedViewer = viewer.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
  return (<div className="ViewerCounter">
    <RemoveRedEyeRoundedIcon fontSize="small" />
    <span className="counterWrapper">
      {formattedViewer}
    </span>
  </div>);
}
