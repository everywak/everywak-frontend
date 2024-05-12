import React from 'react';
import { Link } from 'react-router-dom';

import BasicImage from '../../common/Components/Image/BasicImage';

import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';

import './WaktoonChartItem.scss';
import cx from 'classnames';

const SECONDS_OF_DAY = 24 * 60 * 60;

function WaktoonChartItem(props) {

  const {
    toonId, thumbnail, title, author, rank, rankAmount, upCountChanged, viewCountChanged, episodeNumber, onClick, highlight
  } = props;

  return (
    <li className={cx('WaktoonChartItem', {highlight: highlight})}>
      <Link to={`/waktoon/episode/${toonId}`} 
        title={title}
        onClick={e => onClick && onClick(e)} target="_blank">
        <div className="rankArea">
          <div className="rank">{rank}</div>
        </div>
        <div className="previewWrapper">
          <BasicImage className="previewImg" src={/*process.env.NODE_ENV !== 'development' &&*/ thumbnail} alt="썸네일" noReferrer />
        </div>
        <div className="infoArea">
          <div className="descArea">
            <div className="titleWrapper">
              <div className="title">{title}{false && episodeNumber && ` ${episodeNumber}화`}</div>
              <div className="changedAmount">
                <FavoriteRoundedIcon fontSize="small" />{upCountChanged}
              </div>
            </div>
            <div className={cx('rankAmount', {up: rankAmount > 0, down: rankAmount < 0, stay: rankAmount == 0, new: rankAmount === 100})}>
              {
                rankAmount !== 100 &&
                (
                  rankAmount == 0 ?
                  <RemoveRoundedIcon fontSize="small" /> :
                  rankAmount > 0 ?
                  <KeyboardArrowUpRoundedIcon fontSize="small" /> :
                  <KeyboardArrowDownRoundedIcon fontSize="small" />
                )
              }
              {
                rankAmount !== 100 ?
                rankAmount != 0 && Math.abs(rankAmount) :
                'NEW'
              }
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

WaktoonChartItem.defaultProps = {
  toonId: '', 
  thumbnail: '',
  title: '제목',
  author: '작가',
  rank: 0,
  rankAmount: 0,
  episodeNumber: '단편', 
  onClick: () => {},
};
  
export default WaktoonChartItem;