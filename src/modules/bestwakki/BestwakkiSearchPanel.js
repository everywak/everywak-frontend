import React, { Component } from 'react';

import Button from '../../common/Components/Button';
import DateRange from './DateRange';
import SearchBar from './SearchBar';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import * as func from '../../common/funtions';

import styles from './BestwakkiSearchPanel.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class BestwakkiSearchPanel extends Component {

  static defaultProps = {
    searchFilter: null, 
    onChangeDateRangeHandler: e => {},
    updateSearchFilter: e => {},
  }

  state = {
    opened: false,
  }

  constructor (props) {
    super(props);
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
    const { searchFilter, onChangeDateRangeHandler, updateSearchFilter } = this.props;
    const { opened } = this.state;
    const today = new Date();
    const min = 1424876400000, max = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    
    return (
      <div className="BestwakkiSearchPanel">
        <Button className={cx('btnSearch', {opened: opened})} onclick={this.toggle}
          iconSrc={<SearchRoundedIcon />} 
          iconBGColor="transparent"
          label="인기글 검색 패널 열기"
          href="."
          showLabel={false} />
        <div className="closeArea" onClick={this.close}></div>
        <div className={cx('search', {opened: opened})}>
          <div className="dialogTitle">
            인기글 검색
          </div>
          <div className="dialogComp">
            <div className="label">검색 기간</div>
            <DateRange name="queryDate" min={min} max={max} start={searchFilter.beginAt} end={searchFilter.endAt} onChange={onChangeDateRangeHandler} />
          </div>
          <div className="dialogComp">
            <div className="label">검색어</div>
            <SearchBar defaultValue={searchFilter} onSearch={e => { updateSearchFilter(e);this.close() }} />
          </div>
          <div className="btnWrapper">
            <button className="SnsButton secondary" onClick={this.close}>
              <div className="label">닫기</div>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default BestwakkiSearchPanel;