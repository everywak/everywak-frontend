import React, { useEffect, useState } from 'react';

import SkeletonLoader from '../../common/Components/SkeletonLoader';

//import * as func from '../../common/funtions';
import * as service from '../../services/Waktoon';

import WaktoonList from './WaktoonList';
import WaktoonChartItem from './WaktoonChartItem';
import WaktoonChartLargeItem from './WaktoonChartLargeItem';

//import GAEvents from '../../common/GAEvents';

import styles from './WaktoonChartList.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * @typedef WaktoonChartItemData
 * @property {String} toonId
 * @property {String} thumbnail
 * @property {String} title
 * @property {String} author
 * @property {Number} rank
 * @property {Number} rankAmount
 * @property {String} episodeNumber
 * @property {Number} viewCountChanged
 * @property {Number} upCountChanged
 * @property {Number} commentCountChanged
 * @property {Function} onClick
 */

const SECONDS_OF_DAY = 24 * 60 * 60;

/**
 * 
 * @param {any[]} beforeList 
 * @param {any[]} afterList 
 * @returns {WaktoonChartItemData[]}
 */
function formatWaktoonEpisodeChartData(beforeList, afterList) {
  return afterList.map((item, i) => {

    const prevRank = beforeList.findIndex(beforeItem => beforeItem.articleId === item.articleId);

    return ({
      toonId: item.articleId, 
      thumbnail: item.thumbnails && item.thumbnails.replace('100_100', '200_200'),
      title: item.title,
      author: item.authorNickname,
      rank: i + 1,
      rankAmount: prevRank !== -1 ? prevRank - i : 100,
      episodeNumber: item.episodeNumber,
      createdDatetime: item.createdTimeStamp,
      viewCountChanged: item.viewCountChanged,
      upCountChanged: item.upCountChanged,
      commentCountChanged: item.commentCountChanged,
      viewCount: item.viewCount,
      upCount: item.upCount,
      commentCount: item.commentCount,
      onClick: () => {},
    })
  });
}

const durationPreset = {
  daily: 1,
  weekly: 7,
  monthly: 30,
}
async function updateWaktoonEpisodeChart({orderBy = 'up', duration = 'daily'}) {
  try {

    const now = parseInt(Date.now() / 1000 / 3600) * 3600;

    const targetDuration = SECONDS_OF_DAY * (durationPreset[duration] || 1);
  
    const resToday = await service.getWaktoonEpisodeChart({ orderBy, perPage: 100, after: now, before: now - targetDuration });
    const resYesterday = await service.getWaktoonEpisodeChart({ orderBy, perPage: 100, after: now - targetDuration, before: now - 2 * targetDuration });
  
    if (resToday.status !== 200)     { throw resToday; }
    if (resYesterday.status !== 200) { throw resYesterday; }

    const todayChart     = resToday.result.waktoonEpisodeChartList;
    const yesterdayChart = resYesterday.result.waktoonEpisodeChartList;

    return formatWaktoonEpisodeChartData(yesterdayChart, todayChart);

  } catch(err) {
    console.error(err);
    return [];
  }
}

const skeletonDefault = 
<li className={cx('WaktoonChartItem', 'skeleton')}>
  <a>
    <div className="rankArea skeletonItem">00</div>
    <div className="previewWrapper skeletonItem"/>
    <div className="infoArea">
      <div className="descArea">
        <div className="titleWrapper">
          <div className="title skeletonItem">asdfasdfasdfasdf</div>
          <div className="changedAmount skeletonItem">asdfasdf</div>
        </div>
        <div className={cx('rankAmount', 'new', 'skeletonItem')}>aa</div>
      </div>
    </div>
  </a>
</li>;
const skeletonLarge = 
<li className="WaktoonChartLargeItem skeleton">
  <a>
    <div className="rankArea skeletonItem">00</div>
    <div className="previewWrapper skeletonItem"/>
    <div className="infoArea">
      <div className="descArea">
        <div className={cx('rankAmount', 'new')}><span className="skeletonItem">aaa</span></div>
        <div className="titleWrapper">
          <div className="title"><span className="skeletonItem">asdfasdfasdfasdfasdf</span><div className="author skeletonItem">asdfasdf</div></div>
          <div className="changedAmount skeletonItem">asdfasdf</div>
          <div className="changedAmount skeletonItem">asdfasdf</div>
          <div className="changedAmount skeletonItem">asdfasdf</div>
        </div>
      </div>
    </div>
  </a>
</li>;

function WaktoonChartList({type, defaultShowCount = 8, size = 'default', orderBy = 'up', duration = 'daily', keyword = ''}) {
  const [itemList, setItemList] = useState([]);
  const [filteredItemList, setfilteredItemList] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function fetchAndUpdateChart({orderBy, duration}) {
      const episodeChart = await updateWaktoonEpisodeChart({orderBy, duration});
      setLoading(false);
      setItemList(episodeChart);
    }
    fetchAndUpdateChart({orderBy, duration});
  }, [orderBy, duration]);

  useEffect(() => {
    setfilteredItemList(itemList.filter(item => !keyword || item.title.includes(keyword) || item.author.includes(keyword)));
  }, [itemList, keyword]);

  return (
    isLoading ? 
    <SkeletonLoader skeleton={size === 'large' ? skeletonLarge : skeletonDefault} length={8} /> : 
    <WaktoonList 
      className={cx('WaktoonChartList', size)}
      ItemComponent={size === 'large' ? WaktoonChartLargeItem : WaktoonChartItem}
      list={filteredItemList} 
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

export default WaktoonChartList;