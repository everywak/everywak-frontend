import React, { Component, useEffect, useState } from 'react';

import * as service from '../../../services/Waktoon';

import WaktoonList from '../WaktoonList';
import BestWaktoonItem from './BestWaktoonItem';

//import GAEvents from '../../../common/GAEvents';

import './BestWaktoonList.scss';
import cx from 'classnames';

function formatWaktoonData(waktoonList) {
  return waktoonList.map((item) => ({
    key: item.uuid,
    toonId: item.uuid,
    thumbnail: item.thumbnails && item.thumbnails.replace('100_100', '200_200'),
    serialStatus: item.serialStatus,
    title: item.title,
    author: item.authorNickname,
    description: item.description,
    createdDatetime: item.createdTimeStamp,
    updatedDatetime: item.lastPublishedTimeStamp,
    episodeNumber: item.episodeNumber,
    onClick: () => {},
  }));
}

async function updateWaktoonList(query) {
  try {
    const res = await await service.getWaktoons(query);

    if (res.status != 200) {
      throw res;
    }

    const { waktoonList, ...rest } = res.result;

    return {
      waktoonList: formatWaktoonData(waktoonList),
      ...rest,
    };
  } catch (err) {
    console.error(err);
    return { waktoonList: [], pagination: {} };
  }
}

function BestWaktoonList({ defaultShowCount, searchOptions, onChange }) {
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    async function fetchBestWaktooons({ searchOptions }) {
      const { waktoonList, pagination } = await updateWaktoonList({ ...searchOptions });

      onChange({
        searchOptions,
        pagination,
      });

      setItemList(waktoonList);
    }
    fetchBestWaktooons({ searchOptions });
  }, [searchOptions]);

  return (
    <WaktoonList
      className="BestWaktoonList"
      ItemComponent={BestWaktoonItem}
      list={itemList}
      defaultShowCount={defaultShowCount}
      maximumShowCount={8}
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

export default BestWaktoonList;
