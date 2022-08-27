import React from 'react';
import { Link } from 'react-router-dom';

import BasicImage from '../../common/Components/Image/BasicImage';

import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';

import styles from './WaktoonChartLargeItem.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const SECONDS_OF_DAY = 24 * 60 * 60;

function WaktoonChartLargeItem(props) {

  const {
    toonId, thumbnail, title, author, rank, rankAmount, createdDatetime, 
    upCount, viewCount, commentCount, upCountChanged, viewCountChanged, commentCountChanged, 
    episodeNumber, onClick
  } = props;

  return (
    <li className={cx('WaktoonChartLargeItem')}>
      <Link to={`/waktoon/episode/${toonId}`} onClick={e => onClick && onClick(e)}>
        <div className="rankArea">
          <div className="rank">{rank}</div>
        </div>
        <div className="previewWrapper">
          <BasicImage className="previewImg" src={/*process.env.NODE_ENV !== 'development' &&*/ thumbnail} alt="썸네일" noReferrer />
        </div>
        <div className="infoArea">
          <div className="descArea">
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
            <div className="titleWrapper">
              <div className="title">
                {title}{false && episodeNumber && ` ${episodeNumber}화`}
                <div className="author">{author}</div></div>
              <div className="changedAmount">
                <FavoriteRoundedIcon fontSize="small" />{upCountChanged}+
              </div>
              <div className="changedAmount">
                <VisibilityRoundedIcon fontSize="small" />{viewCountChanged}+
              </div>
              <div className="changedAmount">
                <CommentRoundedIcon fontSize="small" />{commentCountChanged}+
              </div>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

WaktoonChartLargeItem.defaultProps = {
  toonId: '', 
  thumbnail: '',
  title: '제목',
  author: '작가',
  rank: 0,
  rankAmount: 0,
  episodeNumber: '단편', 
  onClick: () => {},
};
  
export default WaktoonChartLargeItem;