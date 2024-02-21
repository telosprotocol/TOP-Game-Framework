import { initVueInstance, tracePerfomance } from '@/entry/common/entry-init';
import { initGlobalBridgeListen } from '@/js_bridge/appCallJs/index';
import {
  registerModulesForMix,
  storeInitForMix,
} from '@/store/initForEntryMix';
import { autoSetDtk } from '@/utils/tdk';
import { createVueI18nByQuery } from '../../init/i18n';
import router from './router';

const i18n = createVueI18nByQuery();

tracePerfomance();
//     dtk   og
autoSetDtk(i18n.locale as 'en' | 'id');
initVueInstance(
  {
    i18n,
    router,
  },
  {
    beforeStoreInited: registerModulesForMix,
    afterStoreInited: storeInitForMix,
  }
);
//       ，   GC.appName
if (process.env.VUE_APP_ENV_NAME2 === 'sim') {
  require('../sim/sim-init');
}
if (window.GC.isInApp) {
  //       tryRegisterBridgeForMix
  initGlobalBridgeListen();
}

// //       bridge   ，
// if (window.GC.isInApp) {
//   connectWebViewJavascriptBridge()
// }
