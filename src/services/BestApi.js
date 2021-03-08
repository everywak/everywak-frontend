import axios from 'axios';

export function getBestArticles(data) {

  const _default = {
    orderBy: 'time', 
    page: '1', 
    perPage: '30',
    queryTarget: 'title', 
    queryTxt: '', 
    beginAt: '2015-02-26', 
    endAt: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,10)
  }

  const ptNum = /[^0-9]/g;
  const ptDate = /([0-9]{4}-[0-9]{2}-[0-9]{2})/g

  const orders = ['time', 'time_oldest', 'up', 'comment', 'read'];
  const orderBy = orders.includes(data.orderBy) ? data.orderBy : _default.orderBy;

  const page = Math.max(
    parseInt(
      String(data.page || _default.page).replace(ptNum, '')
      ), 
    1);

  const perPage = Math.min(Math.max(
    parseInt(
      String(data.perPage || _default.perPage).replace(ptNum, '')
    ), 
    5), 999);
  
  const queryTargets = ['title', 'author', 'board'];
  const queryTarget = queryTargets.includes(data.queryTarget) ? data.queryTarget : _default.queryTarget;

  const queryTxt = data.queryTxt || _default.queryTxt;

  const beginAt = (
    data.beginAt && data.beginAt.search(ptDate) === 0 ? 
    data.beginAt.match(ptDate)[0] : 
    _default.beginAt
  );

  const endAt = (
    data.endAt && data.endAt.search(ptDate) === 0 ? 
    data.endAt.match(ptDate)[0] : 
    _default.endAt
  );
  
  const params = {
    orderBy: orderBy, 
    page: page, 
    perPage: perPage,
    queryTarget: queryTarget, 
    queryTxt: queryTxt, 
    beginAt: beginAt, 
    endAt: endAt
  };
console.log(params);
  return axios.get('https://everywak.kr/api/bestwakki/WakkiPopularArticleList.wak', {
    params : params,
    headers:{"Content-Type" : "application/json"}
  });
}