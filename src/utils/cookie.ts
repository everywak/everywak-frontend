import { Cookies } from 'react-cookie';
import { Cookie, CookieSetOptions, CookieGetOptions } from 'universal-cookie';

const cookies = new Cookies();

export const setCookie = (name: string, value: Cookie, option?: CookieSetOptions) => {
  return cookies.set(name, value, { ...option });
};

export const getCookie = (name: string, options?: CookieGetOptions) => {
  return cookies.get(name, options);
};
