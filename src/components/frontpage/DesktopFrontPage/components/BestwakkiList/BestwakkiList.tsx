import React from 'react';
import useQueryBestwakki from 'hooks/useQueryBeskwakki';
import { BestwakkiItem } from './BestwakkiItem';

export const BestwakkiList = () => {
  const { data } = useQueryBestwakki({ searchFilter: { perPage: 5 } });

  if (!data) {
    return <></>;
  }
  return data.pages[0]?.popularArticleList.map((item) => (
    <BestwakkiItem
      subject={item.subject}
      board={item.menuName}
      articleId={item.articleId}
      thumbnail={item.representImage}
    />
  ));
};
