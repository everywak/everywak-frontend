import React from 'react';

import { Link } from 'react-router-dom';

import BasicImage from '../../common/Components/Image/BasicImage';

import styles from './WaktoonItem.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const SECONDS_OF_DAY = 24 * 60 * 60;

function WaktoonItem(props) {

  const {
    type, size, toonId, thumbnail, title, author, createdDatetime, updatedDatetime, episodeNumber, onClick
  } = props;

  return (
    <li className={cx('WaktoonItem', size)}>
      <Link to={(type == 'waktoon' ? '/waktoon/' : '/waktoon/episode/') + toonId } target={(type == 'waktoon' ? '_self' : '_blank')} onClick={e => onClick && onClick(e)}>
        <div className="previewWrapper">
          <BasicImage className="previewImg" src={process.env.NODE_ENV !== 'development' && thumbnail} alt="썸네일" noReferrer />
          <span className="episodeNumber">{episodeNumber && episodeNumber != 'single' ? `${episodeNumber}화` : '단편'}</span>
          <div className="iconArea">
            {Date.now() / 1000 - 3 * SECONDS_OF_DAY < createdDatetime && <div className="icon newIcon">NEW</div>}
            {Date.now() / 1000 - 3 * SECONDS_OF_DAY < updatedDatetime && <div className="icon updatedIcon">UP</div>}
          </div>
        </div>
        <div className="infoArea">
          <div className="descArea">
            <div className="title">{title}</div>
            <div className="author">{author}</div>
            <div className="publishedTime">{new Date(createdDatetime * 1000).toLocaleDateString('ko-KR')}</div>
          </div>
        </div>
      </Link>
    </li>
  );
}

function WaktoonBigItem({size, ...props}) {
  return <WaktoonItem size="big" {...props} />
}

function WaktoonEpisodeItem({size, ...props}) {
  return <WaktoonItem size="episode" {...props} />
}

WaktoonItem.defaultProps = {
  toonId: '', 
  thumbnail: '',
  title: '제목',
  author: '작가',
  createdDatetime: 0,
  updatedDatetime: 0,
  episodeNumber: '단편', 
  onClick: () => {},
};
  
export {WaktoonItem, WaktoonBigItem, WaktoonEpisodeItem};