import { safePerformanceTimeNow } from '../utils/datetime';

/**
 *   webview   ID
 */

export const CUR_WEBVIEW_ID = (function () {
  const dt = safePerformanceTimeNow();
  return dt.toString(32) + Math.floor(Math.random() * 1000).toString(32);
})();
