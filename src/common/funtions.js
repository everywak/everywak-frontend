/** 
 * @description URL 파라미터를 반환합니다.
 * @return {Array} 파라미터
 */
export function getURLParams (url) {

  var param = [];
  
  try {
    url = decodeURIComponent(url);

    var params;
    params = url.substring( url.indexOf('?')+1, url.length ).split("&");

    params.map(
      p => {
        if (p.split("=").length === 2)
          return param[p.split("=")[0]] = p.split("=")[1];
      }
    );

  } catch(err) {
    console.error(err);
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