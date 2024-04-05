import ArticleList from 'modules/board/ArticleList/ArticleList';

import { useBestwakkiActions, useBestwakkiValue } from '../context';

export default function PopularArticleList() {
  const { fetchNextPage } = useBestwakkiActions();
  const { articles, hasNextPage, isLoading } = useBestwakkiValue();

  return (
    <ArticleList
      data={articles}
      loaded={!isLoading}
      loadedLength={hasNextPage ? 1 : 0}
      pagination="more"
      onMore={fetchNextPage}
      responsiveMode="auto"
    />
  );
}
