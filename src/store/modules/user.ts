import { getStorageItemOperators } from '@/controller/CommonLocalStorage';

import type { IPushDeviceRegister } from '@/js_bridge/appCallJs/model';
import {
  dealNavigation,
  navigationCmdWaitForLoginOp,
} from '@/js_bridge/appPush';
import {
  getUserInfoBridgeWithRetry,
  isLoginAsyncBridgeWithRetry,
} from '@/js_bridge/js_call_app';
import type { IBridgeModelUserInfo } from '@/js_bridge/js_call_app.d';
import { getStore, storeDispatch } from '@/store/util';
import type { Module, Store } from 'vuex';
import { storeCommitAndPenetrate } from '../../js_bridge/jsCallApp/utilsPenetrate';
import type { IStoreStateType } from '../interface/interface';
import type { IModuleGetterType } from '../interface/interface.base';

const initialState = {
  //         bridge
  auth: '',
  //#region       （  |     ）

  /**
   * userId         userId
   */
  userId: '',
  nickName: '',
  // point: null as number,
  // realInviteCount: null as number,
  //#endregion

  //#region
  /**
   *     ，   ，
   *   ： accountLogin/accountLogout  /isLoginAsync/cache
   */
  isLogined: null as boolean | null,

  /**
   *
   */
  isLoginedFromReal: false,
  //#endregion
};
const defaultState = { ...initialState };
//
['isLogined', 'isLoginedFromReal'].forEach((item) => {
  delete (defaultState as any)[item];
});
export type UserState = typeof initialState;

const userGetterConfig = {
  /**
   *       logined
   * @param state
   * @returns
   */
  isRealLogined(state: UserState) {
    return state.isLogined && state.isLoginedFromReal;
  },
  // isUserLoginedAuthReady(state: UserState) {
  //   return state.isLogined && state.auth && state.isLoginedFromReal;
  // },
};

/**
 *  bridge   userId   normalize  ！
 * @param userId
 * @returns
 */
function normalizeUserId(userId?: string) {
  if (userId === 'null') {
    return '';
  }
  return userId || '';
}

//#region
const UserIsLoginLSOP = getStorageItemOperators<{
  isLogined: boolean;
  from: string;
}>('UserIsLogined', {});

const UserAuthLsOp = getStorageItemOperators<{ auth: string; userId: string }>(
  'UserAuthInfo',
  {}
);
/**
 *       （     ）
 * @param state
 * @param payload
 * @param doSaveCache     ，               （        ）
 */
function setIsLoginFromReal(
  state: UserState,
  payload: { isLogined: boolean; from: string },
  doSaveCache: boolean
) {
  if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
    console.log(
      '[user] update isLogined',
      payload.from,
      'old',
      state.isLogined,
      'to',
      payload.isLogined
    );
  }
  state.isLogined = payload.isLogined;
  state.isLoginedFromReal = true;
  if (doSaveCache) {
    UserIsLoginLSOP.setItem({
      isLogined: payload.isLogined,
      from: payload.from,
    });
  }
}

/**
 *
 * @param state
 * @param payload
 * @param doSaveCache     ，               （        ）
 */
function setUserAuthInfoFromReal(
  state: UserState,
  payload: { auth: string; userId: string },
  doSaveCache: boolean
) {
  state.auth = payload.auth;
  state.userId = payload.userId;
  if (doSaveCache) {
    UserAuthLsOp.setItem(payload);
  }
}
//#endregion
/**
 *
 */
