import { getStatusBarHeight } from '@/js_bridge/js_call_app';
import { emitGBus } from '@/utils/GBus';
import type { IGBusEventPayloadMap } from '@/utils/GBus-type';
import { debounce, throttle } from 'lodash-es';
import type { Module } from 'vuex';
import { setStatusColor_bridge } from '../../js_bridge/js_call_app_base';
import type { IStoreStateType } from '../interface/interface';
import type {
  IGetterType,
  IModuleGetterType,
} from '../interface/interface.base';
import { getStore } from '../util';

const initalState = {
  statusColor: '#ffffff',
  /**
   * px :       getters statusBarHeight（     ）
   */
  statusBarHeight: 25,

  // /*
  //  *   : (  refer  )
  //  */
  // isShowFriendsFlag: 0,

  // /**
  //  *
  //  *  :                 ， Wallet
  //  */
  // updateFriendsListFlag: 0,

  //#region webview

  /**
   * Wallet,Webview     flag(   2  )
   */
  webviewResumeFlag: 0,

  /**
   *
   */
  webviewResumeFlagThrottled: 0,

  //#region app
  /**
   * app
   *   null
   */
  isAppBackground: null as boolean | null,

  // /**
  //  * app
  //  */
  // appBgSwitchFlag: 0,
  //#endregion

  /**
   * app  activity
   */
  isMainActivityUnVisible: null as boolean | null,

  /**
   * appTabName
   */
  appTabName: null as string | null,

  //#endregion

  /**
   * Wallet         activity
   * for Wallet
   */
  isWalletAttach: false,

  /**
   *       push
   */
  isAppOpenPushPrivilege: null as boolean | null,
};

const setWebviewThrottled = debounce(() => {
  const store = getStore();
  store.state.bridge.webviewResumeFlagThrottled++;
}, 2000);
export type BridgeState = Omit<typeof initalState, 'isAppBackground'> & {
  isAppBackground?: boolean | null;
};
//#region webviewResumeCallback
const webviewResumeCallbackStack: (() => void)[] = [];
const clearWebviewResumeStack = throttle(function clearWebviewResumeStack() {
  while (webviewResumeCallbackStack.length > 0) {
    const cb = webviewResumeCallbackStack.pop();
    cb && cb();
  }
}, 300);

export function addWebViewResumeCallback(payload: () => void) {
  webviewResumeCallbackStack.push(payload);
}
//#endregion

const bridgeGetterConfig = {
  isCurWalletTabActive(
    state: BridgeState,
    getters: {
      isMainActivityActive: boolean;
    }
  ) {
    const isWalletTab = state.appTabName === 'wallet';
    return isWalletTab && getters.isMainActivityActive;
  },

  /**
   *      Activity    （    ）
   * @param state
   * @returns
   */
  isMainActivityActive(state: BridgeState) {
    return state.isMainActivityUnVisible !== true;
  },
  /**
   *     app    （    ）
   * @param state
   * @returns
   */
  isAppActive(state: BridgeState) {
    return state.isAppBackground !== true;
  },

  // /**
  //  *
  //  */
  // isAppOpenPushPrivilege(state: BridgeState) {
  //   if (state.isAppOpenPushPrivilege == null) {
  //     storeDispatch('bridge/refreshIsUserOpenPushPrivilege');
  //     return true; //     ，
  //   }
  //   return !!state.isAppOpenPushPrivilege;
  // },
};
export const bridge: Module<BridgeState, IStoreStateType> = {
  namespaced: true,
  state: initalState,
  mutations: {
    setStatusBarHeight(state, payload: number) {
      const devicePixelRatio = window.devicePixelRatio;
      if (payload != null && devicePixelRatio) {
        state.statusBarHeight = Math.floor(payload / devicePixelRatio);
      }
    },
    setStatusColor(state, payload: { color: string; isDark: boolean }) {
      if (window.GC.isInApp) {
        const isColorRefreshed = state.statusColor !== payload.color;
        state.statusColor = payload.color;
        if (isColorRefreshed) {
          setStatusColor_bridge(payload);
        }
      }
    },
    // setShowFriendsFlag(state) {
    //   state.isShowFriendsFlag++;
    // },

    /**
     * onViewResume onWalletTabChecked
     * @param state
     * @param payload
     */
    setAppActiveTab(state, payload: { name: string; from?: string }) {
      state.isAppBackground = false; // APP
      state.isMainActivityUnVisible = false;
      // const oldAppTabName = state.appTabName
      state.appTabName = payload.name;
    },
    // app MainActivity
    setMainActivityToBg(state, _payload: { isAppBackground: boolean }) {
      state.isMainActivityUnVisible = true;
    },
    setAppFrontBack(state, payload: IGBusEventPayloadMap['appBgSwitch']) {
      const { isFront } = payload;
      state.isAppBackground = !isFront;
      state.isMainActivityUnVisible = true;
      // state.appBgSwitchFlag += 1
      emitGBus('appBgSwitch', payload);
    },
    setWebviewResumeFlag(
      state,
      payload: {
        isCurWebviewActive: boolean;
      }
    ) {
      if (payload && payload.isCurWebviewActive) {
        state.webviewResumeFlag++;
        setWebviewThrottled();
      }
      clearWebviewResumeStack();
    },
    setWalletAttach(state) {
      state.isWalletAttach = true;
      //     statusBarHeight
      getStatusBarHeight();
    },
  },
  actions: {
    // async refreshIsUserOpenPushPrivilege({ state }) {
    //   tryInitIsAppOpenPushPrivilege();
    //   const res = await getIsUserOpenPush();
    //   if (res.Result === 1) {
    //     state.isAppOpenPushPrivilege = res.data;
    //     // console.log('[DEBUG] isAppOpenPushPrivilege updated', res.data)
    //   }
    // },
  },
  getters: bridgeGetterConfig,
};

