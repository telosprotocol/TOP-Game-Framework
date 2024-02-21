import { SHARE_PLATFORM, TYPE_TP_SHARE_TYPES } from '@/constants/invite';
import { setCurrentLang } from '@/init/i18n';
import { UNIVERSE_MUTATIONS } from '@/store/modules/universe/UNIVERSE_MUTATIONS';
import { getStore, storeCommit } from '@/store/util';
import type { RouterNameInappType } from './../constants/localRoutePath';
import type { IPlayFormListItem } from './../modules/playform/service';
import {
  BIT_LOG_END,
  BIT_LOG_END_DETAIL,
  BIT_LOG_START,
  BIT_LOG_START_DETAIL,
} from './BIT_LOG_ENUMS';
import { APP_ROUTE_LOGIN } from '@/constants/APP_SCHEMA_URLS';
import { SHARE_TYPES_LINK } from '@/constants/invite';
import { setLocalLog_bridge } from './jsCallApp/dotting';
import { storeCommitAndPenetrate } from './jsCallApp/utilsPenetrate';
import { callBridge, callBridgePromise } from './jsCallAppBaseUtils';
import type {
  IBridgeModelAdInfo,
  IBridgeModelAppInfo,
  IBridgeModelConfig,
  IBridgeModelDeviceInfo,
  IBridgeModelUserInfo,
  IBridgeOpenSimpleWebBridgeOptions,
  IBridgeResult,
} from './js_call_app.d';
import type { BannerOpType } from '@/constants/BannerOpType';
import type { IWithdrawType } from '@/modules/VGoldWithdraw/controller/VGoldWithdraw.state';

//#endregion

//#region   webview  (    )
/**
 *   webview  (    )
 * data    false
 * @param url url
 * @param _options   ，
 */
export function openSimpleWebBridge(
  url: string,
  _options?: IBridgeOpenSimpleWebBridgeOptions
) {
  const options = _options || {
    isShowNativeBar: false,
    isShowStatusBar: true,
    isLoadCompleteJs: false,
  };
  return callBridgePromise<unknown>('openSimpleWeb', {
    url,
    data: options,
  });
}

/**
 *
 * @param url
 */
export function openExternalBrowser(url: string) {
  return callBridgePromise<unknown>('openExternalBrowser', {
    url,
  });
}
//#endregion

//#region setStatusColor_bridge

/**
 *   app
 */
export function setStatusColor_bridge(payload: {
  /**
   *
   */
  color: string;
  isDark: boolean;
}) {
  return callBridgePromise<boolean>('setStatusColor', payload, {
    logType: BIT_LOG_START_DETAIL,
  });
}
//#endregion

//#region Toast Loading UI

/**
 *
 * @param param0
 */
export function showToast_bridge({ content }: { content: string }) {
  return callBridgePromise<boolean>('showToast', {
    content,
  });
}

/**
 *   Loading（dismissLoading_bridge）
 */
export function showLoading_bridge() {
  return callBridgePromise<boolean>(
    'showLoading',
    {
      canCancel: true,
    },
    {}
  );
}

/**
 *   Loading
 */
export function dismissLoading_bridge() {
  return callBridgePromise<boolean>('dismissLoading', {}, {});
}

//#endregion

//#region -

/**
 *
 * (  store.dispatch('user/refreshUserAuthInfoFromBridge'))
 */
export function _getUserInfo_bridge() {
  // console.log('jsbridge getUserInfo start:')

  return callBridgePromise<
    IBridgeModelUserInfo & {
      point2?: number;
      realInviteCount2?: number;
      signInCount2?: number;
    }
  >(
    'getUserInfo',
    {},
    { formatLongNumber: true, logType: BIT_LOG_START | BIT_LOG_END_DETAIL }
  );
  // .then((res) => {
  //   if (res.Result === 1 && res.data) {
  //     const { ...rest } = res.data;
  //     const newData = {
  //       ...rest,
  //     } as IBridgeModelUserInfo;
  //     if (point2 != null) {
  //       newData.point = point2;
  //     }
  //     if (realInviteCount2 != null) {
  //       newData.realInviteCount = realInviteCount2;
  //     }
  //     if (signInCount2 != null) {
  //       newData.signInCount = signInCount2;
  //     }
  //     res.data = newData;
  //   }
  //   return res as IBridgeResult<IBridgeModelUserInfo>;
  // });
}

