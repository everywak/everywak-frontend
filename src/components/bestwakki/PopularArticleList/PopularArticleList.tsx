import ArticleList from 'components/legacy/board/ArticleList/ArticleList';

import { useBestwakkiActions, useBestwakkiValue } from 'contexts/bestwakki';

export const PopularArticleList = () => {
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
};
