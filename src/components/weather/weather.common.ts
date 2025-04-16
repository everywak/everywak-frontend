import { MILLISECONDS_OF_DAY } from 'common/constants';

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
const getRelativeDateString = (date: Date): string => {
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

/**
 * 시간대 문자열을 출력합니다.
 */
const getHourString = (hours: number): string => {
  if (hours == 0 || hours >= 22) {
    // 22~0
    return '밤';
  } else if (hours <= 5) {
    // 1~5
    return '새벽';
  } else if (hours <= 9) {
    // 6~9
    return '아침';
  } else if (hours <= 11) {
    // 10~11
    return '오전';
  } else if (hours == 12) {
    // 12
    return '낮';
  } else if (hours <= 17) {
    // 13~17
    return '오후';
  } else {
    // 18~21
    return '저녁';
  }
};

export { orderNickname, personalColor, getRelativeDateString, getHourString };