//#endregion

//#region
/**
 *   APP
 */
export function isLoginAsync() {
  return callBridgePromise<boolean>(
    'isLoginAsync',
    {},
    {
      logType: BIT_LOG_START | BIT_LOG_END_DETAIL,
    }
  ).then((res) => {
    storeCommit('user/setIsLogined', {
      isLogined: res.data,
      from: 'isLoginAsync',
    });
    return res;
  });
}
//#endregion
//#region -

/**
 *        (        ，      )
 *   getConfigBridgeWithRetry
 */
export function _getConfig_bridge() {
  return callBridgePromise<IBridgeModelConfig>(
    'getConfig',
    {},
    {
      cache: true,
      logType: BIT_LOG_START | BIT_LOG_END_DETAIL,
    }
  ).then((rltObj) => {
    if (rltObj.Result === 1) {
      // if (process.env.VUE_APP_ENV_SIM) {
      //   return rltObj //
      // }
      storeCommit('base/setRegion', rltObj.data.region);
      if (rltObj.data.lang) {
        setCurrentLang(rltObj.data.lang);
      }
      if (rltObj.data.countryCode) {
        storeCommit(UNIVERSE_MUTATIONS.setCountryCode, rltObj.data.countryCode);
      }
    }
    return rltObj;
  });
}

//#endregion

//#region - AppInfo
/**
 *
 * @returns
 */
function getAppInfo_bridgeNative() {
  return callBridgePromise<IBridgeModelAppInfo>(
    'getAppInfo',
    {},
    {
      cache: true,
    }
  ).then((rlt) => {
    // console.log('getAppInfo_bridgeNative', rlt)
    if (rlt.Result == 1) {
      storeCommit('app/setAppInfo', {
        ...rlt.data,
        // buildNum: window.GC.buildNum,
      });
    }
    return rlt;
  });
}

export function _getAppInfo_bridge() {
  // console.log('jsbridge getAppInfo start:')
  // if (process.env.VUE_APP_ENV_SIM) {
  //   const data: IBridgeModelAppInfo = {
  //     appType: '2001',
  //     buildNum: '4718',
  //     versionCode: 18,
  //     versionName: '1.5.10',
  //     clientInfo: store.state.app.clientInfo,
  //   }
  //   return Promise.resolve({
  //     Result: 1,
  //     data,
  //   } as IBridgeResult<IBridgeModelAppInfo>)
  // } else {
  return getAppInfo_bridgeNative();
  // }
}
export function getAdvertisingInfo_bridge() {
  return callBridgePromise<IBridgeModelAdInfo>(
    'getAdvertisingInfo',
    {},
    {
      logType: BIT_LOG_START | BIT_LOG_END_DETAIL,
    }
  ).then((rlt) => {
    return rlt;
  });
}

//#endregion

//#region - DeviceInfo
export function _getDeviceInfo_bridge() {
  if (process.env.VUE_APP_ENV_SERVER === 'development') {
    setLocalLog_bridge({ a: 'RequestDeviceApi', b: 'call getDeviceInfo' });
  }
  return callBridgePromise<IBridgeModelDeviceInfo>(
    'getDeviceInfo',
    {},
    {
      logType: BIT_LOG_START | BIT_LOG_END_DETAIL,
      cache: true,
    }
  ).then((dinfo) => {
    //
    if (process.env.VUE_APP_ENV_SERVER === 'development') {
      setLocalLog_bridge({
        a: 'RequestDeviceApi',
        b: 'call getDeviceInfoResult',
        deviceId: dinfo.data?.deviceId,
      });
    }
    if (dinfo.data) {
      storeCommitAndPenetrate('app/setDeviceInfo', dinfo.data);
    }
    // if (!dinfo.data) {
    //   console.log('_getDeviceInfo_bridge result:', dinfo.data)
    // }
    return dinfo;
  });
}
//#endregion

//#region -SignHeaders
/**
 *       http
 **/
export function getSignHeaders_bridge(obj: Record<string, string | number>) {
  // console.log('jsbridge getInfo start:', Date.now())
  const map: Record<string, string | number> = {};
  for (const key in obj) {
    if (obj[key] != null) {
      map[key] = obj[key];
    }
  }
  return callBridgePromise<string>('getInfo', map);
}

//#endregion

//#region - getStatusBarHeight
/**
 *        (px:    devicePixelRatio )
 */
