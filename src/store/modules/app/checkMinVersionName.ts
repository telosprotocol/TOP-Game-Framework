import { getStore } from '@/store/util';
/**
 *   curVersion>=refVersion(         )
 * @param curVersion
 * @param refVersion
 * @returns true curVersion >= refVersion
 * @returns false curVersion < refVersion
 */
export function isCurVersionGreaterAndEqualTo(
  curVersion: string,
  refVersion: string
) {
  const curVersionList = curVersion.replace(/[^0-9.]*/, '').split('.');
  const refVersionList = refVersion.replace(/[^0-9.]*/, '').split('.');
  const len = Math.min(curVersionList.length, refVersion.length);
  for (let i = 0; i < len; i++) {
    const curVersionNum = parseInt(curVersionList[i], 10);
    const refVersionNum = parseInt(refVersionList[i], 10);
    if (curVersionNum < refVersionNum) {
      return false;
    } else if (curVersionNum > refVersionNum) {
      return true;
    }
  }
  // 0--len
  if (refVersionList.length > curVersionList.length) {
    // 1.5.0  > 1.5
    //1.5.1   1.5
    return false;
  }
  return true;
}
/**
 *   APP          (    versionCode  )
 *  :         versionName
 * @param minSupportVersion  x.x.x        .,
 * @returns isSupport checkVersionName<=      true
 */
export function checkMinVersionName(minSupportVersion: string) {
  const store = getStore();
  const curVersion = store.state.app.versionName || '';
  if (!curVersion) {
    return false;
  }
  return isCurVersionGreaterAndEqualTo(curVersion, minSupportVersion);
}
