import React, { useEffect, useState } from 'react';

import { Waktaverse } from '../../common/constants';
import * as func from '../../common/functions';
import * as service from '../../services/Isedol';

import VideoList from '../isedol/VideoList';

import './RecommendClipList.scss';
import cx from 'classnames';

function RecommendClipList({ clipInfo }) {

  const [clipList, setClipList] = useState([]);
  
  const fetchTwitchClips = async () => {

    const targetRange = parseInt(Math.random() * 30 - 15);

    const { videoList, videoCount } = await service.getTwitchClips({
      twitchId: clipInfo.twitchId, 
      beginAt: clipInfo.publishedAt + (targetRange - 7) * 24 * 60 * 60,
      endAt: clipInfo.publishedAt + (targetRange + 7) * 24 * 60 * 60,
    });
    
    if (videoList) {
      setClipList(videoList.map(item => {
        const target = Waktaverse.find(mb => mb.login_name == item.twitchId);
        const thumbnails = JSON.parse(item.thumbnails);
        const thumbnail = thumbnails.high || thumbnails.medium || thumbnails.default || {url: ''};
        return({
          key: `isedolClipItem-${item.videoId}`,
          href: `/video/watch/${item.videoId}`,
          thumbnail: `https://api.everywak.kr/clip/thumbnail/${item.videoId}`,//thumbnail.url,
          title: item.title,
          datetime: item.publishedAt * 1000,
          formattedDateTime: func.formatDateTimeString(new Date(item.publishedAt * 1000)),
          author: item.nickname,
          duration: item.duration,
          viewCount: item.viewCount,
          authorProfileImg: target.profileImg ? target.profileImg.replace('{size}', '240') :'',
        });
      }).sort(_ => Math.random() * 2 - 1));
    }
  }
  useEffect(() => {
    if (clipInfo && clipInfo.videoId) {
      fetchTwitchClips();
    }
  }, [clipInfo.twitchId, clipInfo.videoId]);
  console.log(clipList)

  return (
    <VideoList 
      list={clipList} 
      defaultShowCount={15} 
      listStyle="list" />
  );
}
  
export default RecommendClipList;