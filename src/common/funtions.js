/** 
 * @description URL 파라미터를 반환합니다.
 * 
 * @return {Object} 파라미터
 */
export function getURLParams (url) {

  const param = {};
  
  const params = new URLSearchParams(url);

  for (let key of params.keys()) {
    param[key] = params.get(key);
  }
  
  return param;
}

/** 
 * @description Object를 URL Prarameter String으로 변환하여 반환합니다.
 * 
 * @return {Object} 오브젝트
 */
export function toURLParams (params) {
  return new URLSearchParams(params).toString();
}

/** 
 * @description URL Prarameter를 query로 설정합니다.
 * 
 * @return {Object} 오브젝트
 */
export function setURLParams ({history, path, query}) {
  history.push({
    pathname: path,
    search: toURLParams(query)
  });
}

/** 
 * @description URL Prarameter에 query를 추가합니다.
 * 
 * @return {Object} 오브젝트
 */
export function addURLParams ({location, history, path, query}) {
  const { search } = location || {};
  const params = {...getURLParams(search), ...query};

  setURLParams({history, path, query: params});
}

/** 
 * @description date가 input[type=date]의 value로 맞는 형태인지 여부를 반환합니다.
 */
export function isDateStr (date) {
  const dateStrRegExp = /([0-9]{4}-[0-9]{2}-[0-9]{2})/;
  return date.length === 10 && dateStrRegExp.test(date);
}

/**
 * @description 시각을 간략한 문자열로 반환합니다.
 * 
 * @param {Date} date
 */
export function formatDateTimeString(date) {
  const today = new Date();
  const diffTime = (today.getTime() - date.getTime()) / 1000;

  if      (diffTime <               180) { return '방금 전'; }
  else if (diffTime <          100 * 60) { return parseInt(diffTime / 60) + '분 전'; }
  else if (diffTime <      24 * 60 * 60) { return parseInt(diffTime / 60 / 60) + '시간 전'; }
  else if (diffTime < 60 * 24 * 60 * 60) { return parseInt(diffTime / 60 / 60 / 24) + '일 전'; }
  else                                   { return parseInt(diffTime / 60 / 60 / 24 / 30) + '달 전'; }
}

/** 
 * @description 브라우저 제목을 변경합니다.
 * 
 * @param {string} title 오브젝트
 */
export function setBrowserTitle (title) {
  document.title = `에브리왁굳 : ${title}`;
}