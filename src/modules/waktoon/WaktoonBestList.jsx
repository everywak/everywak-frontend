import React, { Component, useEffect, useState } from 'react';

import * as func from '../../common/functions';
import * as service from '../../services/Waktoon';

import WaktoonList from './WaktoonList';
import { WaktoonBigItem } from './WaktoonItem';

import GAEvents from '../../common/GAEvents';

import './WaktoonBestList.scss';
import cx from 'classnames';

const dummyList = [
  {
    key: 'dummy', 
    type: 'waktoon', 
    toonId: '1', 
    thumbnail: '',
    title: '',
    author: '',
    createdDatetime: 0,
    updatedDatetime: 0,
    episodeNumber: '',
    onClick: () => {},
  },
];

function formatWaktoonData(waktoonList) {
  return waktoonList.map(item => ({
    key: item.uuid, 
    type: 'waktoon', 
    toonId: item.uuid, 
    thumbnail: item.thumbnails && item.thumbnails.replace('100_100', '200_200'),
    serialStatus: item.serialStatus,
    title: item.title,
    author: item.authorNickname,
    createdDatetime: item.createdTimeStamp,
    updatedDatetime: item.lastPublishedTimeStamp,
    episodeNumber: item.episodeNumber,
    onClick: () => {},
  }));
}

async function updateWaktoonList() {
  try {
    const res = await service.getWaktoons({});

    if (res.status != 200) { throw res; }

    const {
      waktoonList, waktoonListCount
    } = res.result;
    
    return formatWaktoonData(waktoonList);
  } catch(err) {
    console.error(err);
    return [];
  }
}

function WaktoonBestList(props) {
  const [itemList, setItemList] = useState([]);
  const defaultShowCount = 10;

  useEffect(() => {
    async function fetch() {
      const episodeList = await updateWaktoonList();
      setItemList(episodeList);
    }
    fetch();
  }, []);

  return (
    <WaktoonList 
      className="WaktoonBestList"
      ItemComponent={WaktoonBigItem}
      list={itemList} 
      defaultShowCount={defaultShowCount} 
      maximumShowCount={defaultShowCount}
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

export default WaktoonBestList;