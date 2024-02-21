import type { IRootGetter, IStoreStateType } from '@/store/interface/interface';
import 'axios';
import type Vue from 'vue';
import { Store } from 'vuex';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { VNode } from 'vue';
import type { LottiePlayer } from 'lottie-web';
declare global {
  interface IWebViewJavascriptBridge {
    init: (
      handler: (
        messsage: { handlerName: string; data: string; callbackId: string },
        responseCbFn: (json: unknown) => void
      ) => void
    ) => void;
    registerHandler: (
      handlerName: string,
      handlerCallback: (
        data: string,
        responseCbFn: (json: unknown) => void
      ) => void
    ) => void;
    callHandler: (
      handlerName: string,
      jsonStr: string,
      callback?: (rlt: string) => void
    ) => void;
  }
  interface Window {
    // REM: number;
    vue205: Vue;
    GAME_CTL: {
      Destroy: () => void;
      UpdateCoin: () => void;
    };
    $ss: Omit<Store<IStoreStateType>, 'getters'> & {
      getters: IRootGetter;
    };
    JBridge: {
      onMethodCb(data: {
        Result: 1 | 0;
        data: any;
        requestId: string;
        methodName: string;
      }): void;
    };
    Android: {
      savePic: (
        requestId: string,
        base64Str: Uint8Array,
        fileName: string
      ) => string;
      gameEvent: (json: string) => void;
      dispatchTouchEvent: (x: number, y: number) => void;
    };
    WebViewJavascriptBridge: IWebViewJavascriptBridge;
    lottie: LottiePlayer;
    PREFAB: {
      flexible: {
        getRootFontSize: () => number;
        addFontSizeChangedListener: (
          handler: (newFontSize: number) => void
        ) => void;
        removeFontSizeChangedListener: (
          handler?: (newFontSize: number) => void
        ) => void;
      };
    };
  }
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Element extends VNode {}
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}

declare module 'axios' {
  interface AxiosRequestConfig {
    /**
     *   V
     */
    isV?: boolean;
    /**
     *    Authorization/sign
     */
    noExtraHeader?: boolean;

    /**
     * concurrentTimeout(ms)   ，            ，
     * concurrentTimeout|cacheTimeout
     */
    concurrentTimeout?: number;

    /**
     *
     */
    disableLastCache?: boolean;

    /**
     *       Key
     * @returns   string
     */
    customRequestKeyConvertor?: (
      config: AxiosRequestConfig,
      baseList: string[]
    ) => void;
    /**
       * e.g: function(config,baseList){
      const headers = config.headers
      if(headers){
        if (headers.Authorization) {
          //  userId,deviceId  
          // todo user
          list.push(store.state.user.userId)
        } else {
          list.push('0')
        }
        if (headers.countryCode) {
          list.push(headers.countryCode)
        }
      }
      list.push('xxx=xxx')
    }
       */

    /**
     *                 （ms)
     *   ：     ，
     *
     */
    cacheTimeout?: number;

    useCacheCb?: (info: {
      createAt: number;
      status: string;
      updateAt?: number;
    }) => void;

    /**
     *   adapter    （ request.interceptors   ）
     */
    adapterCb?: (
      config: any,
      tools: {
        /**
         *   http   requestKey
         */
        convertRequestKey: (config: AxiosRequestConfig) => string;
      }
    ) => void;
  }
  interface AxiosResponse<T> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: AxiosRequestConfig;
    request?: any;
    /**
     *  V      adapter   updateAt
     */
    __updateAt?: number;
  }
}

// declare namespace API {
//   interface IHttpResponse<T> {
//     Result: number
//     Reason?: string
//     ErrCode?: number
//     // ErrCode?:number
//     data?: T
//     /**
//      *   response  status
//      */
//     status?: number

//     /**
//      *          (  perfomance time)
//      */
//     __updateAt: number
//   }

//   interface IHttpResponse2<T> {
//     status?: number
//     Result: number
//     Reason?: string
//     data?: T
//   }
// }

// export = API;
// export as namespace API
