import type VueI18n from 'vue-i18n';
import type Router from 'vue-router';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import App from '@/App.vue';
import { startMaintainLocalStorage } from '@/controller/LocalStorageMng';
import '@/entry/common/injects'; //
import { initErrorCatch } from '@/init/errorCatch';

import store, { storeInit } from '@/store';
import '@/styles/index.less'; //
import '../../../tailwindcss/autobuilded.css';
import { getDateTimeStamp } from '@/utils/datetime';
import { tryTraceEvent } from '@/utils/trace';
import Vue from 'vue';
import './class-component-hooks';

Vue.config.productionTip = false;

Vue.config.ignoredElements = ['ib'];

initErrorCatch();

if (process.env.VUE_APP_ENV_SIM) {
  window.GC.pkgChannelName = 'CP_VGame';
}
export function tracePerfomance() {
  const performance = window.performance;
  //
  const curPerfNow = performance?.now && performance.now();
  const curVueBeginTime = getDateTimeStamp(); //   load_stTime  ，  Date
  // const traceEvent = H5Tracer.supportSendBeacon ? 'unload' : 'load'
  window.addEventListener(
    'load',
    () => {
      const loadEndTime = new Date().getTime();
      //
      function setPageInfo(
        curPerfNow: number,
        pageInfo: Record<string, string | number>
      ) {
        pageInfo.entryName = (location.hash || '').toLowerCase().substr(1);
        if (document.referrer) {
          pageInfo.referrer = document.referrer;
        }
        const loadStTime = window.pagePerfObj.loadStTime;
        if (loadStTime) {
          pageInfo.vueReady = curVueBeginTime - loadStTime;
          pageInfo.loadTime = loadEndTime - loadStTime;
        }
        if (!performance) {
          //
          return pageInfo;
        }
        if (curPerfNow) {
          pageInfo.appReady = Math.ceil(curPerfNow);
        }
        const t = performance.timing;
        if (!t) {
          return pageInfo;
        }
        pageInfo.loadPage = t.loadEventEnd - t.navigationStart;
        pageInfo.domReady = t.domComplete - t.responseEnd;
        pageInfo.redirect = t.redirectEnd - t.redirectStart;
        pageInfo.lookupDomain = t.domainLookupEnd - t.domainLookupStart;
        pageInfo.ttfb = t.responseStart - t.navigationStart;
        pageInfo.request = t.responseEnd - t.requestStart;
        pageInfo.loadEvent = t.loadEventEnd - t.loadEventStart;
        pageInfo.appcache = t.domainLookupStart - t.fetchStart;
        if (t.unloadEventEnd) {
          pageInfo.unloadEvent = t.unloadEventEnd - t.unloadEventStart;
        }
        pageInfo.connect = t.connectEnd - t.connectStart;

        return pageInfo;
      }

      setTimeout(() => {
        //     Readt
        let pagePerfObj = window.pagePerfObj;
        if (!pagePerfObj) {
          pagePerfObj = window.pagePerfObj = {} as any;
        }
        setPageInfo(curPerfNow, pagePerfObj);
        pagePerfObj.tracename = 'load';
        pagePerfObj.pkg_mode = window.GC.appName || 'unkown';
        pagePerfObj.ua = navigator.userAgent;
        const isBoundsAndNotMounted =
          window.GC.mainActivityTab === 'bounds' && !pagePerfObj.jsLoad2Mounted;
        if (isBoundsAndNotMounted) {
          pagePerfObj.noPerf = 1;
        } else {
          tryTraceEvent('vd-perf', pagePerfObj);
          console.log(
            '[DEBUG] Guide vd-perf',
            pagePerfObj,
            performance?.now && performance.now(),
            Date.now()
          );
        }
      }, 0);
    },
    false
  );
}

export function initVueInstance(
  otherProps: Partial<Vue> & { i18n?: VueI18n; router?: Router },
  options: {
    beforeStoreInited?: () => void;
    afterStoreInited?: () => void;
  }
) {
  const { beforeStoreInited, afterStoreInited } = options;
  // window.vue205 = vueInstance
  if (beforeStoreInited) {
    beforeStoreInited();
  }
  // if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
  //   console.log('[DEBUG] before storeInit');
  // }
  storeInit(); //   mount
  // if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
  //   console.log('[DEBUG] after storeInit');
  // }
  const vueInstance = (window.vue205 = new Vue({
    store,
    render: (h) => h(App),
    ...otherProps,
  }));
  vueInstance.$mount('#app');
  //     created
  if (afterStoreInited) {
    afterStoreInited();
  }

  startMaintainLocalStorage();
  // // init webview listen        ，
  // if (window.GC.isInApp) {
  //   connectWebViewJavascriptBridge()
  // }
  // if (window.GC.isWallet) {
  //   LocalStorageMng.Instance.startMaintain({
  //     cleanUpDelay: MS_SECOND_30
  //   })
  // }
  return vueInstance;
}
