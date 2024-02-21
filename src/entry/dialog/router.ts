import { ROUTENAME_INAPP_NOTFOUND } from '@/constants/localRoutePath';
import Router from 'vue-router';

/**
 *   ：       path   /dialog/
 */
const router = new Router({
  routes: [
    {
      path: '*',
      name: ROUTENAME_INAPP_NOTFOUND,
      meta: {},
      component: () => {
        return import(`@/views-dialog/NotFound.vue`);
      },
    },
  ],
});
if (process.env.VUE_APP_ENV_SIM) {
  //    ,
  router.getRoutes().map((item) => {
    if (item.path === '*') {
      return;
    }
    if (item.path.toLowerCase().indexOf('/dialog/') !== 0) {
      throw new Error('The route path invalid,need startwith:/dialog/ !!!');
    }
  });
}

//          loading
export default router;
