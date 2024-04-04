import React, { useEffect, useState } from 'react';

import { Waktaverse } from '../../common/constants';
import * as func from '../../common/functions';
import * as videoApi from '../../services/everywak.video';

import HorizontalScrollableList from '../../common/Components/HorizontalScrollableList/HorizontalScrollableList';

import VideoItem from './VideoItem';

import GAEvents from '../../common/GAEvents';

import styles from './VideoContentList.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * @typedef {object} VideoContentListProps
 * @property {string} className
 * @property {{}} options
 * @property {"horizontal"|"card"} type
 * @property {"small"|"normal"} size
 * @property {boolean} shorts
 * @property {boolean} hideProfileCircle
 * @property {string} backgroundColor
 */
/**
 * 
 * @param {VideoContentListProps} props 
 * @returns {JSX.Element}
 */
function VideoContentList(props) {
  const {
    className, options, type, size = "normal", shorts = false, style = 'horizontal', hideProfileCircle = false, 
    backgroundColor = '#ffffff', ...rest
  } = props;

  const [videoList, setVideoList] = useState([]);

  const fetchVideoContent = async () => {

    if (shorts) {
      options.queryTxt = 'horts';
    }

    const response = await videoApi.getVideos(options);
    const { videoList } = response.result;
    
    const urlPrefix = shorts ? 'https://www.youtube.com/shorts/' : 'https://youtu.be/';
    
    if (videoList) {
      setVideoList(videoList.map(item => {
        const target = Waktaverse.find(mb => mb.login_name === item.twitchId);
        const thumbnails = JSON.parse(item.thumbnails);
        const thumbnail = thumbnails.high || thumbnails.medium || thumbnails.default || {url: ''};
        return({
          key: `video-${item.videoId}`,
          href: `${urlPrefix}${item.videoId}`,
          thumbnail: thumbnail.url,
          title: item.title,
          datetime: item.publishedAt * 1000,
          formattedDateTime: func.formatDateTimeString(new Date(item.publishedAt * 1000)),
          author: item.nickname,
          duration: item.duration,
          viewCount: item.viewCount,
          authorProfileImg: target.profileImg?.replace('{size}', '240'),
        });
      }));
    }
  };
  useEffect(() => { fetchVideoContent(); }, [options, shorts]);

  const list = videoList.map(item => <VideoItem {...item} size={size} />);
  return (
    <div className={cx('VideoContentList', className, {shorts, hideProfileCircle})} {...rest}>
      <HorizontalScrollableList backgroundColor={backgroundColor}>
        <ul className="list">
          {list}
        </ul>
      </HorizontalScrollableList>
    </div>
  )
}
  
export default VideoContentList;