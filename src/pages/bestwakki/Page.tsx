import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Footer, Header } from '@/common/components';
import * as func from '@/common/functions';
import { Desktop } from '@/common/MediaQuery';

import {
  PopularArticleList,
  SortArticleList,
  ArticleDateRange,
  ArticleSearchBar,
  NavigationBar,
} from '@/components/bestwakki';
import { BestwakkiProvider } from '@/contexts/bestwakki';

import styles from './Page.module.scss';

export const Page = () => {
  useEffect(() => {
    func.setBrowserTitle('왁물원 인기글');
  }, []);

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
      <Footer />
    </BestwakkiProvider>
  );
};
export default Page;
