import { logConfig } from '@/config/debug';
import { longNumberStrFormat } from '@/utils/';
import { BIT_LOG_END, BIT_LOG_START } from './BIT_LOG_ENUMS';
import BridgeCache from './BridgeCache';
import type { IBridgeResult } from './js_call_app.d';
import { tryLogEnd, tryLogStart } from './utils';
import { waitAppBridge } from './waitAppBridge';

export const nativeEnv = {
  isNative: null as boolean | null,
  setIsNative() {
    if (!nativeEnv.isNative) {
      nativeEnv.isNative = true;
    }
  },
};
//#region base
export const TAG_JSCALL = '[JsCall]';

/**
 *   bridge
 * @param methodName
 * @param json
 * @param _simRes        process.env.VUE_APP_ENV_SIM &&      build
 */
export function callBridgePromise<T>(
  methodName: string,
  json: { [key: string]: any } | string,
  options?: {
    /**
     *      localStoradge
     */
    cache?: boolean;
    formatLongNumber?: boolean;
    //            （       ）
    dontStringify?: boolean;
    /**
     *      (BIT_LOG_START...)
     */
    logType?: number;
  }
) {
  return new Promise<IBridgeResult<T>>((resolve) => {
    if (!window.WebViewJavascriptBridge) {
      console.log(`${TAG_JSCALL}-BridgeNotReady`, methodName, json);
    }
    const { cache, formatLongNumber, logType, dontStringify } = options || {};
    if (process.env.VUE_APP_ENV_SERVER === 'development') {
      //
      if (typeof json === 'string' && dontStringify !== true) {
        throw new Error(
          'js call app ' +
            methodName +
            ' sholud set options.dontStringify =true'
        );
      } else if (typeof json === 'object' && dontStringify === true) {
        throw new Error(
          'js call app ' +
            methodName +
            'sholud set options.dontStringify =false'
        );
      }
    }
    const ignoreLog = logConfig.bCallIgnore[methodName] || 0;

    if (!(ignoreLog & BIT_LOG_START)) {
      tryLogStart(logType, 'bpull', `${TAG_JSCALL}-CALL`, methodName, json);
    }
    waitAppBridge((winObj) => {
      const jsonStr = dontStringify ? (json as string) : JSON.stringify(json);
      winObj.callHandler(methodName, jsonStr, (rlt) => {
        nativeEnv.setIsNative();
        try {
          if (formatLongNumber) {
            rlt = longNumberStrFormat(rlt);
          }
          const res = JSON.parse(rlt) as IBridgeResult<T>;
          if (!(ignoreLog & BIT_LOG_END)) {
            tryLogEnd(logType, 'bpull', `${TAG_JSCALL}-END`, methodName, res);
          }
          if (cache) {
            if (res.Result === 1) {
              BridgeCache.Instance.setCache(methodName, res);
            }
          }
          resolve(res);
        } catch (ex) {
          console.error('JsonParseError', rlt);
          resolve({
            Result: 0,
            Reason: 'Error',
          });
        }
      });
    });
  });
}
export function callBridge(
  methodName: string,
  json: { [key: string]: any } | string,
  option?: {
    /**
     *      (BIT_LOG_START...)
     */
    logType: number;
  }
) {
  const { logType } = option || {};
  if (!window.WebViewJavascriptBridge) {
    console.log('[Bridge]-BridgeNotReady', methodName, json);
  }
  waitAppBridge((winObj) => {
    const ignoreLog = logConfig.bCallIgnore[methodName];
    if (!(ignoreLog & BIT_LOG_START)) {
      tryLogStart(logType, 'bpull', `${TAG_JSCALL}-CALL`, methodName, json);
    }
    const data = typeof json === 'string' ? json : JSON.stringify(json);
    winObj.callHandler(methodName, data);
  });
}
