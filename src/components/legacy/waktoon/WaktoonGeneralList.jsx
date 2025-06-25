import React, { useEffect, useState } from 'react';

import * as service from '@/services/Waktoon';

import WaktoonList from './WaktoonList';

import './WaktoonGeneralList.scss';

const dummyList = [
  {
    toonId: '1',
    thumbnail: '/images/waktoon_dummy/1.jpg',
    title: 'B챤만화',
    author: '뉴단',
    createdDatetime: 0,
    updatedDatetime: 0,
    episodeNumber: '7',
    onClick: () => {},
  },
];

function formatWaktoonEpisodeData(waktoonEpisodeList) {
  return waktoonEpisodeList.map((item) => ({
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

async function updateWaktoonEpisodeList(page = 1) {
  try {
    const res = await service.getWaktoonEpisodes({});

    if (res.status !== 200) {
      throw res;
    }

    const { waktoonEpisodeList, waktoonEpisodeCount } = res.result;

    return formatWaktoonEpisodeData(waktoonEpisodeList);
  } catch (err) {
    console.error(err);
    return [];
  }
}

function WaktoonGeneralList(props) {
  const [itemList, setItemList] = useState([]);
  const defaultShowCount = 18;

  useEffect(() => {
    async function fetch() {
      const episodeList = await updateWaktoonEpisodeList();
      setItemList(episodeList);
    }
    fetch();
  }, []);

  return (
    <WaktoonList
      className="WaktoonGeneralList"
      list={itemList}
      defaultShowCount={defaultShowCount}
      perPageCount={12}
      maximumShowCount={30}
      gaEventOnClickMore={
        {
          //category: GAEvents.Category.isedol,
          //action: GAEvents.Action.isedol.moreClip,
        }
      }
      gaEventOnClickItem={
        {
          //category: GAEvents.Category.isedol,
          //action: GAEvents.Action.isedol.viewClip,
        }
      }
    />
  );
}

export default WaktoonGeneralList;
