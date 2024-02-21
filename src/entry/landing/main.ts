import { initVueInstance, tracePerfomance } from '@/entry/common/entry-init';
import { autoSetDtk } from '@/utils/tdk';
import { createVueI18nByQuery } from '../../init/i18n';
import {
  registerModulesForRemote,
  storeInitForRemote,
} from '../../store/initForEntryRemote';
import router from './router';
const i18n = createVueI18nByQuery();

tracePerfomance();
//       ，
// require('@/constants/history.ts')

//     dtk   og
autoSetDtk(i18n.locale as 'en' | 'id');
if (process.env.VUE_APP_ENV_NAME2 === 'sim') {
  require('../sim/sim-init');
}

initVueInstance(
  {
    i18n,
    router,
  },
  {
    beforeStoreInited: registerModulesForRemote,
    afterStoreInited: storeInitForRemote,
  }
);
//        ，
// if (window.GC.isInApp) {
//   connectWebViewJavascriptBridge()
// }
