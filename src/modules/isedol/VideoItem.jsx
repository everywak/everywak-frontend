import React from 'react';
import { Link } from 'react-router-dom';

import { formatNumberShort } from '../../common/functions';
import BasicImage from '../../common/components/legacy/Image/BasicImage';
import CircleImg from '../../common/components/legacy/CircleImg';

import './VideoItem.scss';
import cx from 'classnames';

function VideoItem(props) {
  const {
    href,
    thumbnail,
    title,
    datetime,
    formattedDateTime,
    author,
    duration,
    viewCount,
    authorProfileImg,
    onClick,
    hideThumbnail,
    size = 'medium',
  } = props;

  const formattedViewCount = formatNumberShort(viewCount || 0);
  const formattedDuration =
    `${(duration || 0) / 60 > 60 ? '' + parseInt((duration || 0) / 3600) + ':' : ''}` +
    `0${parseInt((duration || 0) / 60) % 60}`.slice(-2) +
    ':' +
    `0${parseInt((duration || 0) % 60)}`.slice(-2);

  return (
    <li className={cx('VideoItem', { small: size === 'small' })}>
      {href.match(/^http/) ? (
        <a href={href} target="_blank" onClick={(e) => onClick && onClick(e)}>
          <div className="previewWrapper">
            <BasicImage className="previewImg" src={thumbnail} />
            {viewCount !== undefined && (
              <span className="viewCount">{formattedViewCount}회 시청</span>
            )}
            {duration !== undefined && <span className="duration">{formattedDuration}</span>}
          </div>
          <div className={cx('infoArea', { hideThumbnail })}>
            <CircleImg className="profileCircle" src={authorProfileImg} alt="채널 프로필 이미지" />
            <div className="descArea">
              <div className="title">{title}</div>
              <div className="uploadedTime">{formattedDateTime}</div>
            </div>
          </div>
        </a>
      ) : (
        <Link to={href} onClick={(e) => onClick && onClick(e)}>
          <div className="previewWrapper">
            <BasicImage className="previewImg" src={thumbnail} />
            {viewCount !== undefined && (
              <span className="viewCount">{formattedViewCount}회 시청</span>
            )}
            {duration !== undefined && <span className="duration">{formattedDuration}</span>}
          </div>
          <div className={cx('infoArea', { hideThumbnail })}>
            <CircleImg className="profileCircle" src={authorProfileImg} alt="채널 프로필 이미지" />
            <div className="descArea">
              <div className="title">{title}</div>
              <span className="viewCount">조회수 {formattedViewCount}회</span>
              <div className="uploadedTime">{formattedDateTime}</div>
            </div>
          </div>
        </Link>
      )}
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

export default VideoItem;
