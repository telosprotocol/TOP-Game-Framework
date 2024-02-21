/**
 *  localstorage
 *  :
 */
import { MS_DAY } from '@/constants/time';
import LocalStorage from './LocalStorage';

// @despreted
// const KEY_ISPERSISTED_CHECKCINBUBBLEDLG_CLOSE = 'isPersisted_CheckInBubbleDlg_Close'
// const KEY_ISCLOSESHOWBUBBLEDLG = 'isCloseShowBubbleDlg'

// const OLD_PERSISTENT_MAP = [
//   'dot_deviceId',
//   'dot_userId',
//   'dot_tranList',
//   'active-eruda',
//   '__DEBUG_LOG',
//   '$apk001_delivertempnum',
//   KEY_ISPERSISTED_CHECKCINBUBBLEDLG_CLOSE,
//   KEY_ISCLOSESHOWBUBBLEDLG
// ].reduce((acc, cur) => {
//   acc[cur] = true;
//   return acc
// }, {});

const PERSIST_PREDIX = 'VD1LONG_';
const ls = new LocalStorage({
  prefix: PERSIST_PREDIX,
  version: 2, //  ，
  timeout: 0, //
});

//#region
const VERSION_INFO = 'v_version2';
type ILSVersionInfo = {
  lsVersionNum: number;
  versionName: string;
};
export function getCurLSVersionInfoLs() {
  return ls.getItem<ILSVersionInfo>(VERSION_INFO);
}
export function setCurLSVersionInfoLs(versionInfo: ILSVersionInfo) {
  return ls.setItem(VERSION_INFO, versionInfo);
}
//#endregion

//#region
export const KEY_COUNTRY_CODE_LOCALSTORAGE = 'COUNTRY_CODE';
export function getCountryCodeLs() {
  return ls.getItem<string>(KEY_COUNTRY_CODE_LOCALSTORAGE);
}
export function setCountryCodeLs(v: string) {
  ls.setItem(KEY_COUNTRY_CODE_LOCALSTORAGE, v);
}

export const KEY_LANG = 'LANG';
export function getLangLs() {
  return ls.getItem<string>(KEY_LANG);
}
export function setLangLs(v: string) {
  ls.setItem(KEY_LANG, v);
}

const KEY_REGION_CODE_LOCALSTORAGE = 'REGION_CODE';
export function setRegionCodeLs(v: string) {
  return ls.setItem(KEY_REGION_CODE_LOCALSTORAGE, v);
}
export function getRegionCodeLs() {
  return ls.getItem<string>(KEY_REGION_CODE_LOCALSTORAGE);
}
//#endregion

//#region LuckyCode
const KEYLUCKCODEPrefix = 'LuckCodeRedeemed_';
export function getLuckCodeRedeemedLs(userId: string) {
  return ls.getItem<string>(KEYLUCKCODEPrefix + userId);
}
export function setLuckCodeRedeemedLs(userId: string) {
  ls.setItem(KEYLUCKCODEPrefix + userId, 1);
}
//#endregion

//#region
// const WITHDRAWGUIDE = 'withdraw_guide';
// export function getWithdrawGuideLs() {
//   return ls.getItem<boolean>(WITHDRAWGUIDE);
// }

// export function setWithdrawGuideLs() {
//   ls.setItem(WITHDRAWGUIDE, true);
// }

// /**
//  *
//  */
// const RECENT_USRINFO = 'recent_uinfo';
// export function setRecentUInfoLs(uInfo: { point: number }) {
//   ls.setItem(RECENT_USRINFO, uInfo);
// }
// export function getRecentUInfoLs() {
//   return ls.getItem<{ piont: number }>(RECENT_USRINFO);
// }
//#endregion

//#region
const TASK_ISCLICKED_PREFIX = 'task_clicked_';
/**
 *
 */
export function getTaskIsClickedLs(taskId: number) {
  return ls.getItem<boolean>(TASK_ISCLICKED_PREFIX + taskId);
}

/**
 *
 */
export function setTaskIsClickedLs(taskId: number) {
  return ls.setItem<boolean>(TASK_ISCLICKED_PREFIX + taskId, true);
}
//#endregion

//#region
const KEY_MOVIESHARE_JOINED = 'mshare_joined';
export function getMovieShareJoinedLs() {
  return ls.getItem<boolean>(KEY_MOVIESHARE_JOINED);
}
export function setMovieShareJoinedLs() {
  return ls.setItem<boolean>(KEY_MOVIESHARE_JOINED, true);
}
//#endregion

// //#region fission
// //  dt
// const KEY_FISSION_REDDOT_VERSIONS = 'fission_reddot_versions';
// export function getFissionRedDotVersionsLs() {
//   return ls.getItem<Partial<IFissionHomeRedDotModel>>(
//     KEY_FISSION_REDDOT_VERSIONS
//   );
// }
// export function setFissionRedDotVersionsLs(
//   newModel: Partial<IFissionHomeRedDotModel>
// ) {
//   return ls.setItem<Partial<IFissionHomeRedDotModel>>(
//     KEY_FISSION_REDDOT_VERSIONS,
//     newModel
//   );
// }
// //#endregion

// #region tiktok
const KEY_FOR_TIKTOK_ACTIVITY_FORM = 'tiktok_ac_form_beforelogin';
export type ITiktokAcForm = Partial<{
  link: string;
  danaNumber: string;
  whatsAppNumber: string;
  profileImage: string;
}>;
export function getTiktokActivityFormInfoLs() {
  return ls.getItem<Partial<ITiktokAcForm>>(KEY_FOR_TIKTOK_ACTIVITY_FORM);
}
export function setTiktokActivityFormInfoLs(newModel: Partial<ITiktokAcForm>) {
  return ls.setItem<Partial<ITiktokAcForm>>(
    KEY_FOR_TIKTOK_ACTIVITY_FORM,
    newModel
  );
}

