import { IRootGetter, IStoreStateType } from '@/store/interface/interface';
import { IVueI18n } from 'vue-i18n/types';
import VueRouter, { RawLocation, Route } from 'vue-router';
import { Store } from 'vuex/types';
// declare module 'vue/types/options' {
//   interface ComponentOptions<V extends Vue> {
//     store?: Store<IStoreModules>
//   }
// }
declare module 'vue/types/vue' {
  interface Vue {
    // $store: Store<IStoreModules>
    $ss: Omit<Store<IStoreStateType>, 'getters'> & {
      getters: IRootGetter;
    };

    $trace: (
      eventName: string,
      data?: { [key: string]: string | number | boolean },
      _forceNative?: boolean
    ) => void;

    /**
     * V
     */
    $tracev: (
      eventName: string,
      data?: { [key: string]: string | number | boolean }
    ) => void;

    beforeRouteEnter?(
      to: Route,
      from: Route,
      next: (to?: RawLocation | false | ((vm: Vue) => void)) => void
    ): void;

    beforeRouteLeave?(
      to: Route,
      from: Route,
      next: (to?: RawLocation | false | ((vm: Vue) => void)) => void
    ): void;

    beforeRouteUpdate?(
      to: Route,
      from: Route,
      next: (to?: RawLocation | false | ((vm: Vue) => void)) => void
    ): void;
  }
  interface VueConstructor {
    $route: Route;
    $router: VueRouter;
    $store: Store<IStoreStateType>;
    $i18n: IVueI18n;
  }
  // export interface VueConstructor {
  //   $store: Store<IStoreModules>
  // }
}

declare module '*.less' {
  const value: string | { [key: string]: string };
  export default value;
}
// declare module '*.gif'
// declare module '*.bmp'
// declare module '*.tiff'