export function _getStatusBarHeightBridge() {
  return callBridgePromise<number>('getStatusBarHeight', {}, { cache: true });
}
//#endregion

//#region

//#region - navigation
export type INavigationData = {
  /**
   *
   */
  DTPageName?: string;
  DTArgs?: Record<string, string>;
};
export function navigation(data: {
  url: string;
  data?: INavigationData;
  // /**
  //  *   http/https
  //  *     ，
  //  */
  // isFullScreen?: boolean;
}) {
  if (!window.GC.isInApp) {
    location.href = data.url;
    return Promise.resolve({
      Result: 1,
      data: true,
    });
  }
  return callBridgePromise<boolean>(
    'navigation',
    {
      url: data.url,
      data: JSON.stringify(data.data),
    },
    {
      logType: BIT_LOG_START_DETAIL,
    }
  );
}

/**
 *   webview    （    ）
 * @param url
 * @param options
 */
export function navigationWV(
  url: string,
  options: {
    /**
     *   http/https
     *     ，
     */
    isFullScreen?: boolean;
  }
) {
  return navigation({ url, ...options });
}

export function navigationVid(url: string) {
  return navigation({ url });
}

export function openDownloadBrowser(
  url: string,
  data: {
    /**
     *   Inject  Bridge
     *   :true
     */
    isDisableDownloader: boolean;
  },
  /**
   *    url，          ，      url
   * openDownloadBrowser
   */
  containInstructionUrl?: string
  //IBridgeOpenSimpleWebBridgeOptions &
) {
  return callBridgePromise<boolean>(
    'openDownloadBrowser',
    { url, data, containInstructionUrl },
    {
      logType: BIT_LOG_START_DETAIL,
    }
  );
}

export type INavigationLoginFromType =
  | 'dcbanner'
  | 'tasklist'
  | 'checkin'
  | 'push'
  | 'msgcenter'
  | 'banner_nav'
  | 'command_nav'
  | RouterNameInappType
  | 'offer-item'
  | 'gamehall_guideclaim'
  | 'gameHall_welfare'
  | 'gamehall_topupactivity'
  | 'gamehall_spin'
  | 'gamehall_checkinactivity'
  | 'gamehall_checkin'
  | 'gamehall_exchangecode'
  | 'gamehall_tomorrow'
  | 'gamehall_profile'
  | 'gamehall_task'
  | 'gamehall_tasknovice'
  | 'gamehall_invite'
  | 'gamehall_weekcard'
  | 'gamehall_higgs'
  | 'activity_fissiontask'
  | 'gamehall_special_pay'
  | 'gamehall_bankruptcy'
  | 'gamehall_topup'
  | 'activity_ranklist'
  | 'luckywheel_pay'
  | 'gamehall_levelicon'
  | 'gamehall_goldplus'
  | 'gamehall_profile_recharge'
  | 'gamehall_topup2'
  | 'activity_RECOVERY_SMASH_EGG'
  | 'gamehall_GROWTH_PLAN'
  | 'gamehall_PAY'
  | 'gamehall_TOPUP_TASK';

function getCurrentTraceEventName(traceEventName?: INavigationLoginFromType) {
  if (traceEventName) {
    return traceEventName;
  } else {
    return window.vue205.$route?.name;
  }
}
/**
 *
 * @param {String} traceEventName       ，
 * @param {String} traceParamValue
 * @param {Boolean} isRemain   ，        （     ）
 */
export function navigation_login_bridge(
  traceEventName: INavigationLoginFromType,
  /**
   *
   */
  other?: {
    /**
     *
     */
    to?: string;

    /**
     *
     */
    opType?: BannerOpType;
  }
) {
  const loginFromType = getCurrentTraceEventName(traceEventName) + '_login';
  let query = '?from=' + encodeURIComponent(loginFromType);
  if (other) {
    for (const key in other) {
      query += `&${key}=${encodeURIComponent((other as any)[key])}`;
    }
  }
  return navigation({ url: APP_ROUTE_LOGIN + query });
}
//#endregion

//#endregion

//#region

/**
 *
 */
export function close_bridge() {
  return callBridgePromise<boolean>(
    'closeActivity',
    {},
    { logType: BIT_LOG_START }
  );
}
//#endregion

//#region

interface IShareBaseInfo {
  content?: string;
  url?: string;
  shareLink?: string;
}