let isStatusBarHeightUpdated = false;
export const brigeRootGetters = {
  statusBarHeight(state: IStoreStateType) {
    if (!isStatusBarHeightUpdated) {
      isStatusBarHeightUpdated = true;
      getStatusBarHeight();
    }
    return state.bridge.statusBarHeight;
  },
  //     h5     statusBar  （       statusBarHeight）
  h5StatusBarHeight(_state: IStoreStateType, getters: any) {
    if (getters.supportFullscreen) {
      return getters.statusBarHeight;
    }
    return 0;
  },
  //
  supportFullscreen(_state: IStoreStateType) {
    if (!window.GC.isInApp) {
      return false;
    }
    return true; //
  },
};

export type IBridgeRootGetter = IGetterType<typeof brigeRootGetters>;
// let isAppOpenPushPrivilegeInited = false;
// function tryInitIsAppOpenPushPrivilege() {
//   if (isAppOpenPushPrivilegeInited) {
//     return;
//   }
//   isAppOpenPushPrivilegeInited = true;

//   const store = getStore();
//   const unlistenRefreshPushSetting = store.watch(
//     (state) => {
//       return state.bridge.webviewResumeFlag;
//     },
//     () => {
//       //
//       storeDispatch('bridge/refreshIsUserOpenPushPrivilege');
//     }
//   );

//   const unlistenOpen = store.watch(
//     (state) => {
//       return state.bridge.isAppOpenPushPrivilege;
//     },
//     (v, oldV) => {
//       if (v === true && oldV === false) {
//         //      ：
//         reportTaskBehavior({
//           subCategory: TASK_SUBCATEGORY_TYPES.OPEN_PUSH_SETTINGS,
//           count: 1,
//           from: 'H5',
//           needReport: true,
//         });
//         unlistenOpen();
//         unlistenRefreshPushSetting();
//       }
//     }
//   );
// }

export type IBridgeGeteter = IModuleGetterType<
  typeof bridgeGetterConfig,
  'bridge'
>;
// {
//   'bridge/isCurWalletTabActive': boolean,
//   /**
//    *      Activity    （    ）
//    * @param state
//    * @returns
//    */
//   'bridge/isMainActivityActive': boolean
//   /**
//    *     app    （    ）
//    * @param state
//    * @returns
//    */
//   'bridge/isAppActive': boolean

//   /**
//    *
//    */
//   'bridge/isAppOpenPushPrivilege': boolean
// }
