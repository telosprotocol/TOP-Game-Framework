import { initGlobalBridgeListen } from '@/js_bridge/appCallJs/index';
import Vue from 'vue';
import Router from 'vue-router';
import { createVueI18nByQuery } from '../../init/i18n';
import {
  registerModulesForDialog,
  storeInitForDialog,
} from '../../store/initForEntryDialog';
import '../common/class-component-hooks';
import { initVueInstance } from '../common/entry-init';
import router from './router';

if (process.env.VUE_APP_ENV_SIM) {
  // APP
  document.documentElement.style.background = 'rgba(0,0,0,0.5)';
}

const i18n = createVueI18nByQuery();

Vue.use(Router);
initVueInstance(
  {
    i18n,
    router,
  },
  {
    beforeStoreInited: registerModulesForDialog,
    afterStoreInited: storeInitForDialog,
  }
);

//       ，   GC.appName
if (process.env.VUE_APP_ENV_NAME2 === 'sim') {
  require('../sim/sim-init');
}

// init webview listen
if (window.GC.isInApp) {
  initGlobalBridgeListen();
}
