import CryptoJS from 'crypto-js';

/**
 * AES 알고리즘으로 암호화합니다.
 *
 * @param {String} data
 * @param {String} key
 * @returns {String}
 */
const aesEncrypt = (data, key) => CryptoJS.AES.encrypt(String(data), key).toString();

/**
 * AES 알고리즘으로 복호화합니다.
 *
 * @param {String} data
 * @param {String} key
 * @returns {String}
 */
const aesDecrypt = (data, key) =>
  CryptoJS.AES.decrypt(String(data), key).toString(CryptoJS.enc.Utf8);

export { aesEncrypt, aesDecrypt };