export type IAppShareOption = {
  /**
   * firebase      ，     app
   */
  firebaseShortLinkHost?: string;
  /**
   *    tp    ，        inviteType
   */
  shareType?: TYPE_TP_SHARE_TYPES;
  /**
   *
   */
  isShowPoster?: boolean;

  /**
   *        subCategory  (v    )
   * @descripted
   */
  subCategory?: number;

  /**
   *   ，
   * replace_@url@_replace（app        ）
   * {inviteCode}(h5       )
   */
  content?: string;

  /**
   *             ，key platform
   */
  contentPlatformsMap?: Record<number, string>;

  /**
   *         url
   */
  picPlatformsMap?: Record<number, string>;
  /**
   *   ，   whatsapp  ，     app   Loading(2.6.6)
   */
  url?: string;
  /**
   *
   */
  shareLink?: string;

  //#region v1.5.10
  inviteCode?: string;

  /**
   *     （showShareDialog true ，   ）
   */
  sharePlatform?: number;

  /**
   *       dialog
   */
  showShareDialog: boolean;
  /**
   *        （      ）
   */
  title?: string;

  /**
   *    (    slogan)
   */
  subTitle?: string;
  /**
   * public static final int INSTAGRAM = 1;
   *     public static final int FACEBOOK = 2;
   *     public static final int WHATSAPP = 3;
   *     public static final int MESSAGER = 4;
   *     public static final int TWITTER = 5;
   *     public static final int SYSTEMSHARE = 6;
   *     public static final int COPYLINK = 7;
   *     public static final int QRCODE = 8;
   *     public static final int POSTER = 9;
   *     public static final int DISLIKE = 10;
   *     public static final int REPORT = 11;
   */
  platforms?: number[];

  // /**
  //  *     whatsapp
  //  */
  // showWhatsappSecret?: boolean;

  // /**
  //  * whatsapp           ，  showWhatsappSecret  ，limitCountForWhatsappSecret
  //  *  0
  //  */
  // limitCountForWhatsappSecret?: number;
  //#endregion
  /**
   *         ，     true,      true
   */
  withApk?: boolean;

  // /**
  //  *      ，       updateTaskInfo
  //  * 2.0.6
  //  */
  // reportTaskSubcategory?: number;

  /**
   *      (      )
   */
  traceParams?: string; //{ [key: string]: string | number }

  /**
   *    Toast
   */
  silent?: boolean;

  // /**
  //  *       id
  //  */
  // taskId?: string | number;
};

/**
 * @param data
 */
export function share_bridge(data: IAppShareOption) {
  const newData = {
    ...data,
  };
  if (data.showShareDialog && !newData.platforms) {
    data.platforms = [
      SHARE_PLATFORM.WHATSAPP,
      SHARE_PLATFORM.FACEBOOK,
      SHARE_PLATFORM.MESSAGER,
      SHARE_PLATFORM.COPYLINK,
      // SHARE_PLATFORM.INSTAGRAM,
      SHARE_PLATFORM.SYSTEMSHARE,
    ];
  }
  // console.log('jsbridge share start:',data.shareType)
  return callBridgePromise<boolean>('share', data);
}
// /**
//  *    messager
//  */
// export function share_to_messenger_bridge(data: IShareBaseInfo) {
//   // console.log('jsbridge share_to_messenger start:')

//   return share_bridge({
//     shareType: SHARE_TYPES.SAHRE_TO_MESSENGER,
//     ...data,
//   })
// }
// /**  -     */
// export function share_login_bridge(data: IShareBaseInfo) {
//   // console.log('jsbridge share_login start:')

//   return share_bridge({
//     shareType: SHARE_TYPES.SHARE_INVITE_LOGIN,
//     ...data,
//   })
// }

/**
 *       ---youtube       ，
 * @param params
 * @despreted
 */
export function shareLinkBridge(data: IShareBaseInfo) {
  return share_bridge({
    shareType: SHARE_TYPES_LINK,
    showShareDialog: false,
    ...data,
  });
}
//#endregion

//#region    APP
/**
 *    APP
 */
export function checkVersion_bridge() {
  return callBridgePromise<boolean>(
    'checkVersion',
    {},
    {
      logType: BIT_LOG_END_DETAIL,
    }
  );
}
//#endregion

//#region mailto
export function openSystemEmailBridge(address: string) {
  callBridge('openSystemEmail', {
    emailAddress: address,
  });
}
//#endregion

