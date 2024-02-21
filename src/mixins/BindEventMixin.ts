/**
 * Bind event when mounted or activated
 * from vant
 */
import { noop } from 'lodash-es';
import Vue from 'vue';
import Component from 'vue-class-component';
import { off, OFF_FUNC, on, ON_FUNC } from '../utils/dom/event';
let uid = 0;

/**
 * MixinFactory
 * @param handler
 */
export function BindEventMixin<T extends Vue>(
  this: T,
  handler: (this: T, bind: ON_FUNC | OFF_FUNC, isBind: boolean) => void
) {
  const key = `@@binded_${uid++}`;

  function bind(this: T) {
    if (!(this as any)[key]) {
      handler.call(this, on, true);
      (this as any)[key] = true;
    }
  }

  function unbind(this: T) {
    if ((this as any)[key]) {
      handler.call(this, off, false);
      (this as any)[key] = false;
    }
  }

  return {
    mounted: bind,
    activated: bind,
    deactivated: unbind,
    beforeDestroy: unbind,
  };
}

type ClearFunc = () => void;

/**
 *  mixin         onInited
 *               ！！
 */
@Component({})
export default class BindEventMixinDefault extends Vue {
  mounted() {
    this.__inited(true);
  }
  activated() {
    this.__inited(false);
  }
  deactivated() {
    this.__destroy();
  }
  beforeDestroy() {
    this.__destroy();
  }

  private __inited(isMount: boolean) {
    if (!this.__isInited) {
      this.__isInited = true;
      this.__clearFunc = this.useInited(isMount) || noop;
    }
  }

  private __destroy() {
    if (this.__clearFunc) {
      this.__isInited = false;
      this.__clearFunc();
      this.__clearFunc = null;
    }
    if (this.__clearFuncs) {
      this.__clearFuncs.forEach((item) => {
        if (item) {
          item();
        }
      });
      this.__clearFuncs = [];
    }
  }
  //#region    data     (     )
  private __isInited?: boolean;
  /**
   *   onInited
   */
  private __clearFunc?: ClearFunc;

  private __clearFuncs?: ClearFunc[];
  //#endregion

  addClearFunc(clearFunc: ClearFunc) {
    if (!this.__clearFuncs) {
      this.__clearFuncs = [];
    }
    this.__clearFuncs.push(clearFunc);
  }

  removeClearFunc(clearFunc: ClearFunc) {
    if (this.__clearFuncs) {
      this.__clearFuncs = this.__clearFuncs.filter((item) => {
        return item !== clearFunc;
      });
    }
  }

  useInited(_isMount: boolean) {
    if (process.env.VUE_APP_ENV_SERVER === 'development') {
      console.warn('[Warining] onInited method should impl', this);
    }
    return noop;
  }
}
// let randomKey = 0;
// export function createBindEventMixin(name: string) {
//   randomKey++;
//   const isInitedKey = `__isInited_${randomKey}`;
//   const clearFunKey = `__clearFunc_${randomKey}`;
//   function initedFunc(this: BindEventMixinRandom) {
//     if (!this[isInitedKey]) {
//       this[isInitedKey] = true
//       this[clearFunKey] = this.useInited() || noop
//     }
//   }

//   function destroyFunc(this: BindEventMixinRandom) {
//     if (this[clearFunKey]) {
//       this[isInitedKey] = false
//       this[clearFunKey]
//       this[clearFunKey] = null
//     }
//   }
//   @Component({})
//   class BindEventMixinRandom extends Vue {
//     mounted() {
//       initedFunc.call(this)
//     }
//     activated() {
//       initedFunc.call(this)
//     }
//     deactivated() {
//       destroyFunc.call(this)
//     }
//     beforeDestroy() {
//       destroyFunc.call(this)
//     }
//     useInited() {
//       console.warn('[Warining] onInited method should impl', this)
//       return noop
//     }
//   }
//   return BindEventMixinRandom
// }

// console.log('Vue.config.optionMergeStrategies', Vue.config.optionMergeStrategies)
