import axios from 'axios';

export function getBestArticles() {
  return axios.get('https://everywak.kr/api/bestwakki/WakkiPopularArticleList.wak');
}