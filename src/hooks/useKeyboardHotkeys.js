import { useEffect } from 'react';

/**
 * @typedef {Object} HotkeyItem
 * @property {string} key
 * @property {boolean | undefined} shiftKey
 * @property {boolean | undefined} altKey
 * @property {boolean | undefined} ctrlKey
 * @property {function} callback
 */
/**
 * @param {HotkeyItem[]} hotkeyMaps 
 * @param {*} deps 
 * @returns 
 */
function useKeyboardHotkeys(hotkeyMaps, deps) {

  useEffect(() => {
    /**
     * @param {KeyboardEvent} e 
     * @returns {undefined}
     */
    const hotkeyHandler = e => {
      console.log(e.key)
      const target = hotkeyMaps.find(item => item.key === e.key);

      if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) { return; } // 입력중
      if (!target) { return; } // 해당하는 핫키 없음
      if (target.shiftKey != target.shiftKey || target.altKey != target.altKey || target.ctrlKey != target.ctrlKey) { return; } // 조합키 불일치

      target.callback(e);
    }
    document.addEventListener('keydown', hotkeyHandler);

    return () => {
      document.removeEventListener('keydown', hotkeyHandler);
    };
  }, deps);

  return null;
}

export default useKeyboardHotkeys;