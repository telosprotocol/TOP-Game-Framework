/**
 * !!!
 *        ，
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import TraceDirective from '@/directives/trace';
import WebPDirective from '@/directives/webp';
import type { IStoreStateType } from '@/store/interface/interface';
import { tryTraceEvent, tryTraceEventV } from '@/utils/trace';
import PortalVue from 'portal-vue';
import Vue from 'vue';
import type { Store } from 'vuex';

//#region     /   Vue.prototype (   $   )

Vue.prototype.$trace = tryTraceEvent;

Vue.prototype.$tracev = tryTraceEventV;
//#endregion

//#region      Vue.directive
Vue.use(TraceDirective);
Vue.use(WebPDirective);
//#endregion

//#region      Vue.mixin
Vue.mixin({
  computed: {
    $ss() {
      return this.$store as Store<IStoreStateType>;
    },
  },
});
//#endregion

//#region      Vue.component
Vue.use(PortalVue);
//#endregion

// //#region     Vue.use (         ， ：vue-router、vuex、element-ui、i18n ...)
// // Vue.use(LazyLoad, Options) //
// Vue.use(Toast);
// //#endregion
