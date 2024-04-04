
/**
 * 현재 시각을 기준으로 date의 상대시간을 출력합니다.
 * @param {Date} date 
 * @returns {string}
 */
const getRelativeDateString = date => {
  const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime();
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dateCount = (today - target) / MILLISECONDS_OF_DAY;
  if (dateCount === 0) {
    return '오늘';
  } else if (dateCount === 1) {
    return '어제';
  } else  {
    return `${dateCount}일 전`;
  }
}


export { orderNickname, MILLISECONDS_OF_DAY, personalColor, getRelativeDateString };