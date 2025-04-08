import React, { useState, useEffect } from 'react';

import Header from '../../../common/Header/Header';

import BasicSearchBar from '../../../common/Components/SearchBar/BasicSearchBar';
import BasicSelect from '../../../common/Components/Select/BasicSelect';
import PageSelect from '../../../common/Components/Select/PageSelect';

import { Desktop, NotDesktop } from '../../../common/MediaQuery';

import { useInputs } from 'hooks/useInputs';

import BackButton from '../BackButton';
import AllWaktoonList from './AllWaktoonList';

import './AllWaktoons.scss';
import cx from 'classnames';

export default function AllWaktoons() {
  const defaultShowCount = 24;
  const [maxPage, setMaxPage] = useState(1);

  const [searchTarget, onChange, reset] = useInputs({
    page: 1,
    perPage: 24,
    orderBy: 'time',
    queryTarget: 'title',
    queryTxt: '',
    viewType: 'item',
  });

  function onChangeList({ pagination }) {
    setMaxPage(Math.ceil(pagination.length / defaultShowCount));
  }

  useEffect(() => {
    onChange({
      target: {
        name: 'page',
        value: 1,
      },
    });
  }, [searchTarget.orderBy, searchTarget.queryTarget, searchTarget.queryTxt]);

  return (
    <>
      <Header />
      <div className={cx('AllWaktoons')}>
        <section className="content">
          <header>
            <BackButton />
            <h1 className="title">왁툰 모두 보기</h1>
            <span className="desc">왁물원의 모든 웹툰</span>
          </header>
          <div className="listHeader">
            <BasicSearchBar
              placeholder="작품 검색"
              value={searchTarget.queryTxt}
              onSearch={({ value }) => onChange({ target: { name: 'queryTxt', value: value } })}
            />
            <div className="filterWrapper">
              <div className="sortItemWrapper">
                보기 형식
                <BasicSelect
                  options={[
                    { name: '바둑판식', value: 'item' },
                    { name: '리스트', value: 'list' },
                  ]}
                  name="viewType"
                  value={searchTarget.viewType}
                  onChange={onChange}
                />
              </div>
              <div className="sortItemWrapper">
                정렬 기준
                <BasicSelect
                  options={[
                    { name: '최신순', value: 'time' },
                    { name: '좋아요순', value: 'up' },
                    { name: '조회수순', value: 'view' },
                    { name: '댓글순', value: 'comment' },
                  ]}
                  name="orderBy"
                  value={searchTarget.orderBy}
                  onChange={onChange}
                />
              </div>
            </div>
          </div>
          <div className="waktoonEpisodeListWrapper">
            <Desktop>
              <AllWaktoonList
                viewType={searchTarget.viewType}
                defaultShowCount={defaultShowCount}
                searchOptions={searchTarget}
                onChange={onChangeList}
              />
              <PageSelect
                name="page"
                max={maxPage}
                maxLength={10}
                value={searchTarget.page}
                onChange={onChange}
              />
            </Desktop>
            <NotDesktop>
              <AllWaktoonList
                viewType="list"
                defaultShowCount={defaultShowCount}
                searchOptions={searchTarget}
                onChange={onChangeList}
              />
              <PageSelect
                name="page"
                max={maxPage}
                maxLength={5}
                value={searchTarget.page}
                onChange={onChange}
              />
            </NotDesktop>
          </div>
          <div className="footer">
            에브리왁굳 왁굳코믹스의 모든 왁타버스 웹툰 정보는 누구나 접근 가능한 경로를 통해
            수집되며,
            <br />
            이를 이용해 직접적인 어떠한 형태의 수익도 창출하지 않습니다.
          </div>
        </section>
      </div>
    </>
  );
}
