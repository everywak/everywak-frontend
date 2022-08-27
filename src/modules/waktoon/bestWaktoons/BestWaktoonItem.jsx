import React from 'react';
import { Link } from 'react-router-dom';

import BasicImage from '../../../common/Components/Image/BasicImage';
import CircleImg from '../../../common/Components/CircleImg';
import HorizontalScrollableList from '../../../common/Components/HorizontalScrollableList/HorizontalScrollableList';

import WaktoonEpisodeList from '../waktoonViewer/WaktoonEpisodeList';

import styles from './BestWaktoonItem.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const SECONDS_OF_DAY = 24 * 60 * 60;

function BestWaktoonItem(props) {

  const {
    toonId, thumbnail, serialStatus, title, author, description, onClick
  } = props;
  
  const serialStatusLabel = {
    continuing: '연재중',
    paused: '휴재',
    ended: '완결'
  }

  return (
    <li className={cx('BestWaktoonItem')}>
      <Link to={`/waktoon/${toonId}`} 
        className="itemHeader" 
        title={title}
        onClick={e => onClick && onClick(e)}>
        <div className="waktoonInfo">
          <div className="thumbnailWrapper">
            <BasicImage src={thumbnail} alt={title + ' 표지'} noReferrer />
          </div>
          <div className="infoArea">
            <div className="summary">
              <span className="ended">{serialStatusLabel[serialStatus || 'continuing']}</span>
              <span className="title">
                {title}
              </span>
              <div className="authorArea">
                <Link className="author">
                  <CircleImg className="authorProfile" src={''} alt="작가 프로필 이미지" />
                  <span className="authorNickname">{author}</span>
                </Link>
              </div>
            </div>
            <div className="description">{description}</div>
          </div>
        </div>
        <div className="ctrArea"></div>
      </Link>
      <ul className="episodeListWrapper">
        <HorizontalScrollableList backgroundColor="#f0f0f0" controlWidth={96} scrollAmount={400}>
          <WaktoonEpisodeList uuid={toonId} defaultShowCount={10} searchOptions={{keyword: ''}} />
        </HorizontalScrollableList>
      </ul>
    </li>
  );
}

BestWaktoonItem.defaultProps = {
  toonId: '', 
  thumbnail: '',
  title: '제목',
  author: '작가',
  rank: 0,
  rankAmount: 0,
  episodeNumber: '단편', 
  onClick: () => {},
};
  
export default BestWaktoonItem;