export function removeTiktokActivityFormInfoLs() {
  return ls.removeItem(KEY_FOR_TIKTOK_ACTIVITY_FORM);
}
//#endregion

// #region
// const KEY_FOR_VGAME_TURNTABLE = 'vgame_turntable_autoopened';
// export type IVGameTurnTableOpened = {
//   userId: string;
//   tag: string;
// };
// export function getVGameTurntableOpenLs() {
//   return ls.getItem<IVGameTurnTableOpened>(KEY_FOR_VGAME_TURNTABLE);
// }
// export function setVGameTurntableOpenLs(newModel: IVGameTurnTableOpened) {
//   return ls.setItem<IVGameTurnTableOpened>(KEY_FOR_VGAME_TURNTABLE, newModel);
// }
//#endregion

//#region Higgs
const HIGGS_ID_INFO_KEY = 'HIGGS_ID_INFO';
type IHiggsIDFormInfo = {
  targetId: string;
  mobile: string;
  rawMobile: string;
  nickname?: string;
  hasShowGuide?: boolean;
};
export function getHiggsIDFormInfoLS() {
  return ls.getItem<IHiggsIDFormInfo>(HIGGS_ID_INFO_KEY);
}
export function setHiggsIDFormInfoLS(info: IHiggsIDFormInfo) {
  return ls.setItem(HIGGS_ID_INFO_KEY, info);
}

const HIGGS_GUIDE_SHOW_KEY = 'HIGGS_GUIDE_SHOW';
type IHiggsGuideShow = {
  lastShow: number;
};
export function getHiggsGuideShowLS() {
  return ls.getItem<IHiggsGuideShow>(HIGGS_GUIDE_SHOW_KEY);
}
export function setHiggsGuideShowLS(info: IHiggsGuideShow) {
  return ls.setItem(HIGGS_GUIDE_SHOW_KEY, info);
}

//#endregion

//#region Higgs
const EARNCASH_SMALL_WITHDRAW_DLG_KEY = 'EARNCASH_SMALL_WITHDRAW_SHOWED';
type IEarnCashSmallWithdrawDlg = {
  userId: string;
};
export function getEarnCashSmallWithdrawDlgInfo() {
  return ls.getItem<IEarnCashSmallWithdrawDlg>(EARNCASH_SMALL_WITHDRAW_DLG_KEY);
}
export function setEarnCashSmallWithdrawDlgInfo(
  info: IEarnCashSmallWithdrawDlg
) {
  return ls.setItem(EARNCASH_SMALL_WITHDRAW_DLG_KEY, info);
}
//#endregion
//#region
const GUEST_WITHDRAW_ACCOUNT_KEY = 'GUEST_WITHDRAW_ACCOUNT';
export type IGuestWithdrawAccountInfo = API.WithdrawalChannelBindAO & {
  /**
   *  （ ）
   */
  smallLimitAmount?: BigDecimalString;
};
export function getWithdrawAccountInfoForGuest() {
  return ls.getItem<IGuestWithdrawAccountInfo>(GUEST_WITHDRAW_ACCOUNT_KEY);
}
export function setWithdrawAccountInfoForGuest(
  info: IGuestWithdrawAccountInfo
) {
  return ls.setItem(GUEST_WITHDRAW_ACCOUNT_KEY, info);
}
export function removeWithdrawAccountInfoForGuest() {
  return ls.removeItem(GUEST_WITHDRAW_ACCOUNT_KEY);
}
//#endregion

//#region pp
const GAME_NOVICE_KEY = 'GAME_NOVICE_STATES';
type IGameNoviceMap = Record<string, boolean>;
export function getNoviceState() {
  return ls.getItem<IGameNoviceMap>(GAME_NOVICE_KEY);
}
export function setNoviceStateByGameId(gameId: string) {
  const oldState = getNoviceState() || {};
  oldState[gameId] = true;
  return ls.setItem(GAME_NOVICE_KEY, oldState);
}
//#endregion

//#region pp
const AUTO_MSG_DLG_TIME = 'LAST_AUTO_MSG_DLG_PUSH_TIME';
export function getLastAutoMsgDlgPushTime() {
  return ls.getItem<number>(AUTO_MSG_DLG_TIME);
}
export function setLastAutoMsgDlgPushTime(dt: number) {
  return ls.setItem(AUTO_MSG_DLG_TIME, dt);
}
//#endregion
//#region
const GAME_HALL_AUTO_PREFIX = 'GAMEHALL_AUTO_';
type IGameHallAutoOpenTimeKey =
  | 'SPECIAL_RECHARGE'
  | 'FIRST_CHARGE'
  | 'PAY_ENTRY'
  | 'Withdraw';
function getGameHallLastAutoDlgOpenTime(type: IGameHallAutoOpenTimeKey) {
  return ls.getItem<number>(GAME_HALL_AUTO_PREFIX + type);
}

export function checkLastGameHallAutoOpenTimeCanOpen(
  type: IGameHallAutoOpenTimeKey,
  frozenTime = MS_DAY
) {
  const dt = getGameHallLastAutoDlgOpenTime(type);
  const dtNow = new Date().getTime();
  if (dt && dtNow - dt < frozenTime) {
    return false;
  }
  return true;
}
export function setGameHallLastAutoDlgOpenTime(
  type: IGameHallAutoOpenTimeKey,
  dt: number
) {
  return ls.setItem(GAME_HALL_AUTO_PREFIX + type, dt);
}
//#endregion
