import React, { Component } from 'react';
import styled, { keyframes } from "styled-components";
import styles from './BestwakkiHeader.scss';
import MediaQuery  from 'react-responsive';

import DateRange from './DateRange';
import SearchBar from './SearchBar';
import * as func from '../../common/funtions';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class BestwakkiHeader extends Component {
  state = {
    opened: false,
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
    
    return (
      <MediaQuery maxWidth={tablet_s_width - 1}>
        <div className="BestwakkiHeader">
              <div className={cx('btnSearch', {opened: opened})} onClick={e => this.toggle()}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#333"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              </div>
              <div className="closeArea" onClick={e => this.close()}></div>
              <div className={cx('search', {opened: opened})}>
                <div className="dialogTitle">
                  인기글 검색
                </div>
                <div className="dialogComp">
                  <div className="label">검색 기간</div>
                  <DateRange name="queryDate" min={1424876400000} max={new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()} start={this.beginAt} end={this.endAt} />
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