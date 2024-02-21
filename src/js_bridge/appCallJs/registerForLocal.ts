import { checkMinVersionName } from '@/store/modules/app/checkMinVersionName';
import store from '@/store';
import { emitGBus } from '@/utils/GBus';
import { splitStrIntoParts } from '@/utils/string';
import { getPenetrateDataLs } from '../../controller/CommonLocalStorage';
import { BIT_LOG_START_DETAIL, TrueResult } from '../BIT_LOG_ENUMS';
import { CUR_WEBVIEW_ID } from '../CUR_WEBVIEW_ID';
import { penetrateGBusOnly } from '../jsCallApp/utilsPenetrate';
import type { IBridgeModelConfig, IPenetrateDataModel } from '../js_call_app.d';
import { createBridgeRegisterHandler } from './appCallJsBaseUtils';
import type { IPushDeviceRegister } from './model';
import { registerForMainActivity } from './registerForMainActivity';
import { registerForMix } from './registerForMix';
import type { IUserPropRewardItemBase } from '@/modules/VRewardProps/controller/prop.model';

let isRegisterLocal = false;
/**
 *          （    ，              ，      ）
 *            
 * @param bridge
 */
export function registerForLocal(bridge: IWebViewJavascriptBridge) {
  if (isRegisterLocal) {
    return;
  }
  isRegisterLocal = true;
  const bridgeRegisterHandler = createBridgeRegisterHandler(bridge);

  // //#region   refer   
  // /**
  //  *   refer   
  //  */
  // bridgeRegisterHandler<IPushUpdateMemberInfo, boolean>(
  //   'updateFriendsInfo',
  //   (_data) => {
  //     store.state.bridge.updateFriendsListFlag++;
  //     return TrueResult;
  //   },
  //   {
  //     logType: BIT_LOG_START,
  //   }
  // );
  // //#endregion
  //#region deviceRegister  
  bridgeRegisterHandler<IPushDeviceRegister, boolean>(
    'deviceRegister',
    (_data, json) => {
      if (json) {
        if (json.userId && json.userId !== 'null') {
          store.commit('user/updateUserByDeviceRegister', json);
          return TrueResult;
        }
      }
      return {
        Result: 0,
        Reason: 'no param lang',
      };
    }
  );
  //#endregion
  //       
  bridgeRegisterHandler(
    'giftSpecialRechargeGetRewardSuccess',
    () => {
      penetrateGBusOnly('onGiftSpecialRechargeGetRewardSuccess', null);
      return TrueResult;
    },
    {
      dontParse: true,
      logType: BIT_LOG_START_DETAIL,
    }
  );

  //#region       
  bridgeRegisterHandler<Partial<IBridgeModelConfig>, boolean>(
    'onConfigChange',
    function () {
      store.dispatch('base/refreshHttpParams');
      return TrueResult;
    },
    {
      dontParse: true,
      logType: BIT_LOG_START_DETAIL,
    }
  );
  //#endregion
  //#region     
  bridgeRegisterHandler(
    'netChanged',
    function () {
      store.commit('base/setNetworkChange');
      return TrueResult;
    },
    {
      dontParse: true,
      logType: BIT_LOG_START_DETAIL,
    }
  );
  //#endregion
  //#region     
  bridgeRegisterHandler<IPenetrateDataModel, boolean>(
    'penetrateData',
    function (str) {
      const [wid, to, from, moduleNames, payloadLsKey, payloadJsonStr] =
        splitStrIntoParts(str, '|', 6);
      if (wid === CUR_WEBVIEW_ID) {
        return TrueResult;
      }
      function needDealCurrentPenetrate() {
        if (to) {
          // if (to === 'all-webview') {
          //   return true;
          // }
          //      
          return window.vue205.$route?.name === to;
        }
        //      webview
        return true;
        // const isWalletPage = window.GC.isCenter;
        // const isFromWallet = from === RouterNameInapp.Wallet
        // if (isWalletPage && !isFromWallet) {
        //   // Wallet      wallet     
        //   return true;
        // }
        // if (!isWalletPage && isFromWallet) {
        //   //        wallet     
        //   return true;
        // }
        // return false;
      }

      if (process.env.VUE_ENV_HAS_PENETRATE_USECACHE) {
        if (window.GC.isCenter && payloadLsKey) {
          // Wallet  ，       payloadLsKey   ,  
          emitGBus('walletPenetrateKey', payloadLsKey);
        }
      }
      if (!needDealCurrentPenetrate()) {
        return TrueResult;
      }
      //   moduleNames  webview    
      const moduleNameList = moduleNames.split(':');
      function hasModuleNeedDeal(moduleNameList: string[]) {
        for (let i = 0; i < moduleNameList.length; i++) {
          const moduleName = moduleNameList[i];
          if (!moduleName) {
            continue;
          }
          if (moduleName === '-') {
            return true;
          }
          if (store.hasModule(moduleName)) {
            return true;
          }
        }
        return false;
      }
      if (!hasModuleNeedDeal(moduleNameList)) {
        //       ，    
        return TrueResult;
      }
      let payloadJson: IPenetrateDataModel;

      if (process.env.VUE_ENV_HAS_PENETRATE_USECACHE) {
        if (payloadLsKey) {
          payloadJson = getPenetrateDataLs(payloadLsKey);
          if (!payloadJson) {
            if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
              console.error(
                `[penetrateData] no store`,
                'to:',
                to || 'all',
                'from:',
                from,
                wid,
                moduleNameList,
                payloadLsKey
              );
            }
            return TrueResult;
          }
        } else {
          payloadJson = JSON.parse(payloadJsonStr) as IPenetrateDataModel;
        }
      } else {
        payloadJson = JSON.parse(payloadJsonStr) as IPenetrateDataModel;
      }

      const { commitInfo = [], dispatchInfo = [], gBus = [] } = payloadJson;
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.log(
          `[penetrateData] deal`,
          'to:',
          to || 'all',
          'from:',
          from,
          wid,
          moduleNameList,
          commitInfo[0]?.type,
          dispatchInfo[0]?.type,
          gBus[0]?.eventName
        );
      }
      if (commitInfo.length > 0) {
        commitInfo.forEach((item) => {
          try {
            store.commit(item.type, item.payload);
          } catch (ex) {
            console.warn(
              '[penetrateData] deal commit error',
              item.type,
              item.payload,
              ex
            );
          }
        });
      }
      if (dispatchInfo.length > 0) {
        dispatchInfo.forEach(async (item) => {
          try {
            await store.dispatch(item.type, item.payload);
          } catch (ex) {
            console.warn(
              '[penetrateData] deal dispatch error',
              item.type,
              item.payload,
              ex
            );
          }
        });
      }
      if (gBus.length > 0) {
        gBus.forEach((item) => {
          emitGBus(item.eventName, item.detail);
        });
      }
      //        
      return TrueResult;
    },
    {
      dontParse: true,
    }
  );
  //#endregion
  //#region  onViewResume
  /**
   *    webview        
   * Webview        ,  Activity   tab   
   *            ,       ，       ，            
   */
  bridgeRegisterHandler<{ index: number; name: string }, boolean>(
    'onViewResume',
    function (_str, json) {
      const isCurWebviewActive = true;
      if (window.GC.mainActivityTab && json) {
        //      bounds wallet
        // isCurWebviewActive = json.name === window.GC.mainActivityTab;
        if (json.name) {
          store.commit('bridge/setAppActiveTab', json);
        } else {
          //fix 2902   app bounds onViewResume  name 
          if (
            window.GC.mainActivityTab === 'bounds' &&
            !checkMinVersionName('2.9.0.2')
          ) {
            store.commit('bridge/setAppActiveTab', {
              name: 'bounds',
            });
          }
        }
      }
      //    
      store.commit('bridge/setWebviewResumeFlag', {
        isCurWebviewActive,
      });
      /**       ，    font-size */
      // calcREM()
      return {
        Result: 1,
        data: isCurWebviewActive,
      };
    },
    {
      dontParse: false,
      logType: BIT_LOG_START_DETAIL,
    }
  );
  /**
   *    webview        
   * Webview        ,  Activity   tab   
   *            ,       ，       ，            
   */
  bridgeRegisterHandler<{ propList: IUserPropRewardItemBase[] }, boolean>(
    'openGameHallGetPropDlg',
    function (_str, json) {
      emitGBus('openGameHallGetPropDlg', json);
      return TrueResult;
    },
    {
      dontParse: false,
      logType: BIT_LOG_START_DETAIL,
    }
  );
  //#endregion
  registerForMix(bridge);
  registerForMainActivity(bridge);
}
