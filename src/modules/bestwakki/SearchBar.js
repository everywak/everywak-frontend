import React, { Component } from 'react';
import styles from './SearchBar.scss';

import Dropdown from '../../common/Components/Dropdown';
import * as func from '../../common/funtions';

import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class SearchBar extends Component {

  constructor(props) {
    super(props);

    this.queryTxt = React.createRef();
    const { search } = props.location || {};
    const params = func.getURLParams(search);
    if (params.queryTarget) {
      this.queryTargetValue = params.queryTarget;
    }
  }

  search() {
    if (this.props.history) {
      const queryTxtElement = document.querySelector('input[name=queryTxt]');
      var queryTxt = queryTxtElement.value ? queryTxtElement.value : '';

      const beginAtElement = document.getElementById('queryDate-start');
      var beginAt = beginAtElement.value;

      const endAtElement = document.getElementById('queryDate-end');
      var endAt = endAtElement.value;

      func.addURLParams.bind(this) (
        '/bestwakki', {
        queryTarget: document.querySelector('input[name=searchTarget]').value,
        queryTxt: queryTxt,
        beginAt: beginAt,
        endAt: endAt,
      });
    }
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
        <input type="text" name="queryTxt" id="queryTxt" className="inputForm" onKeyUp={e => {if (e.keyCode === 13) {this.search()}}} ref={this.queryTxt} placeholder={"'" + phTxt + "' 검색해 보기"} />
        <Dropdown className="searchTarget" name="searchTarget" values={searchTarget} value={this.queryTargetValue} />
        <div className="btnSearch" onClick={e => this.search()}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        </div>
      </div>
    );
  }
}

export default SearchBar;