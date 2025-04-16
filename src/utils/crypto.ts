import CryptoJS from 'crypto-js';

/**
 * AES 알고리즘으로 암호화합니다.
 */
const aesEncrypt = (data: string, key: string): string =>
  CryptoJS.AES.encrypt(String(data), key).toString();

/**
 * AES 알고리즘으로 복호화합니다.
 */
const aesDecrypt = (data: string, key: string): string =>
  CryptoJS.AES.decrypt(String(data), key).toString(CryptoJS.enc.Utf8);

export { aesEncrypt, aesDecrypt };
