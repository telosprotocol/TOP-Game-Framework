/**
 *   android
 * @returns
 */
export function getAndroidMainVersion() {
  let ua = navigator.userAgent;
  if (!ua) {
    return null;
  }
  ua = ua.toLowerCase();
  try {
    const androidStrIdx = ua.indexOf('android');
    if (androidStrIdx > 0) {
      const reg = /android ([\d]+)/;
      const matches = ua.match(reg);
      if (matches[1]) {
        const v = parseInt(matches[1]);
        if (isNaN(v)) {
          return null;
        }
        return v;
      }
    }
  } catch (ex) {
    if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
      console.log('getAndroidMainVersion Err', ex);
    }
  }
  return null;
}
