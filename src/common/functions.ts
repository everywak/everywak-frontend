/**
 * @description URL 파라미터를 object화하여 반환합니다.
 */
export function getURLParams(url: string) {
  const param: Record<string, string> = {};

  const params = new URLSearchParams(url);

  [...params.keys()].forEach((key) => {
    param[key] = params.get(key) as string;
  });

  return param;
}

/**
 * @description date가 input[type=date]의 value로 맞는 형태인지 여부를 반환합니다.
 */
export function isDateStr(date: string) {
  const dateStrRegExp = /([0-9]{4}-[0-9]{2}-[0-9]{2})/;
  return date.length === 10 && dateStrRegExp.test(date);
}

/**
 * @description 숫자를 1000단위로 컴마가 삽입된 문자열로 변환합니다.
 */
export function formatNumberWithCommas(n: number) {
  const parts = n.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/**
 * @description 시각을 간략한 문자열로 반환합니다.
 */
export function formatDateTimeString(date: Date) {
  const today = new Date();
  const diffTime = (today.getTime() - date.getTime()) / 1000;

  if (diffTime < 180) {
    return '방금 전';
  } else if (diffTime < 100 * 60) {
    return Math.floor(diffTime / 60) + '분 전';
  } else if (diffTime < 24 * 60 * 60) {
    return Math.floor(diffTime / 60 / 60) + '시간 전';
  } else if (diffTime < 60 * 24 * 60 * 60) {
    return Math.floor(diffTime / 60 / 60 / 24) + '일 전';
  } else if (diffTime < 365 * 24 * 60 * 60) {
    return Math.floor(diffTime / 60 / 60 / 24 / 30) + '달 전';
  } else {
    return Math.floor(diffTime / 60 / 60 / 24 / 30 / 12) + '년 전';
  }
}

/**
 * @description 정수를 간략한 문자열로 반환합니다.
 */
export function formatNumberShort(n: number) {
  if (n < 1000) {
    return '' + n;
  } else if (n < 10000) {
    return `${Math.floor(n / 100) / 10}천`;
  } else if (n < 100000000) {
    return `${Math.floor(n / 1000) / 10}만`;
  } else {
    return `${Math.floor(n / 10000000) / 10}억`;
  }
}

/**
 * @description 브라우저 제목을 변경합니다.
 */
export function setBrowserTitle(title: string) {
  document.title = `에브리왁굳 : ${title}`;
}

/**
 * @description 랜덤 문자열을 생성합니다.
 */
export function getRandomString(length = 16) {
  const char = '0123456789abcdefghijklmnopqrstuvwxyz';
  return Array(length)
    .fill(0)
    .map((v) => char[Math.floor(Math.random() * (char.length - 1))])
    .join('');
}

/**
 * @description targetElement로 전체화면을 띄웁니다.
 */
export function enableFullscreen(targetElement: HTMLElement) {
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

export function setLocalStorage(key: string, value: any) {
  return window.localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalStorage(key: string) {
  return JSON.parse(window.localStorage.getItem(key) as string);
}
