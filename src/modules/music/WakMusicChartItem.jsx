import React from 'react';

import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

import BasicImage from '../../common/Components/Image/BasicImage';

import styles from './WakMusicChartItem.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 
 * @param {{rank: number, title: string, author: string, thumbnail: string, href: string}} props 
 * @returns {JSX.Element}
 */
function WakMusicChartItem({ rank, title, author, thumbnail, href }) {

  return (
    <a className="WakMusicChartItem" href={href} target="_blank">
      <div className="rank">{rank}</div>
      <BasicImage className="thumbnail" src={thumbnail} noReferrer />
      <div className="infoWrapper">
        <div className="title">{title}</div>
        <div className="author">{author}</div>
      </div>
      <KeyboardArrowRightRoundedIcon className="moreIcon" fontSize="small" />
    </a>
  );
}

export default WakMusicChartItem;