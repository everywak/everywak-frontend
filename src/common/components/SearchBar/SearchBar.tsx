import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { SearchRounded } from '@mui/icons-material';
import { Button, Dropdown } from '@/common/components';
import { InputChangeHandler, useInputs } from '@/hooks/useInputs';

import styles from './SearchBar.module.scss';

export type SearchBarValue = {
  searchTarget: string;
  keyword: string;
};

export interface Props {
  name: string;
  searchTargets?: { name: string; value: string }[];
  value: SearchBarValue;
  onChange: InputChangeHandler<SearchBarValue>;
}

export const SearchBar = ({
  name,
  value = { searchTarget: 'title', keyword: '' },
  onChange = () => {},
  searchTargets,
}: Props) => {
  const [_value, _onChange, reset] = useInputs(value);
  const [recommendKeyword, setRecommendKeyword] = useState('');

  useEffect(() => {
    setRecommendKeyword(getRecommendKeyword());
  }, []);

  useEffect(() => {
    reset();
  }, [value]);

  const onSubmit = () => {
    onChange({ target: { name, value: { ..._value } } });
  };

  return (
    <div className={clsx('SearchBar', styles.container)}>
      <input
        type="text"
        className={styles.inputForm}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            onSubmit();
          }
        }}
        placeholder={`'${recommendKeyword}' 검색해 보기`}
        name="keyword"
        value={_value.keyword}
        onChange={_onChange}
      />
      {searchTargets && (
        <Dropdown
          className={styles.searchTarget}
          name="searchTarget"
          options={searchTargets}
          value={_value.searchTarget}
          onChange={_onChange}
        />
      )}
      <Button className={styles.btnSearch} onClick={onSubmit}>
        <SearchRounded />
      </Button>
    </div>
  );
};

const getRecommendKeyword = () => {
  const phTxtList = ['manhwa', '왁굳', 'ㅇㄷ', '꿀팁', '합방', '봤어', '모음'];
  const phTxt = phTxtList[Math.floor(Math.random() * phTxtList.length)];
  return phTxt;
};
