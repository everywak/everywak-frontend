import React, { Component, useEffect, useState } from 'react';

import * as service from '../../../services/Waktoon';

import WaktoonList from '../WaktoonList';
import { WaktoonEpisodeItem } from '../WaktoonItem';

import GAEvents from '../../../common/GAEvents';

import './WaktoonEpisodeList.scss';
import cx from 'classnames';

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

async function updateWaktoonEpisodeList(uuid, page = 1) {
  try {
    const res = await await service.getWaktoonEpisodes({ queryTarget: 'parent', queryTxt: uuid });

    if (res.status != 200) { throw res; }

    const {
      waktoonEpisodeList, waktoonEpisodeCount
    } = res.result;
    
    return formatWaktoonEpisodeData(waktoonEpisodeList);
  } catch(err) {
    console.error(err);
    return [];
  }
}

function WaktoonEpisodeList({ uuid }) {
  const [itemList, setItemList] = useState([]);
  const defaultShowCount = 50;

  useEffect(() => {
    async function fetch() {
      const episodeList = await updateWaktoonEpisodeList(uuid);
      setItemList(episodeList);
    }
    fetch();
  }, []);

  return (
    <WaktoonList 
      className="WaktoonEpisodeList"
      ItemComponent={WaktoonEpisodeItem}
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