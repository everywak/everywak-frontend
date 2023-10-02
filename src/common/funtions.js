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
 */
export function setURLParams ({history, path, query}) {
  history.push({
    pathname: path,
    search: toURLParams(query)
  });
}

/** 
 * @description URL Prarameter에 query를 추가합니다.
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
 * 숫자를 1000단위로 컴마가 삽입된 문자열로 변환합니다.
 * 
 * @param {number} n 
 * @returns {string}
 */
export function formatNumberWithCommas(n) {
  const parts = n.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

/**
 * @description 시각을 간략한 문자열로 반환합니다.
 * 
 * @param {Date} date
 * @returns {string}
 */
export function formatDateTimeString(date) {
  const today = new Date();
  const diffTime = (today.getTime() - date.getTime()) / 1000;

  if      (diffTime <                180) { return '방금 전'; }
  else if (diffTime <           100 * 60) { return parseInt(diffTime / 60) + '분 전'; }
  else if (diffTime <       24 * 60 * 60) { return parseInt(diffTime / 60 / 60) + '시간 전'; }
  else if (diffTime <  60 * 24 * 60 * 60) { return parseInt(diffTime / 60 / 60 / 24) + '일 전'; }
  else if (diffTime < 365 * 24 * 60 * 60) { return parseInt(diffTime / 60 / 60 / 24 / 30) + '달 전'; }
  else                                    { return parseInt(diffTime / 60 / 60 / 24 / 30 / 12) + '년 전'; }
}

/**
 * @description 정수를 간략한 문자열로 반환합니다.
 * 
 * @param {number} n
 * @returns {string}
 */
export function formatNumberShort(n) {
  if (n < 1000)           { return n; }
  else if (n < 10000)     { return `${(parseInt(n / 100)) / 10}천`; }
  else if (n < 100000000) { return `${(parseInt(n / 1000)) / 10}만`; }
  else                    { return `${(parseInt(n / 10000000)) / 10}억`; }
}

/** 
 * @description 브라우저 제목을 변경합니다.
 * 
 * @param {string} title 오브젝트
 */
export function setBrowserTitle (title) {
  document.title = `에브리왁굳 : ${title}`;
}

/** 
 * @description 랜덤 문자열을 생성합니다.
 * 
 * @param {number} length 문자열 길이
 * @returns {string}
 */
export function getRandomString (length = 16) {
  const char = '0123456789abcdefghijklmnopqrstuvwxyz';
  return Array(length).fill(0).map(v => char[parseInt(Math.random() * (char.length - 1))]).join('');
}

/**
 * 지정한 url로 이동합니다.
 * 
 * @param {string} url
 */
export function redirectTo(url) {
  window.location = url;
}

/**
 * @description targetElement로 전체화면을 띄웁니다.
 * 
 * @param {HTMLElement} targetElement 
 */
export function enableFullscreen(targetElement) {
  if (!document.fullscreenElement) {
    targetElement?.requestFullscreen();
  }
}
/**
 * @description 전체화면을 해제합니다.
 */
export function disableFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
}