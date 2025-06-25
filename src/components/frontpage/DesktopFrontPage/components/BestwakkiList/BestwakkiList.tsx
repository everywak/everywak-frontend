import React from 'react';
import { useBestwakkiQuery } from '@/hooks/queries/bestwakki/useBestwakkiQuery';
import { BestwakkiItem } from './BestwakkiItem';

export const BestwakkiList = () => {
  const { data } = useBestwakkiQuery({
    params: {
      perPage: 5,
    },
  });

  if (!data) {
    return <></>;
  }
  return data.pages[0]?.map((item) => (
    <BestwakkiItem
      key={item.articleId}
      subject={item.subject}
      board={item.menuName}
      articleId={item.articleId}
      thumbnail={item.representImage}
    />
  ));
};
