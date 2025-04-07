import React from 'react';
import { useQuery } from '@tanstack/react-query';

import FrontBestwakkiItem from './FrontBestwakkiItem';

import * as everywakApi from '../../services/everywak-api/index';

/**
 * 메인 페이지에 표시되는 왁물원 인기글 리스트
 *
 * @param {{}} props
 * @returns {JSX.Element}
 */
function FrontBestwakkiList({}) {
  const fetchPopularArticles = async () => {
    const res = await everywakApi.bestwakki.getPopularArticles({
      orderBy: 'time',
      perPage: 5,
    });

    if (res.message.status != 200) {
      throw res;
    }

    return res.message.result;
  };

  /**
   * @type {{ data: {popularArticleList: any[], page: number, perPage: number, articleCount: number }, isLoading: boolean }}
   */
  const { isLoading, isError, data, error } = useQuery(
    ['getPopularArticlesFront'],
    fetchPopularArticles,
  );

  if (data) {
    return data.popularArticleList.map((item) => (
      <FrontBestwakkiItem
        subject={item.subject}
        board={item.menuName}
        articleId={item.articleId}
        thumbnail={item.representImage}
      />
    ));
  }

  return <></>;
}

export default FrontBestwakkiList;