//#region openNativeApp
export function openNativeApp(data: {
  appNativeUri: string;
  appWebViewUri: string;
}) {
  callBridge('openNativeApp', data);
}

/**
 *   apk
 * @param payload
 */
export function openAppByPackageName(payload: { packageName: string }) {
  return callBridgePromise<boolean>('startAppByPackageName', payload);
}

//#endregion

//#region

/**
 *
 */
export function pasteStr(data: { content: string }) {
  return callBridgePromise<boolean>('paste', data, {
    logType: BIT_LOG_END,
  });
}

/**
 *
 */
export function getClipboardStr() {
  return callBridgePromise<string>(
    'getPaste',
    {},
    {
      logType: BIT_LOG_END,
    }
  );
}
//#endregion

//#region
/**
 *      （           ，         ，      ）
 * @param data
 */
export function preDownloadPic(data: { url: string }) {
  return callBridge('preDownloadPic', data);
}

//#endregion

//#region   whatsapp
/**
 *   whatsapp
 * @param data
 */
export function shareWhatsApp(data: {
  url: string;
  content: string;
  picUrl: string;
  profile: {
    /**
     *
     */
    useCache: boolean;
    /**
     *
     */
    spanMS: number;
  };
}) {
  return callBridge('shareWhatsApp', data);
}
//#endregion

//#region
/**
 *
 * @param data
 */
export function addPushListener(data: { type: string }) {
  return callBridge('addPushListener', data.type);
}

//#endregion

//#region
/**
 *
 */
export function shareWithAddressBook(data: {
  shareLink: string;
  content: string;
  /**
   *
   */
  traceParam: Record<string, number | string>;
}) {
  callBridge('shareWithAddressBook', data);
}
//#endregion

//#region    APK
/**
 *
 * @param data
 */
export function preBuildApkWithKey(data: {
  platform: SHARE_PLATFORM;
  inviteCode: string;
  /**
   *        activityType    SHARE_TYPES_INVITE_DOWNLOAD
   * e.g: A,B
   */
  tp: TYPE_TP_SHARE_TYPES;
  userId: string;
}) {
  const { tp, ...rest } = data;
  const data2 = {
    ...rest,
    type: tp,
  };
  return callBridge('preBuildApkWithKey', data2);
}
//#endregion

//#region
export function getIsUserOpenPush() {
  return callBridgePromise<boolean>(
    'getIsUserOpenPush',
    {},
    {
      logType: BIT_LOG_START | BIT_LOG_END_DETAIL,
    }
  );
}

/**
 *
 * @returns
 */
export function openUserPush() {
  return callBridge('openUserPush', {});
}
//#endregion

//#region dialog
export function showWebviewDialog<TData>(payload: {
  path: string;

  //#region
  width?: number;
  height?: number;

  designWidth?: number;
  designHeight?: number;
  //#endregion

  cancelAble?: boolean;
}) {
  if (!window.GC.isInApp) {
    return Promise.resolve({
      Result: 0,
      Reason: 'NotSupport',
    } as IBridgeResult<TData>);
  }
  const store = getStore();
  const { path, designWidth, designHeight, cancelAble = false } = payload;
  let { width, height } = payload;
  if (!width && designWidth) {
    width = store.getters.designPxToReal(designWidth);
  }
  if (!height && designHeight) {
    height = store.getters.designPxToReal(designHeight);
  }
  if (width) {
    width = Math.ceil(width);
  } else {
    width = -1;
  }
  // if (height) {
  //   height = Math.ceil(height);
  // } else {
  //   height = -1;
  // }
  // if (width === -1) {
  //   const w = Math.min(window.screen.width, window.screen.height);
  //   width = w;
  // }
  // store.getters.designPxToReal(280)
  return callBridgePromise<TData>(
    'showDialog',
    {
      content: `${location.origin}/dialog.html#${path}`,
      width,
      height,
      cancelAble,
    },
    {
      logType: BIT_LOG_START_DETAIL | BIT_LOG_END_DETAIL,
    }
  ).then((res) => {
    if (res.data) {
      try {
        const dataObj = JSON.parse((res as any).data as string) as TData;
        return {
          ...res,
          data: dataObj,
        };
      } catch (ex) {
        return {
          Result: 0,
        } as IBridgeResult<TData>;
      }
    }
    return res;
  });
}

