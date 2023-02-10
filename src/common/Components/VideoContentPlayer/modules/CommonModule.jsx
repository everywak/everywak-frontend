/**
 * @typedef {Object} VideoContentInterface
 * @property {() => void} play
 * @property {() => void} pause
 * @property {boolean => void} setMuted
 * @property {() => boolean} getMuted
 * @property {number => void} setVolume
 * @property {() => number} getVolume
 * @property {number => void} seek
 * @property {() => number} getCurrentTime
 * @property {() => number} getDuration
 * @property {string => void} setQuality
 * @property {() => string} getQuality
 * @property {() => string[]} getQualities
 */
/**
 * @typedef {Object} VideoContentHandlers
 * @property {() => VideoContentInterface} onReady
 * @property {() => {}} onPlay
 * @property {() => {}} onPlaying
 * @property {() => {}} onPause
 * @property {() => {}} onOnline
 * @property {() => {}} onOffline
 */

const qualityIdYoutube = {
  'hd2160': '2160p', 
  'hd1440': '1440p', 
  'hd1080': '1080p', 
  'hd720': '720p', 
  'large': '480p', 
  'medium': '360p', 
  'small': '240p', 
  'tiny': '144p', 
  'auto': '자동',
};
const qualityIdTwitch = {
  'Auto': '자동',
  'auto': '자동',
  'chunked': '원본 화질',
  '1080p60 (source)': '1080p60 (원본)',
  '1080p60': '1080p60',
  '1080p50': '1080p50',
  '1080p48': '1080p48',
  '720p60': '720p60',
  '720p60 (source)': '720p60 (원본)',
  '720p': '720p',
  '720p30': '720p',
  '480p': '480p',
  '480p30': '480p',
  '360p': '360p',
  '360p30': '360p',
  '160p': '160p',
  '160p30': '160p',
};

export { qualityIdYoutube, qualityIdTwitch }