import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';

import ArticleList from '../board/ArticleList/ArticleList';
import SearchBar from './SearchBar';
import SortList from './SortList';
import DateRange from './DateRange';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import BestwakkiBottomNavigator from './BestwakkiBottomNavigator';

import Header from '../../common/Header/Header';

import * as everywakApi from '../../services/everywak-api/index';
import * as func from '../../common/functions';
import { Desktop } from '../../common/MediaQuery';

import styles from './Bestwakki.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function decodeDateStr(str) {
  return (func.isDateStr(str) ? new Date(str).getTime() : str * 1000);
}

function Bestwakki({}) {

  const [searchFilter, setSearchFilter] = useState({
    orderBy: 'time',
    beginAt: -1, 
    endAt: -1, 
    keyword: '', 
    searchTarget: 'title',
  });

  const fetchPopularArticles = async ({ page }) => {
    const params = {
      ...searchFilter, 
      page,
    };

    const res = await everywakApi.bestwakki.getPopularArticles(params);

    if (res.message.status != 200) { throw res; }

    return res.message.result;
  };
  /**
   * @type {{ data: {popularArticleList: any[], page: number, perPage: number, articleCount: number }, isLoading: boolean }}
   */
  const { data, fetchNextPage, hasNextPage, isLoading, isError } = useInfiniteQuery(
    ['getPopularArticles', searchFilter],
    ({ pageParam }) => fetchPopularArticles({ page: pageParam }),
    {
      getNextPageParam: (lastPage, allPosts) => {
        return allPosts[allPosts.length - 1].articleCount > 0 ? lastPage.page + 1 : undefined;
      },
    },
  );

  const updateSearchFilter = newFilter => {
    if (JSON.stringify(searchFilter) !== JSON.stringify({...searchFilter, ...newFilter})) {
      setSearchFilter(searchFilter => ({
        ...searchFilter,
        ...newFilter,
      }));
    }
  };
  const location = useLocation();
  const history = useHistory();

  /**
   * Bestwakki 페이지 접속시
   */
  useEffect(() => {
    func.setBrowserTitle('왁물원 인기글');
    const { search } = location || {};
    const { orderBy, beginAt, endAt, queryTxt, queryTarget } = func.getURLParams(search);

    const parsedSearchFilter = {
      beginAt: beginAt ? decodeDateStr(beginAt) : -1,
      endAt:   endAt   ? decodeDateStr(endAt)   : -1,
    }

    if (orderBy) {
      parsedSearchFilter.orderBy = orderBy;
    }
    if (queryTxt) {
      parsedSearchFilter.keyword = queryTxt;
    }
    if (queryTarget && ['title', 'author', 'board'].includes(queryTarget)) {
      parsedSearchFilter.searchTarget = queryTarget;
    }

    if (JSON.stringify(parsedSearchFilter) !== JSON.stringify({beginAt: -1, endAt: -1})) {
      setTimeout(() => updateSearchFilter(parsedSearchFilter), 10);
    }
  }, []);

  /**
   * 검색 필터 변경시 URLParams 반영
   */
  const updateURLParams = () => {
    const {
      orderBy, beginAt, endAt, keyword, searchTarget
    } = searchFilter;

    const params = {};
    if (orderBy && orderBy !== 'time') {
      params.orderBy = orderBy;
    }
    if (keyword && keyword !== '') {
      params.queryTarget = searchTarget;
      params.queryTxt = keyword;
    }
    if (beginAt !== -1 && beginAt !== 1424876400000) {
      params.beginAt = parseInt(beginAt / 1000);
    }
    const endDate = new Date(endAt);
    const todayDate = new Date();
    if (endAt !== -1 && endDate.toDateString() !== todayDate.toDateString()) {
      params.endAt = parseInt(endAt / 1000);
    }
    
    func.setURLParams({
      history: history,
      location: location || {},
      path: '/bestwakki', 
      query: params,
    });
  }

  useEffect(() => {
    //fetchArticlesInfo({reset: true});
    updateURLParams();
  }, [searchFilter]);

  const onChangeOrderByHandler = e => {
    updateSearchFilter({
      [e.target.name]: e.target.value,
    });
  }
  const onChangeDateRangeHandler = e => {
    if (searchFilter.beginAt !== e.start || searchFilter.endAt !== e.end) {
      updateSearchFilter({
        beginAt: e.start, endAt: e.end
      });
    }
  }

  const today = new Date();
  const min = 1424876400000, max = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  return (<>
    <Header />
    <div className={cx('Bestwakki')}>
      <div className="moduleHeader">
        <Link to="/bestwakki"><h1>왁물원 인기글</h1></Link>
        <div className="controlWrapper">
          <SortList name="orderBy" value={searchFilter.orderBy} onChange={onChangeOrderByHandler} />
          <div className="right">
            <Desktop>
              <DateRange name="queryDate" min={min} max={max} start={searchFilter.beginAt} end={searchFilter.endAt} onChange={onChangeDateRangeHandler} />
              <SearchBar defaultValue={searchFilter} onSearch={updateSearchFilter} />
            </Desktop>
          </div>
        </div>
      </div>
      <BestwakkiBottomNavigator history={history} searchFilter={searchFilter} onChangeDateRangeHandler={onChangeDateRangeHandler} updateSearchFilter={updateSearchFilter} />
      <ArticleList 
        front={false} 
        data={data?.pages?.map(page => page.popularArticleList).flat() || []} 
        loaded={!isLoading} loadedLength={hasNextPage ? 1 : 0}
        pagination="more"
        onMore={fetchNextPage}
        responsiveMode="auto" />
    </div>
  </>);
}

export default Bestwakki;