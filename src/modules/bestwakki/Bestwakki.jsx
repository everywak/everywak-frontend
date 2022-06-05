import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import MediaQuery  from 'react-responsive';

import ArticleList from '../board/ArticleList/ArticleList';
import SearchBar from './SearchBar';
import SortList from './SortList';
import DateRange from './DateRange';
import MoreVertRoundedIcon from '@material-ui/icons/MoreVertRounded';
import BestwakkiBottomNavigator from './BestwakkiBottomNavigator';

import * as service from '../../services/BestApi';
import * as func from '../../common/funtions';

import styles from './Bestwakki.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function decodeDateStr(str) {
  return (func.isDateStr(str) ? new Date(str).getTime() : str * 1000);
}

function Bestwakki({front = false}) {

  const [searchFilter, setSearchFilter] = useState({
    orderBy: 'time',
    beginAt: -1, 
    endAt: -1, 
    keyword: '', 
    searchTarget: 'title',
  });

  const [state, setState] = useState({
    list: [],
    loaded: false,
    page: 1,
    loadedLength: 1,
  });

  const fetchArticlesInfo = async ({ reset }) => {
    setState({
      ...state, 
      loaded: false,
    });

    const params = {
      ...searchFilter, 
      page: reset ? 1 : state.page + 1,
    };

    try {
      const res = await service.getPopularArticles(params);

      if (res.status != 200) { throw res; }

      const {
        popularArticleList, page, perPage
      } = res.result;
  
      const currList = state.list;
      const list = reset ? popularArticleList : currList.concat(popularArticleList);
      
      setState({
        list: list,
        loaded: true,
        page: params.page,
        loadedLength: popularArticleList.length
      });

    } catch(e) {
      //TODO: Bestwakki api 예외 처리
      console.error(e);
    };
  };

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
    if (!front) {
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
    }
  }, [front]);

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
    
    if (!front) {
      func.setURLParams({
        history: history,
        location: location || {},
        path: '/bestwakki', 
        query: params,
      });
    }
  }

  useEffect(() => {
    fetchArticlesInfo({reset: true});
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

  const { list, loaded, loadedLength } = state;
  const today = new Date();
  const min = 1424876400000, max = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const tablet_s_width = 960;
  return (
    <div className={cx('Bestwakki', {'front': front})}>
      {!front && 
        <Fragment>
          <div className="moduleHeader">
            <Link to="/bestwakki"><h1>왁물원 인기글</h1></Link>
            <div className="controlWrapper">
              <SortList name="orderBy" value={searchFilter.orderBy} onChange={onChangeOrderByHandler} />
              <div className="right">
                <MediaQuery minWidth={tablet_s_width}>
                  <DateRange name="queryDate" min={min} max={max} start={searchFilter.beginAt} end={searchFilter.endAt} onChange={onChangeDateRangeHandler} />
                  <SearchBar defaultValue={searchFilter} onSearch={updateSearchFilter} />
                </MediaQuery>
              </div>
            </div>
          </div>
          <BestwakkiBottomNavigator history={history} />
        </Fragment>
      }
      <ArticleList 
        front={front} 
        data={list} 
        loaded={loaded} loadedLength={loadedLength}
        pagination={front ? 'none' : 'more'}
        onMore={e => fetchArticlesInfo({reset: false})}
        responsiveMode={front ? 'mobile' : 'auto'} />
      {
        front &&
        <div className="more">
          <MoreVertRoundedIcon className="frontOnly" fontSize="small" />
        </div>
      }
    </div>
  );
}

export default Bestwakki;