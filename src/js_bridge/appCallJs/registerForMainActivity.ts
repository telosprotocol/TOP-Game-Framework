import type { IGBusEventPayloadMap } from '@/utils/GBus-type';
import { emitGBus } from '@/utils/GBus';
import { storeCommit } from '@/store/util';
//   Activity  webview  ，   wallet earn tab
import { BIT_LOG_START_DETAIL, TrueResult } from '../BIT_LOG_ENUMS';
import { createBridgeRegisterHandler } from './appCallJsBaseUtils';

let isRegistered = false;
type GameGuideInfo = IGBusEventPayloadMap['onAppGameGuideFinish'];
let lastGameGuideFinish: GameGuideInfo = null;
export function registerForMainActivity(bridge: IWebViewJavascriptBridge) {
  if (isRegistered) {
    return;
  }
  isRegistered = true;
  const bridgeRegisterHandler = createBridgeRegisterHandler(bridge);
  /**
   * bounds/wallet    
   */
  bridgeRegisterHandler<
    { index: number; name: 'bounds' | 'wallet' | string },
    boolean
  >(
    'onWalletTabChecked',
    (_str, json) => {
      //     store,    vue    
      storeCommit('bridge/setAppActiveTab', {
        ...json,
        from: 'app',
      });
      emitGBus('onWalletTabChecked', json);
      // emitGBus('mainActivityTabChecked', {
      //   tabName: json.name as MainActivityTabName,
      // });
      return TrueResult;
    },
    {
      logType: BIT_LOG_START_DETAIL,
    }
  );
  /**
   * bounds    
   *
   */
  bridgeRegisterHandler<GameGuideInfo, boolean>(
    'gameGuideFinish',
    (_str, json) => {
      emitGBus('onAppGameGuideFinish', json);
      lastGameGuideFinish = json;
      return TrueResult;
    },
    {
      logType: BIT_LOG_START_DETAIL,
    }
  );
}
export function getLastGameGuideFinish() {
  return lastGameGuideFinish;
}
