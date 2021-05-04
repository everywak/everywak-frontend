import React, { Component } from 'react';
import styled, { keyframes } from "styled-components";
import styles from './BestwakkiHeader.scss';
import MediaQuery  from 'react-responsive';

import DateRange from './DateRange';
import SearchBar from './SearchBar';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import * as func from '../../common/funtions';

import classNames from 'classnames/bind';
import Button from '../../common/Components/Button';
const cx = classNames.bind(styles);

class BestwakkiHeader extends Component {
  state = {
    opened: false,
  }

  constructor (props) {
    super(props);

    const { search } = props.location || {};
    const { beginAt, endAt } = func.getURLParams(search);
    this.beginAt = (
      beginAt ? 
      (func.isDateStr(beginAt) ? new Date(beginAt).getTime() : beginAt * 1000) : 
      -1
    );
    this.endAt = (
      beginAt ? 
      (func.isDateStr(endAt) ? new Date(endAt).getTime() : endAt * 1000) : 
      -1
    );
  }

  open = () => {
    this.setState({
      opened: true,
    })
  }
  close = () => {
    this.setState({
      opened: false,
    })
  }
  toggle = () => {
    this.setState({
      opened: !this.state.opened,
    })
  }

  render () {
    const { opened } = this.state;
    const tablet_s_width = 960;
    const today = new Date();
    const min = 1424876400000, max = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    
    return (
      <MediaQuery maxWidth={tablet_s_width - 1}>
        <div className="BestwakkiHeader">
          <Button className={cx('btnSearch', {opened: opened})} onclick={e => this.toggle()}
            iconSrc={<SearchRoundedIcon fontSize="medium" />} 
            iconBGColor="transparent"
            label="인기글 검색 패널 열기"
            href="."
            showLabel={false} />
          <div className="closeArea" onClick={e => this.close()}></div>
          <div className={cx('search', {opened: opened})}>
            <div className="dialogTitle">
              인기글 검색
            </div>
            <div className="dialogComp">
              <div className="label">검색 기간</div>
              <DateRange name="queryDate" min={min} max={max} start={this.beginAt} end={this.endAt} />
            </div>
            <div className="dialogComp">
              <div className="label">검색어</div>
              <SearchBar history={this.props.history} location={this.props.location} onsearch={e => this.close()} />
            </div>
            <div className="btnWrapper">
              <button className="SnsButton secondary" onClick={e => this.close()}>
                <div className="label">닫기</div>
              </button>
            </div>
          </div>
        </div>
      </MediaQuery>
    );
  }
}

export default BestwakkiHeader;