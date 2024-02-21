import { getCurTopPageName } from '@/js_bridge/js_call_app_base';
import Vue from 'vue';
import Vuex from 'vuex';
import type { StoreType } from './interface/interface';
import { app, initApp } from './modules/app/app';
import { base, baseRootGetters, init as initBase } from './modules/base';
import { bridge, brigeRootGetters } from './modules/bridge';
import {
  config,
  configRootGetters,
  init as initConfig,
} from './modules/config';
import { tab } from './modules/tab';
import { universe, universeGetters } from './modules/universe/universe';
import { init as initUser, user } from './modules/user';

Vue.use(Vuex);

/**
 *      Store
 */
export const store = new Vuex.Store({
  modules: {
    base,
    universe,
    config,
    user,
    bridge,
    tab,
    app,
  },
  getters: {
    ...universeGetters,
    ...configRootGetters,
    ...baseRootGetters,
    ...brigeRootGetters,
  },
});

/**
 *  ：     mount   ！！！
 */
export function storeInit() {
  initConfig(store);
  // deviceId       ，      deviceId
  initApp();
  initBase();
  // userId       ，      userId
  initUser(store);

  if (window.GC.mainActivityTab) {
    getCurTopPageName().then((res) => {
      if (res.Result === 1) {
        const pageName = res.data;
        if (pageName === 'bounds' || pageName === 'wallet') {
          store.state.bridge.appTabName = pageName;
        }
      }
    });
  }
  // initCheckIn(store)
}
window.$ss = store;
export default store as StoreType;
