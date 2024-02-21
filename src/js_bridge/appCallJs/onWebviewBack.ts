import { TrueResult } from '../BIT_LOG_ENUMS';
import { close_bridge } from '../js_call_app_base';
import { registerHandlerOverride } from './appCallJsBaseUtils';

export const BRIGENAME_WEBVIEWBACK = 'webviewBack';

const RES_APP_DOCLOSE = {
  Result: 1,
  data: false, //preventDefault=false
};
const RES_APP_DO_NOTHING = TrueResult;
/**
 * webviewBack      （  registerForMix   ）
 * @returns
 */
export function onCommonWebviewBack() {
  //preventDefault=true
  //
  // const $route = window.vue205.$route;
  // if ($route) {
  //   //
  //   if ($route.meta && $route.meta.noWebviewBack) {
  //     //
  //     //       webviewBack  ，
  //     if (process.env.VUE_APP_ENV_SERVER === 'development') {
  //       console.log('ignore webviewBack');
  //     }
  //     if (window.GC.isCenter) {
  //       return RES_APP_DOCLOSE;
  //     }
  //     return RES_APP_DO_NOTHING;
  //   }
  // }
  //
  const isGoHistoryBack = isGoHistoryBackForInApp();
  if (isGoHistoryBack) {
    window.vue205.$router.go(-1);
    //
    return RES_APP_DO_NOTHING;
  } else {
    return RES_APP_DOCLOSE;
  }
}

/**
 *
 * false:
 * true:
 */
export function isGoHistoryBackForInApp() {
  const $route = window.vue205.$route;
  if ($route && $route.query && $route.query.backMode) {
    return $route.query.backMode === 'back';
  }
  return false;
}

/**
 *    goBack
 *     ：
 *    ：  query.backMode
 */
export function goBackForAppBrowser() {
  let isGoHistoryBack = true;
  // console.log('goBack', this, this?.$route)
  if (window.GC.isInApp && !process.env.VUE_APP_ENV_SIM) {
    //              close
    isGoHistoryBack = isGoHistoryBackForInApp();
  }

  if (isGoHistoryBack) {
    window.vue205.$router.go(-1);
  } else {
    setTimeout(() => {
      close_bridge();
    }, 100);
  }
}

/**
 *
 * @param cb   true:   Webview, false:   Webview,null/undefined:  common
 */
export function overideOnWebviewBack(cb: () => boolean | undefined | null) {
  registerHandlerOverride(BRIGENAME_WEBVIEWBACK, () => {
    const isClose = cb();
    if (isClose === true) {
      return RES_APP_DOCLOSE;
    } else if (isClose === false) {
      return RES_APP_DO_NOTHING;
    } else {
      return onCommonWebviewBack();
    }
  });
  return resetOverideOnWebviewBack;
}

function resetOverideOnWebviewBack() {
  registerHandlerOverride(BRIGENAME_WEBVIEWBACK, onCommonWebviewBack);
}
