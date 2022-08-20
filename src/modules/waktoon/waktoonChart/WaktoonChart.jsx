import React, { useState, useEffect } from 'react';
import { Route, Switch, Link } from 'react-router-dom';

import BasicImage from '../../../common/Components/Image/BasicImage';
import BasicButton from '../../../common/Components/Button/BasicButton';
import LinkButton from '../../../common/Components/Button/LinkButton';
import CircleImg from '../../../common/Components/CircleImg';

import BasicSearchBar from '../../../common/Components/SearchBar/BasicSearchBar';
import BasicSelect from '../../../common/Components/Select/BasicSelect';

import KeyboardArrowLeftRoundedIcon from '@material-ui/icons/KeyboardArrowLeftRounded';

import * as func from '../../../common/funtions';
import * as service from '../../../services/Waktoon';

import useInputs from '../../../hooks/useInputs';

import WaktoonChartList from '../WaktoonChartList';

import styles from './WaktoonChart.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function WaktoonChart({location, history}) {

  const [searchTarget, onChange, reset] = useInputs({
    orderBy: 'up',
    duration: 'daily',
    keyword: '',
  });

  return (
    <div className={cx('WaktoonChart')}>
      <section className="content">
        <header>
          <Link className="btnBack" onClick={e => history.goBack()}>
            <KeyboardArrowLeftRoundedIcon fontSize="medium"/> 메인으로
          </Link>
          <h1 className="title">인기급상승 왁툰</h1>
          <span className="desc">지금 왁물원에서 핫한</span>
        </header>
        <div className="listHeader">
          <BasicSearchBar placeholder="작품 검색" onSearch={({ value }) => onChange({target: {name: 'keyword', value: value}})} />
          <div className="filterWrapper">
            <div className="sortItemWrapper">
              기간
              <BasicSelect options={[{name: '최근 24시간', value: 'daily'}, {name: '주간', value: 'weekly'}, {name: '월간', value: 'monthly'}]} name="duration" value={searchTarget.duration} onChange={onChange} />
            </div>
            <div className="sortItemWrapper">
              정렬 기준
              <BasicSelect options={[{name: '좋아요', value: 'up'}, {name: '조회수', value: 'view'}, {name: '댓글', value: 'comment'}]} name="orderBy" value={searchTarget.orderBy} onChange={onChange} />
            </div>
          </div>
        </div>
        <div className="waktoonChartListWrapper">
          <WaktoonChartList defaultShowCount={100} size="large" orderBy={searchTarget.orderBy} duration={searchTarget.duration} keyword={searchTarget.keyword} />
        </div>
        <div className="footer">
          인기급상승 왁툰차트는 매시 정각마다 갱신되며 서버 사정에 따라 오차가 있을 수 있습니다.<br/>
          에브리왁굳 왁굳코믹스의 모든 왁타버스 웹툰 정보는 누구나 접근 가능한 경로를 통해 수집되며,<br/>
          이를 이용해 직접적인 어떠한 형태의 수익도 창출하지 않습니다.
        </div>
      </section>
    </div>
  );
}
