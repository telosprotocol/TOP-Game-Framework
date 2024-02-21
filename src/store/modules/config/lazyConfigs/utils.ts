import ThrottleController from '@/controller/ThrottleController';
import { getStore, storeDispatch } from '@/store/util';
import Vue from 'vue';
import { configOptionsMap } from '../configOptions';
import type { IConfigOptions } from '../IConfigOptions';
import type { ConfigKey } from '../IConfigState';

const ConfigNumUtilsMap: { [configKey: string]: ConfigNumUtils<unknown> } = {};
export type ConfigNumUtils<T> = {
  getConfig: () => T;
  //     
  forceUpdate: () => void;
  //       （     ）
  tryGetConfig: () => Promise<T>;
};
/**
 *    config( configMap[configNum]      ，         )
 *     configMap            initialValue
 * @param configNum
 * @param config
 * @returns
 */

export function tryInitConfigCommon<T>(
  configNum: ConfigKey,
  config: Omit<IConfigOptions<T>, 'throttleIns'> & {
    initialValue: T;
    //       
    watch?: (newV: T) => void;
  }
) {
  let configUtils = ConfigNumUtilsMap[configNum] as ConfigNumUtils<T>;
  if (configUtils) {
    return configUtils;
  }
  const store = getStore();
  if (!configOptionsMap[configNum]) {
    const configStatusMap = store.state.config.configStatusMap;
    const configOption = {
      throttleIns: new ThrottleController('Config' + configNum),
      initMode: config.initMode,
      overtimeMs: config.overtimeMs,
      getConfig: config.getConfig,
      setConfig: config.setConfig || 'setConfigObj',
    } as IConfigOptions<T>;
    configOptionsMap[configNum] = configOption as any;
    configOption.throttleIns.init(() => {
      store.dispatch('config/tryGetConfig', { configNum });
    });
    //    
    configStatusMap[configNum] = {
      httpFlag: '',
      updateTime: 0,
      currentHttpFlag: '',
      isInitedByLocal: false,
      currentPromise: null,
    };
    Vue.set(store.state.config.configMap, configNum, {
      ...config.initialValue,
    });
    if (config.watch) {
      getStore().watch(() => {
        return store.state.config.configMap[configNum] as T;
      }, config.watch);
    }
  }
  let isInited = false;
  function tryGetConfig() {
    isInited = true;
    return storeDispatch<T>('config/tryGetConfig', { configNum });
  }
  // tryGetConfig();
  configUtils = {
    getConfig() {
      if (!isInited) {
        tryGetConfig();
      }
      return store.state.config.configMap[configNum] as T;
    },
    //     
    forceUpdate() {
      storeDispatch('config/updateConfig', { configNum });
    },
    //       （     ）
    tryGetConfig,
  } as ConfigNumUtils<T>;

  ConfigNumUtilsMap[configNum] = configUtils;
  return configUtils;
}
