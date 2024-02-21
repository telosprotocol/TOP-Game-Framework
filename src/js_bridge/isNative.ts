import { nativeEnv } from './jsCallAppBaseUtils';

//#region
/**
 *          apk ( wallet      )
 */

export function isNative() {
  if (nativeEnv.isNative == null) {
    return window.GC.isInApp;
  }
  return nativeEnv.isNative;
}
