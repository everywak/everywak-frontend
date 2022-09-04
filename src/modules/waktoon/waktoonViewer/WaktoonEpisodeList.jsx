import React, { Component, useEffect, useState } from 'react';

import * as func from '../../../common/funtions';
import * as service from '../../../services/Waktoon';

import WaktoonList from '../WaktoonList';
import { WaktoonItem, WaktoonEpisodeItem } from '../WaktoonItem';

//import GAEvents from '../../../common/GAEvents';

import styles from './WaktoonEpisodeList.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function formatWaktoonEpisodeData(waktoonEpisodeList) {
  return waktoonEpisodeList.map(item => ({
    key: item.articleId, 
    type: 'episode', 
    toonId: item.articleId, 
    thumbnail: item.thumbnails && item.thumbnails.replace('100_100', '200_200'),
    title: item.title,
    author: item.authorNickname,
    createdDatetime: item.publishedTimeStamp,
    updatedDatetime: 0,
    episodeNumber: item.episodeNumber,
    onClick: () => {},
  }));
}

async function updateWaktoonEpisodeList(query) {
  try {
    const res = await await service.getWaktoonEpisodes(query);

    if (res.status != 200) { throw res; }

    const {
      waktoonEpisodeList, ...rest
    } = res.result;
    
    return ({
      waktoonEpisodeList: formatWaktoonEpisodeData(waktoonEpisodeList),
      ...rest,
    });
  } catch(err) {
    console.error(err);
    return [];
  }
}

function WaktoonEpisodeList({ toonTitle, uuid, viewType = 'item', defaultShowCount = 50, searchOptions, onChange = () => {} }) {
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    async function fetchWithParent({ toonTitle, uuid, searchOptions }) {
      const { waktoonEpisodeList: episodeList, pagination } = await updateWaktoonEpisodeList({ queryTarget: 'parent', queryTxt: uuid });
  
      if (searchOptions.orderBy === 'time_oldest') {
        episodeList.reverse();
      }
      onChange({
        searchOptions,
        pagination,
      });
      setItemList(
        episodeList
        .filter(item => item.title.includes(searchOptions.keyword))
        .map(item => (item.title = toonTitle ? item.title.replace(toonTitle, '').trim() : item.title, item))
      );
    }
    async function fetchWithoutParent({ searchOptions }) {
      const { waktoonEpisodeList: episodeList, pagination } = await updateWaktoonEpisodeList({ ...searchOptions });

      onChange({
        searchOptions,
        pagination,
      });
      
      setItemList(episodeList);
    }
    if (uuid) {
      fetchWithParent({ toonTitle, uuid, searchOptions });
    } else {
      fetchWithoutParent({ searchOptions });
    }
  }, [toonTitle, uuid, searchOptions]);

  return (
    <WaktoonList 
      className={cx('WaktoonEpisodeList', {list: viewType === 'list', item: viewType === 'item'})} 
      ItemComponent={viewType === 'list' ? WaktoonEpisodeItem : WaktoonItem} 
      list={itemList} 
      defaultShowCount={defaultShowCount} 
      maximumShowCount={1}
      gaEventOnClickMore={{
        //category: GAEvents.Category.isedol,
        //action: GAEvents.Action.isedol.moreClip,
      }}
      gaEventOnClickItem={{
        //category: GAEvents.Category.isedol,
        //action: GAEvents.Action.isedol.viewClip,
      }} />
  );
}

export default WaktoonEpisodeList;