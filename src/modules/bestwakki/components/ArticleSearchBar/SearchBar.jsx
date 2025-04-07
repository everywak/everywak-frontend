import React, { useState, useEffect } from 'react';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import Dropdown from 'common/Components/Dropdown';

import useInputs from 'hooks/useInputs';

import './SearchBar.scss';
import cx from 'classnames';

function getRecommendKeyword() {
  const phTxtList = ['manhwa', '왁굳', 'ㅇㄷ', '꿀팁', '합방', '봤어', '모음'];
  const phTxt = phTxtList[Math.floor(Math.random() * phTxtList.length)];
  return phTxt;
}

/**
 * 검색 바
 *
 * @param {{
 * defaultValue: {
 *   searchTarget: 'title' | 'author' | 'board',
 *   keyword: string
 * },
 * onSearch: function
 * }} props
 */
function SearchBar({ defaultValue = { searchTarget: 'title', keyword: '' }, onSearch = () => {} }) {
  const [value, onChange, reset] = useInputs(defaultValue);
  const [recommendKeyword, setRecommendKeyword] = useState('');

  useEffect(() => {
    setRecommendKeyword(getRecommendKeyword());
  }, []);

  useEffect(() => {
    reset();
  }, [defaultValue]);

  function onClickSearch() {
    console.log('onClickSearch', value);
    onSearch(value);
  }

  const searchTargetOptions = [
    {
      name: '제목',
      value: 'title',
    },
    {
      name: '작성자',
      value: 'author',
    },
    {
      name: '게시판',
      value: 'board',
    },
  ];

  return (
    <div className="SearchBar">
      <input
        type="text"
        className="inputForm"
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            onClickSearch();
          }
        }}
        placeholder={`'${recommendKeyword}' 검색해 보기`}
        name="keyword"
        value={value.keyword}
        onChange={onChange}
      />
      <Dropdown
        className="searchTarget"
        name="searchTarget"
        options={searchTargetOptions}
        value={value.searchTarget}
        onChange={onChange}
      />
      <div className="btnSearch" onClick={(e) => onClickSearch()}>
        <SearchRoundedIcon style={{ color: 'white' }} />
      </div>
    </div>
  );
}

export default SearchBar;