export const user: Module<UserState, IStoreStateType> = {
  namespaced: true,
  state: initialState,
  mutations: {
    // deviceRegister   ，     auth
    updateUserByDeviceRegister(state, payload: IPushDeviceRegister) {
      setUserAuthInfoFromReal(
        state,
        { auth: '', userId: payload.userId },
        true
      );
      // state.gradeTypeName = payload.gradeTypeName
      // state.gradeType = payload.gradeType
      // state.point = payload.point;
    },
    resetUserLogout(state) {
      //   isLogined _waitUserLoginedForLanch
      for (const key in defaultState) {
        (state as any)[key] = (defaultState as any)[key];
      }
    },

    /**
     *   bridge    ，
     * @param state
     * @param payload
     */
    setUserInfoBridge(
      state,
      payload: {
        //.bridgeDirect | DataSource.bridgePush ，   bridgeCache
        data: IBridgeModelUserInfo;
      }
    ) {
      const { data: info } = payload;
      const userId = normalizeUserId(info.userId);
      //   isLogined,userId,auth
      setIsLoginFromReal(
        state,
        { isLogined: !!info.auth, from: 'bridge-auth' },
        true
      );
      //         auth
      setUserAuthInfoFromReal(state, { auth: info.auth || '', userId }, true);

      //   server-remote   ，   bridge
      state.nickName = info.nickName;
      // state.point = info.point;

      // //  bridge      ,          ，   bridge
      // state.realInviteCount = getNotNullValue(
      //   info.realInviteCount,
      //   initialState.realInviteCount
      // );
    },
    // account login( refreshUserInfoFromBridge  )/accountlogout
    setIsLogined(
      state,
      payload: {
        from: 'login' | 'logout' | 'isLoginAsync';
        isLogined: boolean;
      }
    ) {
      setIsLoginFromReal(state, payload, true);
    },
  },
  actions: {
    /**
     *       auth|
     * @returns
     */
    async refreshUserAuthInfoFromBridge(_) {
      try {
        const res = await getUserInfoBridgeWithRetry();
        if (res.Result === 1) {
          storeCommitAndPenetrate('user/setUserInfoBridge', {
            data: res.data,
          });
          return true;
        } else {
          if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
            console.log('[user] refreshUserInfoFromBridge Error', res);
          }
          return false;
        }
      } catch (ex) {
        if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log('[user] refreshUserInfoFromBridge Error', ex);
        }
        return false;
      }
    },
    /**
     *             ( auth  waitAuthReady=true)，      (isLogin        ，4*2s，       )
     * @param payload.timeout     ，        5s
     */
    async waitUserIsLogined(
      { state, dispatch },
      payload?: {
        /**
         *       AuthReady
         */
        waitAuthReady?: boolean;
      }
    ) {
      if (!window.GC.isInApp) {
        state.isLoginedFromReal = true;
        state.isLogined = false;
        return false;
      }
      const { waitAuthReady } = payload || {};

      let needRefreshUserAuthInfo = false;
      if (state.isLoginedFromReal) {
        if (state.isLogined && !state.auth) {
          needRefreshUserAuthInfo = true;
        }
      } else {
        //     ,     refreshUserAuthInfoFromBridge   isLogin    ：      ，   ，             ，  isLoginAsync
        const isLoginedRes = await isLoginAsyncBridgeWithRetry(); //       setIsLogined
        if (isLoginedRes.Result === 1 && isLoginedRes.data) {
          needRefreshUserAuthInfo = true;
        }
      }
      //            auth
      if (needRefreshUserAuthInfo) {
        const refreshUserInfoPromise = dispatch(
          'refreshUserAuthInfoFromBridge',
          {}
        );
        if (waitAuthReady) {
          await refreshUserInfoPromise;
        }
      }
      return state.isLogined;
    },
    //       userInfo
    async initUserInfoFromCache({ state }) {
      // 1.   isLogin userId，auth
      const isLoginItem = UserIsLoginLSOP.getItem();
      if (isLoginItem) {
        state.isLogined = isLoginItem.isLogined;
      }

      const userAuthInfo = UserAuthLsOp.getItem();
      if (userAuthInfo) {
        state.userId = userAuthInfo.userId;
        state.auth = userAuthInfo.auth;
      }
    },
  },
  getters: userGetterConfig,
};
export type IUserGetter = IModuleGetterType<typeof userGetterConfig, 'user'>;

const waitUserLoginActions = [] as (() => void)[];
/**
 *
 * @returns
 */
export function waitUserNextLogined() {
  return new Promise<void>((resolve) => {
    waitUserLoginActions.push(resolve);
  });
}
/**
 *
 */
export async function init(_store: Store<IStoreStateType>) {
  if (window.GC.isInApp) {
    //
    storeDispatch('user/initUserInfoFromCache');
    const store = getStore();
    const unlisten = store.watch(
      (state) => {
        return state.user.isLogined && state.user.isLoginedFromReal;
      },
      (newV) => {
        if (newV) {
          if (waitUserLoginActions) {
            waitUserLoginActions.forEach((action) => {
              if (action) {
                action();
              }
            });
          }
        }
      }
    );
    return [unlisten];
    // await store.dispatch('user/refreshUserAuthInfoFromBridge', {
    //   preferCache: true,
    // })
  }
  // if (process.env.VUE_APP_ENV_SERVER === 'development' && process.env.NODE_ENV === 'production') {
  //   const Sentry = (window as any).Sentry
  //   if (Sentry) {

  //     store.watch((state) => {
  //       return state.user.userId
  //     }, (userId) => {
  //       if (userId) {
  //         Sentry.configureScope(function (scope) {
  //           scope.setTag("inapp", window.GC.isInApp ? 1 : 0);
  //           scope.setUser({
  //             userId: userId
  //           });
  //           // scope.setTag("my-tag", "my value");
  //           // scope.setLevel("warning");
  //           // will be tagged with my-tag="my value"
  //           // Sentry.captureException(new Error("my error"));
  //         });
  //       }
  //     });
  //   }
  // }
}

export function initUserForWallet() {
  //   isLogin，

  const store = getStore();
  const unlisten = store.watch(
    (state) => {
      return state.user.isLogined && state.user.isLoginedFromReal;
    },
    (newV) => {
      if (newV) {
        //            navigation
        const cacheCmd = navigationCmdWaitForLoginOp.getItem();
        if (cacheCmd) {
          if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
            console.log(
              '[navigation] detect user logined,start to deal cacheCmd',
              cacheCmd
            );
          }
          navigationCmdWaitForLoginOp.removeItem();
          dealNavigation(cacheCmd);
        } else if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log('[navigation] detect user logined,no cacheCmd');
        }
      }
    }
  );
  return [unlisten];
}
