import { setCurrentLang } from '@/init/i18n';
import { UNIVERSE_MUTATIONS } from '@/store/modules/universe/UNIVERSE_MUTATIONS';
import { storeCommit } from '@/store/util';
import { catchRetryEx, IRetryOption, retryWrap } from '@/utils/promise';
import PromiseCache from '@/utils/PromiseCache';
import { timeoutEnhance } from '../utils/promise';
import { MS_HOUR } from './../constants/time';
import BridgeCache from './BridgeCache';
import type {
  IBridgeModelAppInfo,
  IBridgeModelConfig,
  IBridgeModelDeviceInfo,
  IBridgeResult,
} from './js_call_app.d';
import {
  getIsAPKListInstalledBatch,
  isLoginAsync,
  _getAppInfo_bridge,
  _getConfig_bridge,
  _getDeviceInfo_bridge,
  _getStatusBarHeightBridge,
  _getUserInfo_bridge,
} from './js_call_app_base';

export * from './js_call_app_base';

const BRIGE_DEFAULT_RETRY_OPTION = {
  timeout: 2000,
  retryCount: 2,
} as IRetryOption;
//         （     ）
// const BRIGE_DEFAULT_RETRY_OPTION_FOR_LOCAL = {
//   timeout: 500,
//   retryCount: 2,
// } as IRetryOption;
const bridgePromiseCacheInstance = new PromiseCache({
  timeout: MS_HOUR, //1     ，
});
enum BRIDGE_CACHE_TYPE {
  GetUserInfo,
  // GetConfig,
  // GetAppInfo,
  GetDeviceInfo,
  CanShowDownload,
}

//#region isLoginAsync
/**
 * isLogin_bridge
 * @param {*} _option
 */
export function isLoginAsyncBridgeWithRetry(
  _option: IRetryOption = {
    timeout: 5000,
    retryCount: 2,
  }
) {
  return retryWrap(_option, isLoginAsync, []).catch(catchRetryEx);
}

//#endregion

//#region getUserInfo
export function getUserInfoBridgeWithRetry(
  _option: IRetryOption = BRIGE_DEFAULT_RETRY_OPTION
) {
  const p = retryWrap(_option, _getUserInfo_bridge);
  bridgePromiseCacheInstance.addPromiseCache(BRIDGE_CACHE_TYPE.GetUserInfo, p);
  return p;
}

//#endregion

//#region getStatusBarHeight
export function getStatusBarHeight() {
  const cache = BridgeCache.Instance.getCache<number>('getStatusBarHeight');
  const setStatusBarHeightCommitName = 'bridge/setStatusBarHeight';
  if (cache && cache.Result === 1) {
    storeCommit(setStatusBarHeightCommitName, cache.data);
    //
    //
    return Promise.resolve(cache);
  }
  return _getStatusBarHeightBridge().then((res) => {
    storeCommit(setStatusBarHeightCommitName, res.data);
  });
}
// #endregion

//#region getConfig
export function getConfigBridgeWithRetry(
  _option: IRetryOption = BRIGE_DEFAULT_RETRY_OPTION,
  option2?: { preferCache: boolean }
) {
  const { preferCache } = option2 || {};
  if (preferCache && !window.GC.mainActivityTab) {
    //  wallet
    const cache =
      BridgeCache.Instance.getCache<IBridgeModelConfig>('getConfig');
    if (cache && cache.Result === 1) {
      storeCommit('base/setRegion', cache.data.region);
      if (cache.data.lang) {
        setCurrentLang(cache.data.lang);
      }
      if (cache.data.countryCode) {
        storeCommit(UNIVERSE_MUTATIONS.setCountryCode, cache.data.countryCode);
      }

      //
      _getConfig_bridge();
      //
      return Promise.resolve(cache);
    }
  }
  const p = retryWrap(_option, _getConfig_bridge).catch(catchRetryEx);
  // bridgePromiseCacheInstance.addPromiseCache(BRIDGE_CACHE_TYPE.GetConfig, p)
  return p;
}
// function getConfigBridgeWithCache(_option?: IRetryOption) {
//   const cacheP = bridgePromiseCacheInstance.tryGetPromiseSuccessCache(
//     BRIDGE_CACHE_TYPE.GetConfig
//   )
//   if (cacheP) {
//     return cacheP
//   }
//   return getConfigBridgeWithRetry(_option)
// }

// /**
//  *        getConfigBridge
//  */
// export async function getConfigBridgeNoCache() {
//   return getConfigBridgeWithCache({
//     retryCount: 0,
//     timeout: 0,
//   })
// }

//#endregion

//#region getAppInfo

