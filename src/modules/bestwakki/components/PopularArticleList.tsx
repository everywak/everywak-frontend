import ArticleList from 'modules/board/ArticleList/ArticleList';

import { useBestwakkiActions, useBestwakkiValue } from '../context';

export default function PopularArticleList() {
  const { fetchNextPage } = useBestwakkiActions();
  const { articles, hasNextPage, isLoading, isFetchingNextPage } = useBestwakkiValue();

  return (
    <ArticleList
      data={articles}
      isLoading={isLoading || isFetchingNextPage}
      hasNextPage={hasNextPage}
      pagination="more"
      onMore={fetchNextPage}
      responsiveMode="auto"
    />
  );
}
