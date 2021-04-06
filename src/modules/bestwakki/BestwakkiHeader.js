import React, { Component } from 'react';
import styled, { keyframes } from "styled-components";
import styles from './BestwakkiHeader.scss';
import MediaQuery  from 'react-responsive';

import DateRange from './DateRange';
import SearchBar from './SearchBar';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
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
            <SearchRoundedIcon fontSize="medium" />
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