// const needCheckAppVersion = true
export function getAppInfoBridgeWithRetry(
  _option: IRetryOption = BRIGE_DEFAULT_RETRY_OPTION,
  option2?: { preferCache: boolean }
) {
  const { preferCache } = option2 || {};
  if (preferCache && !window.GC.isCenter) {
    //  wallet
    const cache =
      BridgeCache.Instance.getCache<IBridgeModelAppInfo>('getAppInfo');
    if (cache && cache.Result === 1) {
      storeCommit('app/setAppInfo', {
        ...cache.data,
        // buildNum: window.GC.buildNum,
      });
      //
      _getAppInfo_bridge();
      //
      return Promise.resolve(cache);
    }
  }
  const p = retryWrap(
    _option || BRIGE_DEFAULT_RETRY_OPTION,
    _getAppInfo_bridge
  ).catch(catchRetryEx);
  return p;
}

// export function getAppInfoBridgeWithCache(_option?: IRetryOption) {
//   const cacheP = bridgePromiseCacheInstance.tryGetPromiseSuccessCache(
//     BRIDGE_CACHE_TYPE.GetAppInfo
//   ) as Promise<IBridgeResult<IBridgeModelAppInfo>>
//   if (cacheP) {
//     return cacheP
//   }
//   return getAppInfoBridgeWithRetry(_option)
// }

//#endregion

//#region getDeviceInfo

/**
 *  wallet
 *  : http         http
 */
export function initDeviceBridgeInfoByCache() {
  if (!window.GC.isInApp) {
    return;
  }
  if (!window.GC.isCenter) {
    //  wallet
    const cache =
      BridgeCache.Instance.getCache<IBridgeModelDeviceInfo>('getDeviceInfo');
    if (cache) {
      storeCommit('app/setDeviceInfo', cache.data);
      //
      _getDeviceInfo_bridge();
      //
      return Promise.resolve(cache);
    }
  }
}
function getDeviceInfoBridgeWithRetry(
  _option: IRetryOption = BRIGE_DEFAULT_RETRY_OPTION
) {
  const p = retryWrap(_option, _getDeviceInfo_bridge).catch(catchRetryEx);
  bridgePromiseCacheInstance.addPromiseCache(
    BRIDGE_CACHE_TYPE.GetDeviceInfo,
    p
  );

  return p;
}

/**
 *       （       ，       ）
 * @param _option
 */
export function getDeviceInfoBridgeWithCache(_option?: IRetryOption) {
  const cacheP = bridgePromiseCacheInstance.tryGetPromiseSuccessCache(
    BRIDGE_CACHE_TYPE.GetDeviceInfo
  ) as Promise<IBridgeResult<IBridgeModelDeviceInfo>>;
  if (cacheP) {
    return cacheP;
  }
  return getDeviceInfoBridgeWithRetry(_option);
}

export function clearGetDeviceInfoBridgeCache() {
  bridgePromiseCacheInstance.clearCacheItem(BRIDGE_CACHE_TYPE.GetDeviceInfo);
}

//    onViewResume  ，     getDeviceInfo
//#endregion

//#region canShowDownload_bridge
// function getCanShowDownloadWithRetry(
//   _option: IRetryOption = BRIGE_DEFAULT_RETRY_OPTION
// ) {
//   const p = retryWrap(_option, _canShowDownload_bridge)
//   bridgePromiseCacheInstance.addPromiseCache(
//     BRIDGE_CACHE_TYPE.CanShowDownload,
//     p
//   )
//   return p
// }

// export function getCanShowDownloadWithCache(_option?: IRetryOption) {
//   const cacheP = bridgePromiseCacheInstance.tryGetPromiseSuccessCache(
//     BRIDGE_CACHE_TYPE.CanShowDownload,
//     {
//       timeout: MS_MINUTE_5,
//     }
//   ) as Promise<IBridgeResult<IBridgeModelAppInfo>>
//   if (cacheP) {
//     return cacheP
//   }
//   return getCanShowDownloadWithRetry(_option)
// }

//#endregion

// export function getStatusBarHeightBridgeWithRetry(
//   _option: IRetryOption = BRIGE_DEFAULT_RETRY_OPTION_FOR_LOCAL
// ) {
//   const p = retryWrap(_option, getStatusBarHeightBridge);
//   return p;
// }

//#region getIsAPKListInstalledBatch

/**
 *       timeout(3   )
 */
export const getIsAPKListInstalledBatchWithTimeout = timeoutEnhance<
  [string[]],
  IBridgeResult<string[]>
>(3000, getIsAPKListInstalledBatch);

//#endregion
