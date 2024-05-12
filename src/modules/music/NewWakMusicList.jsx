import React, { Component, useEffect, useState } from 'react';

import VideoItem from '../isedol/VideoItem';

import HorizontalScrollableList from '../../common/Components/HorizontalScrollableList/HorizontalScrollableList';

import * as func from '../../common/functions';
import * as service from '../../services/Music';

import GAEvents from '../../common/GAEvents';

import './NewWakMusicList.scss';
import cx from 'classnames';

const now = new Date();
const lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (now.getDay() + 1) % 7 - 7);

function NewWakMusicList(props) {
  const [isLoading, setLoading] = useState(true);
  const [musicList, setMusicList] = useState([]);

  const updateNewWakMusic = async (reset = true) => {

    const { musicList, musicCount } = (await service.getWakMusics({ viewerRange: 'all', orderBy: 'time', perPage: 30, beginAt: parseInt(lastWeek.getTime() / 1000) })).result;
    
    if (musicList) {
      setMusicList(musicList.map((item, i) => {
        return({
          key: `wakMusicItem-${item.uuid}`,
          rank: i + 1,
          href: `https://youtu.be/${item.videoId}`,
          thumbnail: item.thumbnail,
          title: item.title,
          datetime: item.publishedTimeStamp,
          formattedDateTime: func.formatDateTimeString(new Date(item.publishedTimeStamp)),
          author: item.singer,
          duration: item.duration,
          viewCount: item.viewCountChanged,
        });
      }));
      setLoading(false);
    }
  };
  useEffect(() => { updateNewWakMusic(); }, []);

  const list = musicList.map(item => <VideoItem {...item} hideThumbnail />);
  return (
    <div className="NewWakMusicList">
      <HorizontalScrollableList>
        <ul className="list">
          {list}
        </ul>
      </HorizontalScrollableList>
    </div>
  )
}
  
export default NewWakMusicList;