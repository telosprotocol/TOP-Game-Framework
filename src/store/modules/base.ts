import { webpFilter } from '@/directives/webp';
import { convertBgImageStyle, convertUrlExpression } from '@/utils/styles';
import { getStore, storeDispatch } from '@/store/util';

import {
  getCountryCodeLs,
  setRegionCodeLs,
} from '@/controller/PersistentLocalStorage';
import {
  clearGetDeviceInfoBridgeCache,
  getAppInfoBridgeWithRetry,
  getConfigBridgeWithRetry,
} from '@/js_bridge/js_call_app';
import type { Module } from 'vuex';
import { logConfig } from '../../config/debug';
import type { IRootGetter, IStoreStateType } from '../interface/interface';
import type { IGetterType } from '../interface/interface.base';

//#region Region
const FALLBACK_REGION = 'US';
const initalRegion = getRegionBySearch();
//   url  versionCountry
function getRegionBySearch() {
  // 1.search
  let queryRegion = location.search && getRegionQuery(location.search);
  if (queryRegion) {
    setRegionCodeLs(queryRegion);
    return queryRegion;
  }

  // 2.hash
  queryRegion = location.hash && getRegionQuery(location.hash);
  if (queryRegion) {
    setRegionCodeLs(queryRegion);
    return queryRegion;
  }
  function getRegionQuery(searchStr: string) {
    const matches = searchStr.match(/[?&]r=(\w+)/);
    if (matches && matches.length > 0) {
      const rCode = matches[1];
      if (rCode && rCode.length > 0) {
        return rCode.toUpperCase();
      }
    }
  }
  // 3.localStorage
  const versionCountry = getCountryCodeLs();
  return versionCountry || FALLBACK_REGION;
}
//#endregion
const initalState = {
  /**
   *
   */
  region: initalRegion,

  //#region

  netChangeNumberFlag: 0,
  //#endregion

  //#region http
  httpParamReady: {
    getReady: Promise.resolve(false),
  },
  /**
   *  http     httpParam     httpParamUpdatedFlag
   *    auth    flag
   */
  httpAuthFlag: '',

  /**
   *         flag
   *  :      ，
   */
  httpLocalFlag: '',

  //#endregion

  //#region Debug

  /**
   *   reactive logConfig     （  ）
   */
  logConfig: {
    /**
     *        subCategory
     */
    showTaskId: logConfig.showTaskId,
  },
  //#endregion

  //#region rootFontSize
  /**
   *  fontSize,store
   */
  rootFontSize: window.PREFAB.flexible.getRootFontSize(),
  //#endregion
};

export type BaseState = typeof initalState;

export const base: Module<BaseState, IStoreStateType> = {
  namespaced: true,
  state: initalState,
  mutations: {
    setRegion(state, payload: string) {
      if (payload) {
        state.region = payload.toUpperCase();
      }
    },
    //#region
    setNetworkChange(state) {
      state.netChangeNumberFlag++;
    },

    //#endregion
  },
  actions: {
    /**
     *     http  ，           (http     )
     * @param param0
     */
    async refreshHttpParams(
      { rootState, dispatch, state, rootGetters },
      _payload: { isFromHttp?: boolean }
    ) {
      const { isFromHttp } = _payload || {};
      let resolveFn: (result: boolean) => void;
      const httpParamReady = {
        getReady: new Promise<boolean>((resolve) => {
          resolveFn = resolve;
        }),
      };
      state.httpParamReady = httpParamReady;
      clearGetDeviceInfoBridgeCache();
      try {
        // await isLoginBridgeWithRetry() //   auth  ，  isLogin
        if (!rootState.user.auth) {
          await dispatch(
            'user/refreshUserAuthInfoFromBridge',
            {},
            {
              root: true,
            }
          );
        }
        const resConfigInfo = await getConfigBridgeWithRetry(null, {
          preferCache: isFromHttp,
        });
        const resAppInfo = await getAppInfoBridgeWithRetry(null, {
          preferCache: isFromHttp,
        });
        if (resConfigInfo.Result === 0 || resAppInfo.Result === 0) {
          resolveFn(false);
          throw Error('get config error');
        }
        resolveFn(true);
        const httpLocalFlag = rootGetters.realHttpLocalFlag;
        state.httpLocalFlag = httpLocalFlag;
        state.httpAuthFlag =
          httpLocalFlag +
          `|${rootState.user.auth || ''}|${rootState.user.userId}`;
      } catch (ex) {
        resolveFn(false);
        throw ex;
      }
    },

    /**
     *  http    http
     * @param param0
     */
    async waitHttpParamsInited({ state }) {
      const isParamInited = await state.httpParamReady.getReady;
      if (!isParamInited) {
        //
        await storeDispatch('base/refreshHttpParams', { isFromHttp: true });
      }
    },
  },
};

/**
 *  http    http
 *      :
 *
 * lang/region/countryCode
 * appType/versionName/buildNum/versionCode
 *
 */
export function waitHttpParamsInited() {
  return storeDispatch('base/waitHttpParamsInited');
}
export const BASEREMPX = 16; //1rem=16px
export const baseRootGetters = {
  designSizeZoom(state: IStoreStateType) {
    const rootFontSize = state.base.rootFontSize;
    return rootFontSize / BASEREMPX;
  },
  /**
   * @param state
   */
  designPxToReal(_state: IStoreStateType, getters: IRootGetter) {
    const designSizeZoom = getters.designSizeZoom;

    /**
     *
     * @param designPx
     */
    return function (designPx: number) {
      return designSizeZoom * designPx;
    };
  },
  designPxsObjToReal(_state: IStoreStateType, getters: IRootGetter) {
    const designSizeZoom = getters.designSizeZoom;

    /**
     *          (   number     px  ，    )
     * @param designPx
     */
    return function (pxObj: Record<string, number | string>) {
      const res: any = {};
      Object.keys(pxObj).forEach((item) => {
        const itemValue = pxObj[item];
        if (typeof itemValue === 'number') {
          res[item] = (designSizeZoom * itemValue).toFixed(5) + 'px';
        } else {
          res[item] = itemValue;
        }
      });
      return res as CSSStyleDeclaration;
    };
  },

  normalizeCss(_state: IStoreStateType, getters: IRootGetter) {
    return function (
      pxObj: Record<string, number | string>,
      bgUrl?: string,
      isWebp?: boolean
    ) {
      const res = getters.designPxsObjToReal(pxObj);
      if (bgUrl) {
        res.backgroundImage = convertUrlExpression(
          isWebp ? webpFilter(bgUrl) : bgUrl
        );
      }
      return res;
    };
  },
  convertBgImageStyle() {
    return convertBgImageStyle;
  },
};

export type IBaseRootGetter = IGetterType<typeof baseRootGetters>;

//#region fontsize
window.PREFAB.flexible.addFontSizeChangedListener((newFontSize) => {
  const store = getStore();
  store.state.base.rootFontSize = newFontSize;
});
//#endregion

export function init() {
  const store = getStore();
  store.watch(
    (_state, getters) => {
      return getters.realHttpLocalFlag as string;
    },
    (v) => {
      store.state.base.httpLocalFlag = v;
    },
    {
      immediate: true,
    }
  );
}
