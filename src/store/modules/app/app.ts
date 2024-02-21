import { storeDispatch } from '@/store/util';

import {
  getAdvertisingInfo_bridge,
  initDeviceBridgeInfoByCache,
} from '@/js_bridge/js_call_app';
import type {
  IBridgeModelAdInfo,
  IBridgeModelAppInfo,
  IBridgeModelDeviceInfo,
} from '@/js_bridge/js_call_app.d';
import type { Module } from 'vuex';

import { timeoutEnhance } from '../../../utils/promise';
import type { IStoreStateType } from '../../interface/interface';
import type { IModuleGetterType } from '../../interface/interface.base';

/**
 * apk  （    Http      ）
 */
const initalState = {
  appType: '2001',
  buildNum: window.GC.buildNum,
  /**
   *    ，   userAgent
   */
  versionName: window.GC.appVersion || '',
  versionCode: null as number | null,
  clientInfo: '',
  deviceId: '',
  gaInfo: {} as Partial<IBridgeModelAdInfo>,
};

export type AppState = typeof initalState;
const appGettersConfig = {
  // /**
  // *   APP
  // * @param state
  // */
  // checkMinVersionCode(state: AppState) {
  //   return function (versionCode: number) {
  //     if (state.versionCode < versionCode) {
  //       return true
  //     }
  //     return false
  //   }
  // },
} as const;
export const app: Module<AppState, IStoreStateType> = {
  namespaced: true,
  state: initalState,
  mutations: {
    setAppInfo(state, payload: IBridgeModelAppInfo) {
      // state.appType=payload.appType
      // state.buildNum=payload.buildNum
      // state.versionName=payload.versionName
      // state.versionCode=payload.versionCode;
      //  ： bulidNum  window.GC.buildNum
      //buildNum  h5 buildNum
      ['appType', 'versionName', 'versionCode'].forEach((key) => {
        (state as any)[key] = payload[key as keyof IBridgeModelAppInfo];
      });
    },
    setDeviceInfo(state, payload: IBridgeModelDeviceInfo) {
      // if(payload && payload.deviceId){
      state.deviceId = payload.deviceId;
      state.clientInfo = payload.clientInfo;
      // }
    },
  },
  actions: {
    async updateAdInfo({ state }) {
      const res = await timeoutEnhance(3000, getAdvertisingInfo_bridge)();
      const isSuccess = res.Result === 1;
      if (isSuccess) {
        state.gaInfo = res.data || {};
      }
      return isSuccess;
    },
  },
  getters: appGettersConfig,
};

export function initApp() {
  //  wallet        device
  initDeviceBridgeInfoByCache();
}

// type InterfaceAppGetters = IAppGetters

export type IAppGeteter = IModuleGetterType<typeof appGettersConfig, 'app'>;

export function updateAdInfo() {
  return storeDispatch('app/updateAdInfo') as Promise<boolean>;
}
