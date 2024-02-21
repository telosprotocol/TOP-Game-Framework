import { ROUTENAME_INAPP_NOTFOUND } from '@/constants/localRoutePath';
import Router from 'vue-router';
import { initRouterHook } from '../common/router-init';

const router = new Router({
  routes: [
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

export default router;
