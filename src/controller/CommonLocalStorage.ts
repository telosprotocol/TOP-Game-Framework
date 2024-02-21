import type { IPenetrateDataModel } from '@/js_bridge/js_call_app.d';
import { MS_DAY_3, MS_HOUR, MS_SECOND, MS_MINUTE } from '../constants/time';
import LocalStorage, {
  ILocalStorageItemOption,
  IStorageItemOperators,
} from './LocalStorage';

//#region  localStorage
const LOCALSTORAGE_VERSION = 2;

/**
 *  value， localStorage
 */
const ls = new LocalStorage({
  prefix: 'VD1C_',
  version: LOCALSTORAGE_VERSION,
  timeout: 0, // get timeout （ ）
  async: false,
});
const storeItemMap: Record<string, IStorageItemOperators<any>> = {};
export function getStorageItemOperators<T>(
  key: string,
  defaultOptions?: ILocalStorageItemOption
) {
  const item = storeItemMap[key];
  if (item) {
    return item as IStorageItemOperators<T>;
  }
  const storeItem = (storeItemMap[key] = ls.createStorageItemOperators<T>(
    key,
    defaultOptions
  ));
  return storeItem;
}
//#endregion

// #region

export const KeyDCReferClickInfo = 'dc_refer_click';

export const KeyDCWithdrawCount = 'dc_withdraw_count';
// #endregion

//#region navigaationCmd
export const KeyNavigationCmdWaitForLogin = 'cmd_navigation_towaitlogin';
//#endregion

//#region OffList
export const KeyOfflist = 'offerlist';
//#endregion

//#region Refer
export const KeyReferDeliverNum = 'refer_delivernum';
//#endregion

//#region Paidview
export const KeyPaidviewAccInfo = 'paidview_acc';
//#endregion

//#region mywallet earning
//

const KeyEarningUserShowAdInfo = 'uinfo_earning_ad';
const OptionEarningUserShowAdInfo = {
  timeout: MS_HOUR * 2,
};
/**
 *
 */
export function getEarningUserShowAdInfoOp() {
  return getStorageItemOperators<{
    lastClickTime: number;
  }>(KeyEarningUserShowAdInfo, OptionEarningUserShowAdInfo);
}
//#endregion

//#region Playform

const PLAYFORM_LIKE = 'pf_like_';
const PlayformOptions = {
  timeout: MS_DAY_3,
};
export function getPlayformLikedLs(pfId: string) {
  return ls.getItem<boolean>(`${PLAYFORM_LIKE}_${pfId}`, PlayformOptions);
}
export function setPlayformLikedLs(pfId: string) {
  return ls.setItem<boolean>(`${PLAYFORM_LIKE}_${pfId}`, true, PlayformOptions);
}
//#endregion

//#region
export const PENETRATE_TIMEOUT = 15 * MS_SECOND;
export const PENETRATE_KEY = 'PDATA_';
const penetrateLs = new LocalStorage({
  prefix: PENETRATE_KEY,
  version: LOCALSTORAGE_VERSION,
  timeout: PENETRATE_TIMEOUT,
  async: false,
});

export function getPenetrateDataLs(uKey: string) {
  return penetrateLs.getItem<IPenetrateDataModel>(uKey);
}
export function getPenetrateDataRawLs(uKey: string) {
  return penetrateLs.getItemRaw(uKey);
}
export function setPenetrateDataLs(uKey: string, payload: IPenetrateDataModel) {
  return penetrateLs.setItemSync<IPenetrateDataModel>(uKey, payload);
}
export function removePenetrateDataLs(uKey: string) {
  return penetrateLs.removeItem(uKey);
}
//#endregion

//#region Playform

const REFER_MONEY_POSTER = 'rm_poster';
const ReferMoneyPosterOption = {
  timeout: MS_MINUTE * 60,
};
type IReferMoneyPosterData = {
  url: string;
  picUrl: string;
};
export function getReferMoneyPosterLs() {
  return ls.getItem<IReferMoneyPosterData>(
    REFER_MONEY_POSTER,
    ReferMoneyPosterOption
  );
}
export function setReferMoneyPosterLs(data: IReferMoneyPosterData) {
  return ls.setItem<IReferMoneyPosterData>(
    REFER_MONEY_POSTER,
    data,
    ReferMoneyPosterOption
  );
}

export function removeReferMoneyPosterLs() {
  return ls.removeItem(REFER_MONEY_POSTER);
}
//#endregion
