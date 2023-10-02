import React, { useEffect, useState } from 'react';

import FrontBestwakkiItem from './FrontBestwakkiItem';

import * as service from '../../services/BestApi';

/**
 * 메인 페이지에 표시되는 왁물원 인기글 리스트
 * 
 * @param {{name: string, state: string, weather: string}} props 
 * @returns {JSX.Element}
 */
function FrontBestwakkiList({ subject, board, thumbnail, href }) {

  const [articleList, setArticleList] = useState([]);
  
  const updateBestwakki = async () => {

    const { result, status } = await service.getPopularArticles({ orderBy: 'time' });
    
    if (result.popularArticleList) {
      setArticleList(result.popularArticleList.slice(0, 5).map(item => {
        return(<FrontBestwakkiItem subject={item.subject} board={item.menuName} articleId={item.articleId} thumbnail={item.representImage} />);
      }));
    }
  };
  useEffect(() => { updateBestwakki(); }, []);

  return articleList;
}

export default FrontBestwakkiList;