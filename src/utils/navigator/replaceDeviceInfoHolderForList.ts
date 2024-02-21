import { getStore } from '@/store/util';
import { getCurrentLang } from '@/init/i18n';
import { replaceFieldAll } from '../string';
import { updateAdInfo } from '@/store/modules/app/app';

const AD_KEY_LIST = ['GAID', 'gaid', 'MAC', 'ANDID', 'UDID'];
/**
 *            (       updateAdInfo)
 * @param url
 * @param urlSchema
 * @returns
 */
function replaceDeviceInfoHolderForList(urlList: string[]) {
  const store = getStore();
  const userId = store.state.user.userId || '';
  const deviceId = store.state.app.deviceId || '';
  const REPLACEINFO = {
    GAID: store.state.app.gaInfo.gaid || '',
    gaid: store.state.app.gaInfo.gaid || '',
    UID: userId,
    DID: deviceId,
    DID_UID: `${deviceId}_${userId}`,
    MAC: store.state.app.gaInfo.mac || '',
    ANDID: store.state.app.gaInfo.androidId || '',
    UDID: store.state.app.gaInfo.udid || '',
    LANG: getCurrentLang(),
    COUNTRY: store.state.universe.countryCode,
  };
  return urlList.map((url) => {
    if (!url) {
      return url;
    }
    let toUrl = url;
    Object.keys(REPLACEINFO).forEach((fieldKey) => {
      toUrl = replaceFieldAll(
        toUrl,
        fieldKey,
        REPLACEINFO[fieldKey as keyof typeof REPLACEINFO]
      );
    });
    return toUrl;
  });
}

/**
 *
 * @param url
 * @param urlSchema
 * @returns
 */
export async function replaceDeviceInfoHolderForListAsync(urlList: string[]) {
  const needUpdateAdInfo = urlList.some((url) => {
    const fUrl = url || '';
    return AD_KEY_LIST.some((item) => {
      if (fUrl.indexOf(`{${item}}`) !== -1) {
        return true;
      }
      return false;
    });
  });
  if (needUpdateAdInfo) {
    await updateAdInfo();
  }
  return replaceDeviceInfoHolderForList(urlList);
}
