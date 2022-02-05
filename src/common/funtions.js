/** 
 * @description URL 파라미터를 반환합니다.
 * @return {Array} 파라미터
 */
export function getURLParams (url) {

  const param = [];
  
  try {
    const params = url.split('?')[1].split('&');

    params.filter(p => (p.split('=').length === 2)).map(
      p => {
        const [ k, v ] = p.split('=');
        param[decodeURIComponent(k)] = decodeURIComponent(v);
      }
    );

  } catch(err) {
    if (err.name !== 'TypeError') { // not included '?'
      console.error(err);
    }
  }
  
  return param;
}

/** 
 * @description Object를 URL Prarameter String으로 변환하여 반환합니다.
 * @return {Object} 오브젝트
 */
export function toURLParams (arr) {
  var encoded = new URLSearchParams();
  Object.keys(arr).map(
    key => encoded.append(key, arr[key])
  );
  return encoded.toString();
}


export function addURLParams (path, arr) {
  const { search } = this.props.location || {};
  const params = getURLParams(search);
  Object.keys(arr).map(
    key => params[key] = arr[key]
  );
  
  this.props.history.push({
    pathname: path,
    search: toURLParams(params)
  });
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