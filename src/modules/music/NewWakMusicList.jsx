import React, { Component, useEffect, useState } from 'react';

import VideoItem from '../isedol/VideoItem';

import HorizontalScrollableList from '../../common/components/legacy/HorizontalScrollableList/HorizontalScrollableList';
import Spinner from 'common/components/legacy/Spinner';

import * as func from '../../common/functions';
import * as service from '../../services/Music';

import './NewWakMusicList.scss';

const now = new Date();
const lastWeek = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate() - ((now.getDay() + 1) % 7) - 7,
);

function NewWakMusicList() {
  const [isLoading, setLoading] = useState(true);
  const [musicList, setMusicList] = useState([]);

  const updateNewWakMusic = async (reset = true) => {
    const { musicList, musicCount } = (
      await service.getWakMusics({
        viewerRange: 'all',
        orderBy: 'time',
        perPage: 30,
        beginAt: parseInt(lastWeek.getTime() / 1000),
      })
    ).result;

    if (musicList) {
      setMusicList(
        musicList.map((item, i) => {
          return {
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
          };
        }),
      );
      setLoading(false);
    }
  };
  useEffect(() => {
    updateNewWakMusic();
  }, []);

  if (isLoading) {
    return (
      <div className="NewWakMusicList">
        <HorizontalScrollableList backgroundColor="var(--color-background-white)">
          <ul className="list">
            <Spinner className="spinner" />
          </ul>
        </HorizontalScrollableList>
      </div>
    );
  }

  const list = musicList.map((item) => <VideoItem {...item} hideThumbnail />);
  return (
    <div className="NewWakMusicList">
      <HorizontalScrollableList backgroundColor="var(--color-background-white)">
        {list.length > 0 ? (
          <ul className="list">{list}</ul>
        ) : (
          <div className="empty">최근 2주간 신곡이 올라오지 않았어요.</div>
        )}
      </HorizontalScrollableList>
    </div>
  );
}

export default NewWakMusicList;
