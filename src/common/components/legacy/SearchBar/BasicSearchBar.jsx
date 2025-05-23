import React, { useState, useEffect } from 'react';

import { Dropdown } from 'common/components';
import TransparentButton from '../Button/TransparentButton';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import { useInputs } from 'hooks/useInputs';

import './BasicSearchBar.scss';
import cx from 'classnames';

/**
 * 검색 바
 *
 * @param {{
 * searchTargetOptions: {name: String, value: String}[],
 * searchTarget: String,
 * value: String,
 * placeholder: String,
 * onSearch?: function,
 * }} props
 */
function BasicSearchBar({
  searchTargetOptions,
  searchTarget = '',
  value = '',
  placeholder = '',
  onSearch = () => {},
}) {
  const [inputValue, onChange, reset] = useInputs({ searchTarget, value });

  useEffect(() => {
    reset();
  }, [searchTarget, value]);

  function onClickSearch() {
    onSearch(inputValue);
  }

  return (
    <div className={cx('BasicSearchBar')}>
      {searchTargetOptions && searchTargetOptions.length > 0 && (
        <Dropdown
          className="searchTarget"
          name="searchTarget"
          options={searchTargetOptions}
          value={inputValue.searchTarget}
          onChange={onChange}
        />
      )}
      <input
        type="text"
        className="inputForm"
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            onClickSearch();
          }
        }}
        name="value"
        value={inputValue.value}
        placeholder={placeholder}
        onChange={onChange}
      />
      <TransparentButton className="btnSearch" onClick={onClickSearch}>
        <SearchRoundedIcon />
      </TransparentButton>
    </div>
  );
}

export default BasicSearchBar;
