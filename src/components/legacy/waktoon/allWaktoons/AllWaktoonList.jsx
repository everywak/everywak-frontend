import React, { Component, useEffect, useState } from 'react';

import * as service from '../../../services/Waktoon';

import WaktoonList from '../WaktoonList';
import { WaktoonItem } from '../WaktoonItem';
import WaktoonListItem from '../WaktoonListItem';

//import GAEvents from 'common/GAEvents';

import './AllWaktoonList.scss';
import cx from 'classnames';

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
    viewCount: item.viewCount,
    upCount: item.upCount,
    tags: [item.type === 'best' && 'best', item.title.match(/^\[왁숲\]/) && 'wakforest'].filter(
      (tag) => tag,
    ),
    onClick: () => {},
  }));
}

async function updateWaktoonEpisodeList(query) {
  try {
    const res = await await service.getWaktoonEpisodes(query);

    if (res.status != 200) {
      throw res;
    }

    const { waktoonEpisodeList, ...rest } = res.result;

    return {
      waktoonEpisodeList: formatWaktoonEpisodeData(waktoonEpisodeList),
      ...rest,
    };
  } catch (err) {
    console.error(err);
    return [];
  }
}

function AllWaktoonList({ viewType, defaultShowCount = 50, searchOptions, onChange = () => {} }) {
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    async function fetch({ searchOptions }) {
      const { waktoonEpisodeList: episodeList, pagination } = await updateWaktoonEpisodeList({
        ...searchOptions,
      });

      onChange({
        searchOptions,
        pagination,
      });

      setItemList(episodeList);
    }
    fetch({ searchOptions });
  }, [searchOptions]);

  return (
    <WaktoonList
      className={cx('AllWaktoonList', { item: viewType === 'item', list: viewType === 'list' })}
      ItemComponent={viewType === 'item' ? WaktoonItem : WaktoonListItem}
      list={itemList}
      defaultShowCount={defaultShowCount}
      maximumShowCount={1}
    />
  );
}

export default AllWaktoonList;
