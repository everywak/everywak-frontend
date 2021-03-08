/** 
 * @description URL 파라미터를 반환합니다.
 * @return {Array} 파라미터
 */
export function getURLParams (url) {

  var param = new Array();
  
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
  var encoded = Object.keys(arr).map(
    key => {
      return key + '=' + encodeURIComponent(arr[key]);
    }
  );
  return encoded.join('&');
}