import BrandName from '@/constants/BrandName';
import { setMetaInfo } from '@/utils/tdk';
import { getI18nIns } from '@/init/i18n';
import store from '@/store';
import { waitUserIsLoginedOnly } from '@/store/modules/user.utils';
import { tryTraceEvent } from '@/utils/trace';
import Vue from 'vue';
import Router from 'vue-router';
import type { ErrorHandler } from 'vue-router/types/router';
// import { checkIsAllowRoute } from './routes-util'

const originalPush = Router.prototype.push;
Router.prototype.push = function push(
  location,
  onResolve?: () => void,
  onReject?: ErrorHandler
) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }
  return (originalPush.call(this, location) as any).catch((err: Error) => err);
};

Vue.use(Router);
console.log('[Enter]', location.href);

function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

export function initRouterHook(router: Router) {
  router.beforeEach(async (to, from, next) => {
    if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
      console.log('[Router] beforeEach to=', to.path, from.path);
    }

    tryTraceEvent('pv', {
      path: to.path,
      route_name: to.name,
      pathlower: to.path ? to.path.toLowerCase() : '',
      url: location.href,
      referrer: document.referrer || '',
      // label: to.fullPath,
      // ua: navigator.userAgent,
    });
    const vGamePerfObj =
      window.pagePerfObj || ({} as typeof window.pagePerfObj);

    vGamePerfObj.pvRouteName = to.name;
    if (from) {
      vGamePerfObj.pvFromRouteName = from.name;
    }
    vGamePerfObj.pvPerf = performance?.now && performance.now();
    let title;
    if (to.meta) {
      title = to.meta.title;
      if (to.meta.titleLang) {
        const i18n = getI18nIns();
        title = i18n.t(to.meta.titleLang) as string;
      }
      if (process.env.VUE_APP_ENV_SERVER === 'development') {
        if (window.GC.isInApp && !title) {
          title = to.name; //        name,  debug
        }
      }
    }
    setMetaInfo('title', (title as string) || BrandName);
    const requireLogined = !!to.meta?.requireLogined;
    if (requireLogined) {
      //                bridge  dontPreferCacheIfNotLogin
      const oldIsLogined = store.state.user.isLogined;
      if (!oldIsLogined) {
        if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log('[Router] requireLogin', oldIsLogined);
        }
        // isLogined      ， Wallet     ，    isLogined       ，
        //     ，Wallet        ，       （     ？）
        const isLogined = await waitUserIsLoginedOnly(); //     auth
        //
        if (!isLogined) {
          console.log(
            '[Router] NotLogin',
            to,
            from,
            isLogined,
            'real',
            store.state.user.isLoginedFromReal
          );
          next('/RequireLogin?from=' + encodeURIComponent(to.path));
          return;
        }
      }
    }
    if (vGamePerfObj.pvPerf) {
      vGamePerfObj.pvPerfBeforeSpan =
        performance?.now && performance.now() - vGamePerfObj.pvPerf;
    }
    scrollToTop();
    next();
  });
}
