import React, { useState } from 'react';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import Button from 'common/Components/Button';

import { useBestwakkiActions, useBestwakkiValue } from '../../context';
import ArticleDateRange from '../ArticleDateRange';
import SearchBar from '../ArticleSearchBar/SearchBar';

import './BestwakkiSearchPanel.scss';
import cx from 'classnames';

function BestwakkiSearchPanel() {
  const [opened, setOpened] = useState(false);
  const { searchFilter } = useBestwakkiValue();
  const { updateSearchFilter } = useBestwakkiActions();

  const close = () => setOpened(false);
  const toggle = () => setOpened(!opened);

  return (
    <div className="BestwakkiSearchPanel">
      <Button
        className={cx('btnSearch', { opened: opened })}
        onclick={toggle}
        iconSrc={<SearchRoundedIcon />}
        iconBGColor="transparent"
        label="인기글 검색 패널 열기"
        href="."
        showLabel={false}
      />
      <div className="closeArea" onClick={close}></div>
      <div className={cx('search', { opened: opened })}>
        <div className="dialogTitle">인기글 검색</div>
        <div className="dialogComp">
          <div className="label">검색 기간</div>
          <ArticleDateRange />
        </div>
        <div className="dialogComp">
          <div className="label">검색어</div>
          <SearchBar
            defaultValue={searchFilter}
            onSearch={(e: Record<string, string>) => {
              updateSearchFilter(e);
              close();
            }}
          />
        </div>
        <div className="btnWrapper">
          <button className="SnsButton secondary" onClick={close}>
            <div className="label">닫기</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BestwakkiSearchPanel;
