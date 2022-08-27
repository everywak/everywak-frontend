import React, { useState, useEffect } from 'react';
import { Route, Switch, Link } from 'react-router-dom';

import BasicSearchBar from '../../../common/Components/SearchBar/BasicSearchBar';
import BasicSelect from '../../../common/Components/Select/BasicSelect';
import PageSelect from '../../../common/Components/Select/PageSelect';

import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';

import * as func from '../../../common/funtions';
import * as service from '../../../services/Waktoon';

import useInputs from '../../../hooks/useInputs';

import BestWaktoonList from './BestWaktoonList';
import WaktoonEpisodeList from '../waktoonViewer/WaktoonEpisodeList';

import styles from './BestWaktoons.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function BestWaktoons({location, history}) {

  const defaultShowCount = {
    series: 12,
    episode: 24,
  };
  const [maxPage, setMaxPage] = useState(1);

  const [searchTarget, onChange, reset] = useInputs({
    type: 'best',
    page: 1,
    perPage: 12,
    orderBy: 'time',
    queryTarget: 'title',
    queryTxt: '',
    viewType: 'series', 
  });

  function onChangeList({ pagination }) {
    setMaxPage(Math.ceil(pagination.length / defaultShowCount[searchTarget.viewType]));
  }

  useEffect(() => {
    onChange({
      target: {
        name: 'page',
        value: 1,
      }
    });
  }, [searchTarget.orderBy, searchTarget.queryTarget, searchTarget.queryTxt]);

  return (
    <div className={cx('BestWaktoons')}>
      <section className="content">
        <header>
          <Link className="btnBack" onClick={e => history.goBack()}>
            <KeyboardArrowLeftRoundedIcon fontSize="medium"/> 메인으로
          </Link>
          <h1 className="title">베스트 왁툰</h1>
          <span className="desc">왁물원이 뒤집어지고 전세계가 감탄한</span>
        </header>
        <div className="listHeader">
          <BasicSearchBar placeholder="작품 검색" value={searchTarget.queryTxt} onSearch={({ value }) => onChange({target: {name: 'queryTxt', value: value}})} />
          <div className="filterWrapper">
            <div className="sortItemWrapper">
              분류
              <BasicSelect options={[{name: '시리즈', value: 'series'}, {name: '단편작', value: 'episode'}]} name="viewType" value={searchTarget.viewType} onChange={e => (onChange(e), onChange({target: {name: 'perPage', value: defaultShowCount[e.target.value]}}))} />
              정렬 기준
              <BasicSelect options={[{name: '최신순', value: 'time'}, {name: '좋아요순', value: 'up'}, {name: '조회수순', value: 'view'}, {name: '댓글순', value: 'comment'}]} name="orderBy" value={searchTarget.orderBy} onChange={onChange} />
            </div>
          </div>
        </div>
        <div className="waktoonEpisodeListWrapper">
          {
            searchTarget.viewType === 'series' ?
            <BestWaktoonList defaultShowCount={defaultShowCount[searchTarget.viewType]} searchOptions={searchTarget} onChange={onChangeList} /> :
            <WaktoonEpisodeList defaultShowCount={defaultShowCount[searchTarget.viewType]} searchOptions={searchTarget} onChange={onChangeList} />
          }
          <PageSelect name="page" max={maxPage} maxLength={10} value={searchTarget.page} onChange={onChange} />
        </div>
        <div className="footer">
          에브리왁굳 왁굳코믹스의 모든 왁타버스 웹툰 정보는 누구나 접근 가능한 경로를 통해 수집되며,<br/>
          이를 이용해 직접적인 어떠한 형태의 수익도 창출하지 않습니다.
        </div>
      </section>
    </div>
  );
}
