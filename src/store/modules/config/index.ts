import { getJsonConfigByCache } from '@/http/api/config/configUtils';

import type { IConfig20Model } from '@/store/modules/config/globalConfigs/Config20CountryCodeConfig';
import { getStore, storeCommit, storeDispatch } from '@/store/util';
import { safePerformanceTimeNow } from '@/utils/datetime';
import Vue from 'vue';
import type { Module, Store } from 'vuex';

import type { IStoreStateType } from '../../interface/interface';
import type { IConfigStatusInfo } from './configInitialState';
import { configStatusMap } from './configInitialState';
import { configOptionsMap } from './configOptions';
import type { ConfigKey, ConfigState } from './IConfigState';

/**
 * Debug
 * 0：
 * 1:
 * 2:
 */
const LOG_TYPE = process.env.VUE_APP_ENV_SERVER === 'development' ? 2 : 0;

enum NeedUpdateType {
  /**
   *
   */
  None = 0,

  /**
   *
   */
  Timeout = 1,

  /**
   *       ，
   */
  DataChanged = 2,
}

const initalState: ConfigState = {
  configMap: {},
  configStatusMap,
};

export const config: Module<ConfigState, IStoreStateType> = {
  namespaced: true,
  state: initalState,
  mutations: {
    //    key
    setConfigObj(state, payload: { configNum: number; data: any }) {
      const { configNum, data } = payload;
      const configInfo = state.configMap[configNum as ConfigKey];
      if (data) {
        for (const key in data) {
          if ((configInfo as any)[key] === undefined) {
            Vue.set(configInfo, key, data[key]);
          } else {
            (configInfo as any)[key] = data[key];
          }
        }
      }
    },
  },
  actions: {
    /**
     *       ，  ！！！
     *            throttle
     * @returns boolean
     */
    async updateConfig(
      { state, rootState, dispatch },
      payload: { configNum: ConfigKey }
    ) {
      const { configNum } = payload;
      const configStatus: IConfigStatusInfo = state.configStatusMap[configNum];
      const httpLocalFlag = rootState.base.httpLocalFlag;

      const configNumConfig = configOptionsMap[configNum];

      configStatus.currentHttpFlag = httpLocalFlag;

      if (LOG_TYPE >= 2) {
        if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log(
            '[Config] updateConfig',
            configNum,
            'httpLocalFlag',
            httpLocalFlag
          );
        }
      }
      let updatePromise = Promise.resolve(false);
      try {
        updatePromise = configNumConfig
          .getConfig()
          .then((res) => {
            if (res.Result === 1) {
              if (rootState.base.httpLocalFlag === httpLocalFlag) {
                //
                tryCommit(configNum, res.data);
                if (LOG_TYPE) {
                  if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
                    console.log('[Config] updated', configNum, res.data);
                  }
                }
                configStatus.currentPromise = null;
                configStatus.updateTime = safePerformanceTimeNow();
                configStatus.httpFlag = httpLocalFlag;
              } else {
                setCurrentPromimseResolved();

                dispatch('tryGetConfigRaw', payload);
                if (LOG_TYPE) {
                  if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
                    console.log(
                      '[Config] ignore config loaded httpLocalFlag changed',
                      configNum,
                      httpLocalFlag,
                      rootState.base.httpLocalFlag
                    );
                  }
                }
              }
            } else {
              setCurrentPromimseResolved();
            }
            return res.Result === 1;
          })
          .catch((_ex) => {
            if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
              console.log('[Config] UpdateConfigError', _ex);
            }
            setCurrentPromimseResolved();
            return false;
          });
        configStatus.currentPromise = updatePromise;
        configNumConfig.throttleIns.setReqPromise(updatePromise, {
          curFlag: httpLocalFlag,
        });
      } catch (ex) {
        if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log('[Config] UpdateConfigError', ex);
        }
      }

      function setCurrentPromimseResolved() {
        if (configStatus.currentPromise === updatePromise) {
          configStatus.currentPromise = null;
        }
      }
      const isOk = await updatePromise;
      return isOk;
    },
    async initFromLocal(
      { state },
      payload: {
        configNum: ConfigKey;
        /**
         * default/ :   ，       ，
         * clear:      ，     ，
         *
         */
        mode?: 'default' | 'clear';
      }
    ) {
      const { configNum, mode } = payload;
      const configStatus: IConfigStatusInfo = state.configStatusMap[configNum];
      // init by local
      const cacheItem = getJsonConfigByCache(configNum);
      if (cacheItem || mode === 'clear') {
        if (LOG_TYPE) {
          if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
            console.log('[Config] init config FromCache', configNum);
          }
        }
        tryCommit(configNum, cacheItem.data);
        // console.log(
        //   '[Config] init config  After',
        //   configNum,
        //   JSON.stringify(state.configMap[configNum])
        // )
        configStatus.isInitedByLocal = true;
      }
    },
    /**
     *     ，
     *     ：
     * 1.        overtime   （  30  ）
     * 2.httpFlag
     * 3.
     */
    async tryGetConfigRaw(
      { state, dispatch, rootState },
      payload: { configNum: ConfigKey }
    ) {
      const { configNum } = payload;
      const configStatus: IConfigStatusInfo = state.configStatusMap[configNum];
      const configNumConfig = configOptionsMap[configNum];

      const result = {
        /**
         *
         */
        isOk: true,

        /**
         *
         */
        isThrottled: false,

        /**
         *
         */
        needUpdate: false,
        // /**
        //  *
        //  */
        // isInitedThisTime: false,
      };
      // 1.
      let isInitedByLocalThisTime = false; //
      if (configNumConfig.initMode !== 'never') {
        if (!configStatus.isInitedByLocal) {
          //
          dispatch('initFromLocal', { configNum });
          isInitedByLocalThisTime = true; //!!configStatus.isInitedByLocal
          // result.isInitedThisTime = true
        }
      }

      // 2.
      const needUpdateType = needUpdateInstantly();
      if (needUpdateType !== NeedUpdateType.None) {
        result.needUpdate = true;
        // 2.a
        if (configNumConfig.initMode !== 'never' && !isInitedByLocalThisTime) {
          //
          switch (needUpdateType) {
            case NeedUpdateType.Timeout: //
              break;
            case NeedUpdateType.DataChanged: //
              if (configStatus.isInitedByLocal) {
                dispatch('initFromLocal', {
                  configNum,
                  mode: configNumConfig.initMode,
                });
                // result.isInitedThisTime = true
              }
              break;
          }
        }
        // let needThrottle = false;//DataChanged
        // if (needUpdateType !== NeedUpdateType.DataChanged) {
        //   // 2.b
        //   needThrottle = configNumConfig.throttleIns.needThrottle({
        //     curFlag: rootState.base.httpLocalFlag,
        //   })
        // } else {
        //   //
        // }
        const needThrottle = configNumConfig.throttleIns.needThrottle({
          curFlag: rootState.base.httpLocalFlag,
        });
        if (needThrottle) {
          result.isThrottled = true;
          //dispatch('tryGetConfig', { configNum })
        } else {
          const isOk = await dispatch('updateConfig', { configNum });
          result.isOk = isOk;
        }
      } else {
        //realHttpLocalFlag
        if (configStatus.currentPromise) {
          //
          // dispatch('initFromLocal', { configNum })
          //
          const currentPromise = configStatus.currentPromise;
          try {
            result.isOk = await currentPromise;
          } catch (ex) {
            if (configStatus.currentPromise === currentPromise) {
              configStatus.currentPromise = null;
            }
            result.isOk = false;
          }
          if (!result.isOk) {
            if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
              console.log(
                '[Config] lastUpdateError,retry this time',
                configNum
              );
            }
            dispatch('tryGetConfig', { configNum }); //       ，
          }
        }
      }

      /**
       *  ： DataChanged httpFlag
       * @returns
       */
      function needUpdateInstantly() {
        const httpLocalFlag = rootState.base.httpLocalFlag;
        const { httpFlag, updateTime, currentHttpFlag, currentPromise } =
          configStatus;

        if (currentPromise) {
          //
          if (currentHttpFlag !== httpLocalFlag) {
            //   lang countryCode
            if (LOG_TYPE > 1) {
              if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
                console.log(
                  `[Config] NeedUpdate`,
                  'httpLocalFlagUpdate last request canceled',
                  'cur=',
                  httpLocalFlag,
                  'last=',
                  currentHttpFlag,
                  currentPromise
                );
              }
            }
            return NeedUpdateType.DataChanged;
          }
          return NeedUpdateType.None;
        } else {
          if (httpFlag !== httpLocalFlag) {
            //   lang countryCode
            return NeedUpdateType.DataChanged;
          }
          //
          if (
            updateTime + configNumConfig.overtimeMs <
            safePerformanceTimeNow()
          ) {
            return NeedUpdateType.Timeout;
          }
          return NeedUpdateType.None;
        }
      }
      return result;
    },
    /**
     *     ，
     */
    async tryGetConfig({ state, dispatch }, payload: { configNum: ConfigKey }) {
      await dispatch('tryGetConfigRaw', payload);
      //
      return state.configMap[payload.configNum];
    },
  },
};

function tryCommit(configNum: ConfigKey, data: unknown) {
  const configNumConfig = configOptionsMap[configNum];
  //
  const setConfig = configNumConfig.setConfig || 'setConfigObj';
  if (typeof setConfig === 'string') {
    storeCommit('config/' + setConfig, {
      configNum,
      data: data,
    });
  } else {
    const store = getStore();
    setConfig(store.state.config, data);
  }
}

export type IConfigRootGetter = {
  /**
   *        ，     （    30  )
   *  :             ，       ，    config/tryGetConfig
   */
  config20: IConfig20Model;
  // config52: IConfig52Model;
};
export const configRootGetters = {};

/**
 *     ，
 *     ：
 * 1.        overtime   （  30  ）
 * 2.httpFlag
 * 3.
 */
export async function tryGetConfigAsync<TConfigModel>(configNum: string) {
  const res = await storeDispatch('config/tryGetConfig', { configNum });
  return res as TConfigModel;
}

export function init(_store: Store<IStoreStateType>) {
  // //      lang/countryCode
  // //
  // CONFIG_NUM_LIST.forEach((configType) => {
  //   console.log('[Config]-Debug', 'init func', configType)
  //   store.dispatch('config/initFromLocal', { configNum: configType })
  // })
}
