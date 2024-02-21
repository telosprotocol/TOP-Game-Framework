import { logConfig } from '@/config/debug';
import { BIT_LOG_END, BIT_LOG_START } from '../BIT_LOG_ENUMS';
import { tryLogEnd, tryLogStart } from '../utils';
import { waitAppBridge } from '../waitAppBridge';

export const TAG_APPCALL = '[AppCall]';
export type BridgeReturnData<R> = {
  Result: number;
  data?: R;
  Reason?: string;
};
export type BridgeRegisterHandlerType<TPushEvent, TReturn> = (
  data: string,
  json: TPushEvent | undefined,
  responseCallback: unknown
) =>
  | Promise<BridgeReturnData<TReturn>>
  | BridgeReturnData<TReturn>
  | null
  | undefined;

const isHandlerRegisteredMap: {
  [method: string]: BridgeRegisterHandlerType<any, any>;
} = {};
async function setRegisterHandler<TPushEvent, TReturn>(
  bridge: IWebViewJavascriptBridge,
  methodName: string,
  cb: BridgeRegisterHandlerType<TPushEvent, TReturn>,
  options?: {
    /**
     *     Json
     */
    dontParse?: boolean;

    logType?: number;
  },
  overide?: boolean
) {
  const oldCb = isHandlerRegisteredMap[methodName];
  if (oldCb === cb) {
    //    
    return true;
  }
  if (oldCb && !overide) {
    console.warn(
      '[Bridge] you have register method for more than 1 times with different cb',
      methodName
    ); //   
    return false;
  }

  isHandlerRegisteredMap[methodName] = cb;
  bridge.registerHandler(methodName, async function (data, responseCallback) {
    // if (!responseCallback) {
    //   console.log(TAG, methodName, 'responseCallback=null')
    //   return
    // }
    const { dontParse, logType = 0 } = options || {};
    let json: TPushEvent;
    if (!dontParse) {
      try {
        json = JSON.parse(data);
      } catch {
        console.log(TAG_APPCALL, methodName, 'JSON parse Error');
      }
    }

    const ignoreLog = logConfig.bPushIgnore[methodName] || 0;

    if (!(ignoreLog & BIT_LOG_START)) {
      tryLogStart(logType, 'bpush', `${TAG_APPCALL}`, methodName, json || data);
    }
    try {
      const ret = await cb(data, json, responseCallback);
      if (ret) {
        if (!(ignoreLog & BIT_LOG_END)) {
          tryLogEnd(logType, 'bpush', `${TAG_APPCALL}-Return`, methodName, ret);
        }
        responseCallback && responseCallback(ret);
      }
    } catch (ex) {
      console.log('[ERROR]', TAG_APPCALL, methodName, ex);
      responseCallback &&
        responseCallback({
          Result: 0,
          Reason: `[H5] ${methodName} deal errors`,
        });
    }
  });
  return true;
}

/**
 * Overide         
 * @returns       
 */
export async function registerHandlerOverride<TPushEvent, TReturn>(
  methodName: string,
  cb: BridgeRegisterHandlerType<TPushEvent, TReturn>,
  options?: {
    /**
     *     Json
     */
    dontParse?: boolean;

    logType?: number;
  }
) {
  return waitAppBridge((bridge) => {
    return setRegisterHandler(bridge, methodName, cb, options, true);
  });
}
/**
 *     app    (      )
 * @param methodName    
 * @param cb     
 * @param options
 * @param overide           
 * @returns       
 */
export async function tryInitRegisterHandler<TPushEvent, TReturn>(
  methodName: string,
  cb: BridgeRegisterHandlerType<TPushEvent, TReturn>,
  options?: {
    /**
     *     Json
     */
    dontParse?: boolean;

    logType?: number;
  },
  overide?: boolean
) {
  return new Promise<boolean>((resolve) => {
    waitAppBridge((bridge) => {
      resolve(
        setRegisterHandler(
          bridge,
          methodName,
          cb,
          options,
          overide
        ) as Promise<boolean>
      );
    });
  });
}

export function createBridgeRegisterHandler(bridge: IWebViewJavascriptBridge) {
  return function bridgeRegisterHandler<TPushEvent, TReturn>(
    methodName: string,
    cb: BridgeRegisterHandlerType<TPushEvent, TReturn>,
    options?: {
      /**
       *     Json
       */
      dontParse?: boolean;

      logType?: number;
    },
    overide?: boolean
  ) {
    return setRegisterHandler(bridge, methodName, cb, options, overide);
  };
}

// /**
//  * apk          (taskOwner='h5')
//  * 1.          （     ），    true-->      
//  * 2.          （urlSchema.url）,       ,         
//  * @param info
//  * @returns            
//  */
// export function waitPackageOpened(info: {
//   urlSchema: string,
//   url: string,
//   packageName:string
// }) {
//   const { urlSchema } = info
// }
