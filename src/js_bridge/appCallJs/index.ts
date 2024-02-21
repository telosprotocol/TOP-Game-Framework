import { TAG_APPCALL } from '../appCallJs/appCallJsBaseUtils';
import { waitAppBridge } from '../waitAppBridge';
import { registerForLocal } from './registerForLocal';

const IGNORE_UNHANDLELOGS: Record<string, boolean> = { updateMsgInfo: true };
/**
 *       (  bridge    )
 */
export function initGlobalBridgeListen() {
  waitAppBridge((bridge) => {
    bridge.init(function (
      message: { handlerName: string; data: string; callbackId: string },
      responseCallback
    ) {
      const data = {
        Result: 0,
        message: 'Not Registered',
      };
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        if (!IGNORE_UNHANDLELOGS[message.handlerName]) {
          console.log(
            `%c${TAG_APPCALL} UnRegisterPush ${message.handlerName} %o`,
            'color:#aaa',
            message
          );
        }
      }
      if (responseCallback) {
        responseCallback(data);
      }
    });

    //
    registerForLocal(bridge);
  });
}
