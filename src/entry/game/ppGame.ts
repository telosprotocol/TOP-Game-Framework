import { tracePerfomance } from '@/entry/common/entry-init';
import { initGlobalBridgeListen } from '@/js_bridge/appCallJs/index';
import store, { storeInit } from '@/store';

import { autoSetDtk } from '@/utils/tdk';
import type VueI18n from 'vue-i18n';
import Vue from 'vue';
import { createVueI18nByQuery } from '../../init/i18n';
import PPGame from '@/modules/Game/PPGame.vue';
import { initErrorCatch } from '@/init/errorCatch';

Vue.config.productionTip = false;
Vue.config.ignoredElements = ['ib'];

initErrorCatch();

const i18n = createVueI18nByQuery();

tracePerfomance();
autoSetDtk(i18n.locale as 'en' | 'id');
initVueInstance({
  i18n,
});

export function initVueInstance(otherProps: Partial<Vue> & { i18n?: VueI18n }) {
  storeInit();
  const vueInstance = (window.vue205 = new Vue({
    store,
    render: (h) => h(PPGame),
    ...otherProps,
  }));
  vueInstance.$mount('#app');

  return vueInstance;
}

if (process.env.VUE_APP_ENV_NAME2 === 'sim') {
  require('../sim/sim-init');
}
if (window.GC.isInApp) {
  initGlobalBridgeListen();
}
