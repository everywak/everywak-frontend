/**
 * 날씨 아이템 정렬용
 */
const orderNickname = {
  아이네: 1,
  징버거: 2,
  릴파: 3,
  주르르: 4,
  고세구: 5,
  비챤: 6,
};

const MILLISECONDS_OF_DAY = 24 * 60 * 60 * 1000;

/**
 * 퍼스널 컬러
 */
const personalColor = {
  아이네: 'ine',
  징버거: 'jingburger',
  릴파: 'lilpa',
  주르르: 'jururu',
  고세구: 'gosegu',
  비챤: 'viichan',
};
/**
 * 현재 시각을 기준으로 date의 상대시간을 출력합니다.
 * @param {Date} date
 * @returns {string}
 */
const getRelativeDateString = (date) => {
  const today = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  ).getTime();
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dateCount = (today - target) / MILLISECONDS_OF_DAY;
  if (dateCount === 0) {
    return '오늘';
  } else if (dateCount === 1) {
    return '어제';
  } else {
    return `${dateCount}일 전`;
  }
};

export { orderNickname, MILLISECONDS_OF_DAY, personalColor, getRelativeDateString };
