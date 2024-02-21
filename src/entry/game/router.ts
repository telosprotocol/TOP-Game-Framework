import BrandName from '@/constants/BrandName';
import {
  ROUTEPATH_GAME_PP_ZOUSI,
  ROUTENAME_INAPP_PP_ZOUSI,
  ROUTENAME_INAPP_NOTFOUND,
} from '@/constants/localRoutePath';
import Router from 'vue-router';
import { initRouterHook } from '../common/router-init';

if (process.env.VUE_APP_ENV_NAME2 === 'sim') {
  require('../sim/sim-init');
}
const APP_TITLE = BrandName;
//        /g/
const router = new Router({
  routes: [
    {
      name: ROUTENAME_INAPP_PP_ZOUSI,
      path: ROUTEPATH_GAME_PP_ZOUSI,
      meta: {
        title: APP_TITLE,
      },
      component: () => import(`@/views-mix/PlayForm/index.vue`),
    },
    {
      path: '*',
      name: ROUTENAME_INAPP_NOTFOUND,
      meta: {},
      component: () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return import(`@/views/NotFound`);
      },
    },
  ],
});

initRouterHook(router);
if (process.env.VUE_APP_ENV_SIM) {
  //    ,
  router.getRoutes().map((item) => {
    if (item.path === '*') {
      return;
    }
    if (item.path.toLowerCase().indexOf('/g/') !== 0) {
      // console.log('[Invalid Route]', item);
      throw new Error(
        'The route path invalid,need startwith:/mix/ or /mix2/ !!!'
      );
    }
  });
}
export default router;
