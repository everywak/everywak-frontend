import React, { useState } from 'react';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import Button from 'common/components/legacy/Button';
import { SearchBar } from 'common/components';

import { useBestwakkiActions, useBestwakkiValue } from 'contexts/bestwakki';

import './BestwakkiSearchPanel.scss';
import cx from 'classnames';
import { ArticleDateRange } from '../ArticleDateRange/ArticleDateRange';
import { SearchBarValue } from 'common/components/SearchBar/SearchBar';

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
            name="search"
            value={searchFilter}
            onChange={(e) => {
              updateSearchFilter(e.target.value as SearchBarValue);
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
