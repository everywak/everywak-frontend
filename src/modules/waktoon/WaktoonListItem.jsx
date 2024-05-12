import React from 'react';
import { Link } from 'react-router-dom';

import BasicImage from '../../common/Components/Image/BasicImage';

import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';

import './WaktoonListItem.scss';
import cx from 'classnames';

const SECONDS_OF_DAY = 24 * 60 * 60;

/**
 * 
 * @param {{
 * type: 'waktoon'|'episode',
 * tags: String[],
 * thumbnail: String, 
 * title: String, 
 * author: String, 
 * createdDatetime: Number, 
 * updatedDatetime: Number, 
 * episodeNumber: String, 
 * viewCount: Number, 
 * upCount: Number, 
 * onClick: Function, 
 * }} props 
 * @returns 
 */
function WaktoonListItem(props) {

  const {
    type, toonId, tags, thumbnail, title, author, createdDatetime, updatedDatetime, episodeNumber, viewCount, upCount, onClick
  } = props;

  return (
    <li className={cx('WaktoonListItem')}>
      <Link to={(type == 'waktoon' ? '/waktoon/' : '/waktoon/episode/') + toonId } 
        target={(type == 'waktoon' ? '_self' : '_blank')} 
        title={title}
        onClick={e => onClick && onClick(e)}>
        <div className="previewWrapper">
          <BasicImage className="previewImg" src={process.env.NODE_ENV !== 'development' && thumbnail} alt="썸네일" noReferrer />
        </div>
        <div className="infoArea">
          <div className="descArea">
            <div className="titleWrapper">
              {Date.now() / 1000 - 3 * SECONDS_OF_DAY < (type === 'waktoon' ? updatedDatetime : createdDatetime) && <div className="icon newIcon">N</div>}
              {
                episodeNumber && episodeNumber != 'single' && 
                <span className="icon episodeNumber">{`${episodeNumber}화`}</span>
              }
              <span className="title">{title}</span>
            </div>
            <div className="author">{author}</div>
          </div>
          <div className="tagArea">
            <ul className="tagList">
              {tags.includes('wakforest') && <WakforestTag />}
              {tags.includes('best') && <BestTag />}
            </ul>
            <div className="popularityArea">
              <div className="popularity view"><VisibilityRoundedIcon /><span>{viewCount > 9999 ? `${parseInt(viewCount / 1000) / 10}만` : viewCount}</span></div>
              <div className="popularity up"><FavoriteRoundedIcon /><span>{upCount}</span></div>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

function BestTag() {
  return (
    <li className="tag BestTag">베스트</li>
  )
}
function WakforestTag() {
  return (
    <li className="tag WakforestTag">왁숲</li>
  )
}
export default WaktoonListItem;