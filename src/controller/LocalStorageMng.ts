import { MS_SECOND } from '@/constants/time';
import { safePerformanceTimeNow } from '@/utils/datetime';

import { startsWith } from 'lodash-es';
import { onGBus } from '../utils/GBus';
import { H5Version } from '@/config/version';
import {
  getPenetrateDataRawLs,
  PENETRATE_KEY,
  PENETRATE_TIMEOUT,
  removePenetrateDataLs,
} from './CommonLocalStorage';
import {
  getCurLSVersionInfoLs,
  setCurLSVersionInfoLs,
} from './PersistentLocalStorage';
/**
 *  H5 ( )
 *  1
 */
const LOCALSTORAGE_GLOBAL_VERSION_NUM = 2;

/**
 *  ， ， key
 */
/**
 *  （ ， localStorage ）
 */
/**
 *  localStorage
 * @param option
 */
export function startMaintainLocalStorage() {
  const curVersionInfo = getCurLSVersionInfoLs();
  const lsVersionNum = curVersionInfo ? curVersionInfo.lsVersionNum : 0;
  // 1 ， clear,1
  if (lsVersionNum > 1 && lsVersionNum < LOCALSTORAGE_GLOBAL_VERSION_NUM) {
    try {
      if (process.env.VUE_APP_ENV_SERVER === 'development') {
        console.log(
          '[LocalStorage] lsVersionNum To Lower to clear',
          lsVersionNum,
          curVersionInfo
        );
      }
      localStorage.clear();
    } catch (ex) {
      console.log('ClearError', ex);
    }
  }

  //  localStorage
  setCurLSVersionInfoLs({
    lsVersionNum: LOCALSTORAGE_GLOBAL_VERSION_NUM,
    versionName: H5Version,
  });
  if (localStorage.getItem('APK001_walletversion')) {
    //  APK001_xxx
    if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
      console.log('[LocalStorageMng] prefix will be cleaned:');
    }
    setTimeout(() => {
      const DelPrefix = 'APK001_';
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        const needCleanUp = startsWith(key, DelPrefix);
        //  predixList.some(p => {
        //   return
        // })
        if (needCleanUp) {
          localStorage.removeItem(key);
        }
      }
    }, MS_SECOND * 10);
  }
}

//#region

let lastTimerForWallet: ReturnType<typeof setTimeout>;
/**
 * Wallet
 */
export function startMaintainLocalStorageForWallet() {
  if (lastTimerForWallet != null) {
    return;
  }
  //  penetrate
  lastTimerForWallet = setTimeout(() => {
    const lsOriginKey = [] as string[];
    for (let i = 0; i < localStorage.length; i++) {
      const lsKey = localStorage.key(i);
      if (lsKey) {
        lsOriginKey.push(lsKey);
      }
    }
    lsOriginKey.forEach((item) => {
      if (item.startsWith(PENETRATE_KEY)) {
        const itemPDKey = item.substring(PENETRATE_KEY.length);
        //
        getPenetrateDataRawLs(itemPDKey);
      }
    });
  }, PENETRATE_TIMEOUT * 1.5);
  if (process.env.VUE_ENV_HAS_PENETRATE_USECACHE) {
    //#region  （ webview ）
    const lsKeyListForPenetrateWallet: { key: string; dt: number }[] = [];
    let lastConsumeTimer = null as ReturnType<typeof setTimeout> | null;
    const intervalMsForWalletRemove = PENETRATE_TIMEOUT * 1.2;
    onGBus('walletPenetrateKey', (lsKey) => {
      if (lsKey) {
        lsKeyListForPenetrateWallet.push({
          key: lsKey,
          dt: safePerformanceTimeNow() + intervalMsForWalletRemove,
        });
      }
      Promise.resolve(true).then(() => {
        //  tick
        tryConsumeCurrentLsKeyList();
      });

      //  lsKeyListForWallet
      /**
       *  lsKeyListForWallet
       * @returns
       */
      function tryConsumeCurrentLsKeyList() {
        if (lastConsumeTimer) {
          clearTimeout(lastConsumeTimer);
        }
        if (lsKeyListForPenetrateWallet.length === 0) {
          return;
        }
        const dtNow = safePerformanceTimeNow();
        /**
         *
         * @returns idx -1( )
         */
        function findLastRemoveIdx() {
          let startIdx = 0,
            endIdx = lsKeyListForPenetrateWallet.length - 1,
            result = -1;
          do {
            const midIdx = Math.floor((startIdx + endIdx) / 2);
            const midItem = lsKeyListForPenetrateWallet[midIdx];
            if (midItem.dt > dtNow) {
              //
              endIdx = midIdx - 1;
            } else {
              //
              startIdx = midIdx + 1;
              result = midIdx;
            }
          } while (endIdx >= startIdx);
          return result;
        }
        const idx = findLastRemoveIdx();
        if (idx === -1) {
          return;
        }
        const listToRemove = lsKeyListForPenetrateWallet.splice(0, idx + 1);
        for (let i = 0; i < listToRemove.length; i++) {
          const item = listToRemove[i];
          removePenetrateDataLs(item.key);
        }
        if (lsKeyListForPenetrateWallet.length > 0) {
          //  ，
          lastConsumeTimer = setTimeout(
            tryConsumeCurrentLsKeyList,
            intervalMsForWalletRemove
          );
        }
      }
    });

    //#endregion
  }
}
//#endregion
