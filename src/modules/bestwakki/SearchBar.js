import React, { Component } from 'react';
import styles from './SearchBar.scss';

import Dropdown from '../../common/Components/Dropdown';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import * as func from '../../common/funtions';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class SearchBar extends Component {
  static defaultProps = {
    onsearch: () => {}
  };

  state = {
    searchTarget: 'title',
  }

  constructor(props) {
    super(props);

    this.queryTxt = React.createRef();
    const { search } = props.location || {};
    const params = func.getURLParams(search);
    if (params.queryTarget && ['title', 'author', 'board'].includes(params.queryTarget)) {
      this.setState({
        searchTarget: params.queryTarget,
      })
    }
  }

  search = () => {
    if (this.props.history) {
      const queryTxtElement = document.querySelector('input[name=queryTxt]');
      var queryTxt = queryTxtElement.value ? queryTxtElement.value : '';

      const beginAtElement = document.getElementById('queryDate-start');
      var beginAt = beginAtElement.value;

      const endAtElement = document.getElementById('queryDate-end');
      var endAt = endAtElement.value;

      func.addURLParams.bind(this) (
        '/bestwakki', {
        queryTarget: this.state.searchTarget,
        queryTxt: queryTxt,
        beginAt: beginAt,
        endAt: endAt,
      });
    }
  }

  onSearch = () => {
    this.search();
    this.props.onsearch();
  }

  componentDidMount () {
    const { search } = this.props.location || {};
    const params = func.getURLParams(search);
    if (this.queryTxt && this.queryTxt.current && params.queryTxt) {
      this.queryTxt.current.value = params.queryTxt;
    }
  }

  render() {
    const searchTarget = [
      {
        id: 0,
        name: '제목',
        value: 'title',
      },
      {
        id: 1,
        name: '작성자',
        value: 'author',
      },
      {
        id: 2,
        name: '게시판',
        value: 'board',
      },
    ];
    const phTxtList = [
      'manhwa', 'manhwa', 'ㅗㅜㅑ', '왁굳', 'ㅇㄷ', 'ㅇㅎ', '꿀팁', '꿀팁', 
    ];
    const phTxt = phTxtList[Math.floor(Math.random() * phTxtList.length)];

    return (
      <div className="SearchBar" >
        <input type="text" name="queryTxt" id="queryTxt" className="inputForm" onKeyUp={e => {if (e.keyCode === 13) {this.onSearch()}}} ref={this.queryTxt} placeholder={"'" + phTxt + "' 검색해 보기"} />
        <Dropdown className="searchTarget" name="searchTarget" options={searchTarget} value={this.state.searchTarget} onChange={val => this.setState({searchTarget: val})} />
        <div className="btnSearch" onClick={e => this.onSearch()}>
            <SearchRoundedIcon fontSize="medium" style={{ color: "white" }} />
        </div>
      </div>
    );
  }
}

export default SearchBar;