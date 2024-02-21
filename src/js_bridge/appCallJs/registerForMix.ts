import { _onAppIntervalHandler } from '../jsCallApp/appInterval';
import { createBridgeRegisterHandler } from './appCallJsBaseUtils';
import { BRIGENAME_WEBVIEWBACK, onCommonWebviewBack } from './onWebviewBack';

let isRegisterMix = false;

// /**
//  *    mix
//  */
// export function tryRegisterBridgeForMix() {
//   waitAppBridge((bridge) => {
//     registerForMix(bridge);
//   });
// }

/**
 *          （    ，              ，      ）
 *
 * @param bridge
 */
export function registerForMix(bridge: IWebViewJavascriptBridge) {
  if (isRegisterMix) {
    return;
  }
  if (!window.GC.isInApp) {
    return;
  }
  isRegisterMix = true;
  const bridgeRegisterHandler = createBridgeRegisterHandler(bridge);

  //#region
  /**
   *
   */
  bridgeRegisterHandler(BRIGENAME_WEBVIEWBACK, onCommonWebviewBack);
  //#endregion
  //#region
  bridgeRegisterHandler<{ timerId: number }, boolean>(
    'onTimerHandle',
    (_, json) => {
      const result = _onAppIntervalHandler(json);
      if (result == null) {
        return null;
      } else {
        if (result == true) {
          //
          return {
            Result: 0,
          };
        } else {
          //
          return {
            Result: 1,
          };
        }
      }
    }
  );
  //#endregion
}
