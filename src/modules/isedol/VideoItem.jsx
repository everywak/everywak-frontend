import { Link } from 'react-router-dom';

import CircleImg from '../../common/Components/CircleImg';

import styles from './VideoItem.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function VideoItem(props) {

  const { href, thumbnail, title, datetime, formattedDateTime, author, duration, viewCount, authorProfileImg } = props;
  
  const formattedViewCount = formatViewCount(viewCount || 0);
  const formattedDuration = `0${parseInt((duration || 0) / 60)}`.slice(-2) + ':' + `0${parseInt((duration || 0) % 60)}`.slice(-2);

  return (
    <li className={cx('VideoItem')}>
      <a href={href} target="_blank">
        <div className="previewWrapper">
          <img className="previewImg" src={thumbnail} alt="썸네일" onError={e => {e.target.src = '/images/blank.png'}} />
          {viewCount !== undefined && <span className="viewCount">{formattedViewCount}회 시청</span>}
          {duration !== undefined && <span className="duration">{formattedDuration}</span>}
        </div>
        <div className="infoArea">
          <CircleImg className="profileCircle" src={authorProfileImg} alt="채널 프로필 이미지" />
          <div className="descArea">
            <div className="title">{title}</div>
            <div className="uploadedTime">{formattedDateTime}</div>
          </div>
        </div>
      </a>
    </li>
  );
}

VideoItem.defaultProps = {
  href: '',
  thumbnail: '',
  title: '영상제목',
  datetime: 0,
  author: '',
  duration: undefined, 
  viewCount: undefined, 
  authorProfileImg: '',
};

/**
 * 조회수를 간단하게 변환합니다.
 * 
 * @param {number} viewCount 
 */
function formatViewCount(viewCount) {
  if (viewCount < 10000) {
    return `${viewCount}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  } else if (viewCount < 100000000) {
    return `${(viewCount / 10000).toFixed(1)}만`;
  } else {
    return `${(viewCount / 100000000).toFixed(1)}억`;
  }
}
  
export default VideoItem;