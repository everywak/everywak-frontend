import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Header from '../../common/Header/Header';

import * as func from '../../common/functions';
import { Desktop } from '../../common/MediaQuery';

import PopularArticleList from './components/PopularArticleList';
import SortArticleList from './components/SortArticleList';
import ArticleDateRange from './components/ArticleDateRange';
import ArticleSearchBar from './components/ArticleSearchBar';
import NavigationBar from './components/NavigationBar';
import {
  BestwakkiProvider,
  useBestwakkiActions,
  useBestwakkiValue
} from './context';

import styles from './page.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function Bestwakki() {
  const { searchFilter } = useBestwakkiValue();
  const { updateSearchFilter } = useBestwakkiActions();

  useEffect(() => {
    func.setBrowserTitle('왁물원 인기글');
  }, []);

  const onChangeDateRangeHandler = (e: { start: number; end: number }) => {
    if (searchFilter.beginAt !== e.start || searchFilter.endAt !== e.end) {
      updateSearchFilter({
        beginAt: e.start,
        endAt: e.end
      });
    }
  };

  return (
    <BestwakkiProvider>
      <Header />
      <div className={styles.Bestwakki}>
        <div className={styles.moduleHeader}>
          <Link to="/bestwakki">
            <h1>왁물원 인기글</h1>
          </Link>
          <div className={styles.controlWrapper}>
            <SortArticleList />
            <div className={styles.right}>
              <Desktop>
                <ArticleDateRange />
                <ArticleSearchBar />
              </Desktop>
            </div>
          </div>
        </div>
        <NavigationBar />
        <PopularArticleList />
      </div>
    </BestwakkiProvider>
  );
}

export default Bestwakki;
