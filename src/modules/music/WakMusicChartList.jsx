import React, { Component, useEffect, useState } from 'react';

import { Waktaverse } from '../../common/constants';

import WakMusicChartItem from './WakMusicChartItem';

import * as service from '../../services/Music';

import styles from './WakMusicChartList.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function WakMusicChartList(props) {
  const [isLoading, setLoading] = useState(true);
  const [musicList, setMusicList] = useState([]);

  const updateWakMusicChart = async (reset = true) => {

    const { musicList, musicCount } = (await service.getWakMusics({ viewerRange: 'daily', orderBy: 'view', perPage: 10 })).result;
    
    if (musicList) {
      setMusicList(musicList.map((item, i) => {
        return({
          key: `wakMusicItem-${i}-${item.uuid}`,
          rank: i + 1,
          href: `https://youtu.be/${item.videoId}`,
          thumbnail: item.thumbnail,
          title: item.title,
          datetime: item.publishedTimeStamp,
          author: item.singer,
          duration: item.duration,
          viewCount: item.viewCountChanged,
        });
      }));
      setLoading(false);
    }
  };
  useEffect(() => { updateWakMusicChart(); }, []);

  const list = musicList.map(item => <WakMusicChartItem {...item} hideThumbnail />);
  return (
    <div className="WakMusicChartList">
      <ul className="list">
        {list.slice(0, 5)}
      </ul>
      <ul className="list">
        {list.slice(5, 10)}
      </ul>
    </div>
  )
}
  
export default WakMusicChartList;