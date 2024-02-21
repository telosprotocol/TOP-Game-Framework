import {
  ROUTENAME_INAPP_V_TOPUP_RANKING,
  ROUTENAME_INAPP_V_TOPUP_RANKING_INTRO,
  ROUTENAME_INAPP_NOTFOUND,
  ROUTEPATH_V_TOPUP_RANKING_INTRO_MIX,
  ROUTEPATH_V_TOPUP_RANKING_MIX,
  ROUTEPATH_V_TOPUP_RANKING_MIX2,
  ROUTEPATH_V_TOPUP_RANKING_INTRO_MIX2,
} from '@/constants/localRoutePath';
import Router from 'vue-router';
import { initRouterHook } from '../common/router-init';

if (process.env.VUE_APP_ENV_NAME2 === 'sim') {
  require('../sim/sim-init');
}
//        /mix
const router = new Router({
  routes: [
    {
      path: ROUTEPATH_V_TOPUP_RANKING_MIX,
      name: ROUTENAME_INAPP_V_TOPUP_RANKING,
      alias: [ROUTEPATH_V_TOPUP_RANKING_MIX2],
      meta: { noKeepAlive: true },
      component: () => import('@/V/TopupRankingPage.vue'),
    },
    {
      path: ROUTEPATH_V_TOPUP_RANKING_INTRO_MIX,
      name: ROUTENAME_INAPP_V_TOPUP_RANKING_INTRO,
      alias: [ROUTEPATH_V_TOPUP_RANKING_INTRO_MIX2],
      meta: { noKeepAlive: true },
      component: () => import('@/V/TopupRankingIntroPage.vue'),
    },

    // {
    //   path: ROUTEPATH_V_TOPUP_RANKING_DST_INTRO_MIX,
    //   name: ROUTENAME_INAPP_V_TOPUP_RANKING_DST_INTRO,
    //   meta: { noKeepAlive: true },
    //   component: () => import('@/V/TopupRankingDSTIntroPage.vue'),
    // },
    // ...Activity,
    {
      path: '*',
      name: ROUTENAME_INAPP_NOTFOUND,
      meta: {
        to: 'index.html',
      },
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
    if (
      item.path.toLowerCase().indexOf('/mix/') !== 0 &&
      item.path.toLowerCase().indexOf('/mix2/') !== 0
    ) {
      // console.log('[Invalid Route]', item);
      throw new Error(
        'The route path invalid,need startwith:/mix/ or /mix2/ !!!'
      );
    }
  });
}
export default router;
