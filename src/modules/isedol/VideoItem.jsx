import React from 'react';
import { Link } from 'react-router-dom';

import styles from './VideoItem.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function VideoItem(props) {

  const { href, thumbnail, title, datetime, formattedDateTime, author, authorProfileImg } = props;
  
  return (
    <li className={cx('VideoItem')}>
      <a href={href} target="_blank">
        <div className="previewWrapper">
          <img className="previewImg" src={'/images/blank.png'} alt="썸네일" onError={e => {e.target.src = '/images/blank.png'}} />
        </div>
        <div className="infoArea">
          <div className="profileCircle">
              <img src={authorProfileImg} alt="채널 프로필 이미지" className="profileImg" onError={e => {e.target.src = '/images/blank.png'}} />
          </div>
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
  authorProfileImg: '',
};
  
export default VideoItem;