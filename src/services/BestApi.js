import axios from 'axios';

import * as func from '../common/funtions';

export function getBestArticles(data) {

  const _default = {
    orderBy: 'time', 
    page: '1', 
    perPage: '30',
    queryTarget: 'title', 
    queryTxt: '', 
    beginAt: 1424876400, 
    endAt: parseInt(Date.now() / 1000)
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

  const beginAt = Math.max(
    (
      data.beginAt && func.isDateStr(data.beginAt) ? parseInt(new Date(data.beginAt).getTime() / 1000 - 9*60*60) : data.beginAt
    ), 
    _default.beginAt
  );

  data.endAt = (
    data.endAt && func.isDateStr(data.endAt) ? parseInt(new Date(data.endAt).getTime() / 1000) : data.endAt
  );
  console.log(data.beginAt);
  console.log(data.endAt);
  const endAt = (
    data.endAt >= beginAt && data.endAt <= _default.endAt ? 
    data.endAt : 
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
  return axios(
  {
    method: 'get',
    url: 'https://everywak.kr/api/bestwakki/WakkiPopularArticleList.wak', 
    params : params,
    headers: {
      "Content-Type" : "application/json",
    }
  });
}