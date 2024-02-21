// import i18n from '@/init/i18n' //
import { initVueInstance, tracePerfomance } from '@/entry/common/entry-init';
import { initGlobalBridgeListen } from '@/js_bridge/appCallJs/index';
import {
  registerModulesForWallet,
  storeInitForWallet,
} from '@/store/initForEntryWallet';
import { createVueI18nByQuery } from '../../init/i18n';
import router from './router';

const i18n = createVueI18nByQuery();

tracePerfomance();
try {
  initVueInstance(
    {
      i18n: i18n,
      // i18n,
      router,
    },
    {
      //
      beforeStoreInited: registerModulesForWallet,
      afterStoreInited: storeInitForWallet,
    }
  );
} catch (ex) {
  console.error('ERROR', ex);
}
//       ，   GC.appName
if (process.env.VUE_APP_ENV_NAME2 === 'sim') {
  require('../sim/sim-init');
}

if (window.GC.isInApp) {
  initGlobalBridgeListen();
}