/**
 *
 * @param dialogResultData   showDialog   data
 */
export function closeWebviewDialog<TData>(dialogResultData: TData) {
  callBridge('closeDialog', dialogResultData);
}
//#endregion

//#region apk

/**
 *     apk
 * @returns      apk
 */
export function getIsAPKListInstalledBatch(apkList: string[]) {
  return callBridgePromise<string[]>(
    'getIsAPKListInstalledBatch',
    { apkList },
    {
      // logType: BIT_LOG_START_DETAIL | BIT_LOG_END_DETAIL
    }
  );
}

/**
 *     apk
 */
export function requestDownloadAPK(data: {
  /**
   *
   */
  packageName: string;

  /**
   *
   */
  url: string;

  /**
   *   ,
   */
  icon?: string;

  /**
   *
   */
  title: string;
}) {
  return callBridgePromise<'start' | 'resume'>('requestDownloadAPK', data, {
    logType: BIT_LOG_START_DETAIL | BIT_LOG_END_DETAIL,
  });
}

//#endregion

//#region  httpProxy
export function httpProxy(info: {
  method: 'GET' | 'POST' | 'PUT'; // 2.8.4.0    PUT
  url: string; //http://xxxxxx
  /**
   * POST
   */
  data?: string;
  headers: Record<string, string>;
  timeout: number; //    ，  :ms
}) {
  const { data, ...rest } = info;
  //
  return callBridgePromise<string>('httpProxy', {
    ...rest,
    data:
      data == null
        ? '{}'
        : typeof data === 'string'
        ? data
        : JSON.stringify(data),
  });
}

//#endregion

//#region  onPlayFormStoredChange
/**
 *   app
 * @param payload
 */
export function callPlayFormStoredChange(payload: {
  playformId: number | string;
  isCancel: boolean;
  detail: Omit<IPlayFormListItem, 'collectStatus'>;
}) {
  callBridge('onPlayFormStoredChange', payload);
}
//#endregion

//#region  tokenFailure
/**
 *   app 401
 */
export function notifyAppUserTokenFailure() {
  callBridge('tokenFailure', {});
}
//#endregion

//#region  isInGame
/**
 *
 * @returns
 */
export function getIsInGame() {
  return callBridgePromise<boolean>('isInGame', {});
}
//#endregion

//#region  getCurTopPageName
/**
 *       active
 * @returns 'bounds' 'wallet' 'webGame | others
 */
function getTopPageName() {
  //
  return callBridgePromise<'bounds' | 'wallet' | 'webGame' | 'xxx'>(
    'getTopPageName',
    {}
  );
}
export async function getCurTopPageName() {
  const topPageNameRes = await getTopPageName();
  return topPageNameRes;
}

//#endregion

//#region  isShowBankruptcyGiftAndOpen
/**
 *            false,     app
 * @param from
 * @returns
 */
export async function isShowBankruptcyGiftAndOpen(from: 'luckywheel') {
  return callBridgePromise<boolean>('isShowBankruptcyGiftAndOpen', { from });
}
//#endregion

//#region  isFileExists
/**
 *
 * @param path
 * @returns
 */
export function isFileExists(path: string) {
  return callBridgePromise<boolean>('isFileExists', path, {
    dontStringify: true,
  });
}

//#endregion

//#region Notify: coin 、 settlement
/**
 *   app
 * @param goldAmount
 * @returns
 */
export function updateCoins(goldAmount: string) {
  return callBridge('updateCoins', {
    goldAmount: goldAmount,
  });
}

/**
 *   app
 * @param data
 * @returns
 */
export function notifyGameSettlement(data: API.UserSettlementBannerVO) {
  return callBridge('gameSettlement', data);
}

/**
 *   app
 * @param data
 * @returns
 */
export function notifyWithdrawaled(data: {
  type: IWithdrawType;
  price: BigDecimalString;
}) {
  return callBridge('withdrawal', data);
}
// #endregion

/**
 * app
 */
export function dispatchTouchEventByApp(data: { x: number; y: number }) {
  callBridge('dispatchTouchEvent', data);
}

/**
 * app
 */
export function getGameSettingSoundEffectIsOpen() {
  return callBridgePromise<boolean>('gameSettingSoundEffectIsOpen', {});
}

export function showBottomBarForGameTab() {
  return;
}
export function hideBottomBarForGameTab() {
  return;
}
