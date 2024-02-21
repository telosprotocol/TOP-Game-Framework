import { tryTraceEvent } from '@/utils/trace';
import {
  gBusEmitAndPenetrate,
  penetrateGBusOnly,
} from '@/js_bridge/jsCallApp/utilsPenetrate';
import type { BannerOpType } from '@/constants/BannerOpType';

import {
  IBridgePushEvent,
  IPushCommandNavigation,
  PUSH_TYPE_ALL,
  PUSH_TYPE_NAV,
} from '@/constants/push';

import store from '@/store';

import { getStore } from '@/store/util';
import { getGoogleFirstPageRlt2, getGoogleMorePageRlt2 } from '@/utils/google';
import { hextoString } from '@/utils/string';
import { bannerNavigation } from '../../utils/navigator';
import {
  createPushCommandName,
  dealNavigation,
  dealPushEvent,
} from '../appPush';
import {
  BIT_LOG_END_DETAIL,
  BIT_LOG_START,
  BIT_LOG_START_DETAIL,
  TrueResult,
} from '../BIT_LOG_ENUMS';
import { setLocalLog_bridge } from '../jsCallApp/dotting';
import { storeCommitAndPenetrate } from '../jsCallApp/utilsPenetrate';
import {
  clearGetDeviceInfoBridgeCache,
  getDeviceInfoBridgeWithCache,
} from '../js_call_app';
import { addPushListener } from '../js_call_app_base';
import { waitAppBridge } from '../waitAppBridge';
import { createBridgeRegisterHandler } from './appCallJsBaseUtils';
import type { IPushUpdateTaskInfo, IUserOperateInfo } from './model';
import { Base64 } from 'js-base64';
// import stateVRightUserTaskList from '@/V/controller/task/RightUserTask.state';
import { onUserHasRechargedGameGoldForMainActivity } from '@/modules/GameHall/VTopupFirstDiscount/VGameRecharge.state';
import stateItemVRightWalletInfo from '@/modules/RightWallet/RightWallet.state';

import { updateVAssetInfo } from '@/modules/VAssetInfo/VAsset.utils';
import { DataSource } from '@/constants/basic';
import type { IBridgeResult } from '../js_call_app.d';
import { VCoinEnum } from '@/modules/VAssetInfo/VCoinEnum';
import { settlementCoinGameHallController } from '@/vservices/client/GameHallController';
let isRegistered = false;

/**
 *    wallet
 */
export function tryRegisterBridgeForCenterTab() {
  waitAppBridge((bridge) => {
    registerForACCenter(bridge);
  });
}

/**
 *         app
 * @param bridge
 * @returns
 */
function registerForACCenter(bridge: IWebViewJavascriptBridge) {
  if (isRegistered) {
    return;
  }
  if (!window.GC.isCenter) {
    return;
  }
  isRegistered = true;
  const bridgeRegisterHandler = createBridgeRegisterHandler(bridge);

  //#region push command
  addPushListener({ type: PUSH_TYPE_ALL });
  addPushListener({ type: PUSH_TYPE_NAV });
  // addPushListener({ type: PUSH_TYPE_OLD });
  bridgeRegisterHandler<IBridgePushEvent, void>(
    'onPushCommand',
    (_str, json) => {
      dealPushEvent(json);
      return null;
    }
    // {
    //   doLogDetail: true,
    // }
  );
  //#endregion

  //#region

  //#region updateTaskInfo
  /**
   *                 (update watch video time limit; | update active time limit;)
   */
  bridgeRegisterHandler<
    IPushUpdateTaskInfo, //| (ICheckInResult & IPushUpdateTaskInfo),
    boolean
  >(
    'updateTaskInfo',
    function (_data, _json) {
      // const subCategory = json?.subCategory;
      // if (subCategory === 89) {
      //   //
      //   stateVRightUserTaskList.tryUpdate(0);
      // } else if (subCategory === 88) {
      //   //         :
      //   stateVRightUserTaskList.ref.lastSetDt = 0;
      // }
      // else if (subCategory === RIGHTTASKID_VGAMESHARE) {
      //   penetrateGBusOnly('onVTaskUpdate', { type: 'right' });
      // }
      // if (!json) {
      //   return TrueResult;
      // }
      // const { subCategory } = json;
      // //
      // json.from = 'APP';
      // // A.    （   ）
      // if (json.subCategory === TASK_SUBCATEGORY_TYPES_CUSTOM.CHECK_IN) {
      //   const checkInInfo = json as Partial<ICheckInResult>;

      //   if (
      //     checkInInfo.status &&
      //     checkInInfo.onlineTime != null &&
      //     checkInInfo.countDownTime != null
      //   ) {
      //     //  : status=0 ，     false
      //     //
      //     store.commit('checkin2/setCheckInInfo', {
      //       type: 'report',
      //       info: checkInInfo,
      //     });
      //   }
      //   return TrueResult;
      // }
      // if (subCategory === TASK_SUBCATEGORY_TYPES_CUSTOM.DAILY_CHALLENGE) {
      //   //
      //   store.dispatch('dc/refreshDailyChallengeInfo', {
      //     force: true,
      //   });
      //   return TrueResult;
      // }
      // if (subCategory === TASK_SUBCATEGORY_TYPES_CUSTOM.VIDEO_WATCH) {
      //   store.dispatch('paidview/refreshPaidViewTimeUpdate', json);
      //   return TrueResult;
      // }
      // //#region     --(      ,app  subCateogry=4、2)
      // if (subCategory === TASK_SUBCATEGORY_TYPES_CUSTOM.VIDEO_DOWNLOAD) {
      //   //           5,App    ，
      //   dispatchUpdateTaskList(
      //     {},
      //     {
      //       waitMS: TASK_UPDATE_PASSIVE_DELAY_MS,
      //       preferToQueue: true, //
      //     }
      //   );
      //   return TrueResult;
      // }
      // //#endregion

      // //   subCategory    ，       ，
      // if (process.env.VUE_APP_ENV_SERVER === 'development') {
      //   console.log(
      //     '[updateTaskInfo]-from app',
      //     'behaviorType:',
      //     `${json.subCategory}-${json.subType || ''}`,
      //     'interval=',
      //     json.interval
      //   );
      // }
      // reportTaskBehavior(json);
      return TrueResult;
    },
    {}
  );
  //#endregion

  //#region          -->
  bridgeRegisterHandler<IUserOperateInfo, boolean>(
    'userOperateNotify',
    async function (_data, _json) {
      // const isDealed = await dealUserOperateNotify(json);
      // return {
      //   Result: 1,
      //   data: isDealed,
      // };
      return {
        Result: 1,
        data: false,
      };
    },
    {
      logType: BIT_LOG_START_DETAIL,
    }
  );
  //#endregion

  //#region
  // //         , app
  // bridgeRegisterHandler<{ subCategory: number }, { hasAdDoubleDlg: boolean }>(
  //   'startClaimTaskReward',
  //   async (_, json) => {
  //     const res = await tryClaimTaskReward(json.subCategory);
  //     return res;
  //   }
  // );
  //#endregion

  //#endregion

  //#region onNavigation

  /**
   *  H5  navigate
   */
  bridgeRegisterHandler<
    {
      /**
       *       （              ）
       * @example /   ，
       * @example http.... ,
       * @example vv://.... ,
       */
      url: string;

      /**
       * urlBase64    ,2.5.2  ，      java Bridge   bug
       */
      urlBase64?: string;

      /**
       * opType   ，  url
       * @type OuterLink,       (url)
       * @type   ：   url
       */
      opType?: BannerOpType;

      /**
       *    url，          ，      url
       * openDownloadBrowser
       */
      containInstructionUrl?: string;
    },
    boolean
  >('navigation', async function (_str, options) {
    const { urlBase64, ...rest } = options;
    if (urlBase64) {
      rest.url = Base64.decode(urlBase64);
    }
    return bannerNavigation(rest) as Promise<IBridgeResult<boolean>>;
  });
  /**
   *    app  ，app  navigation
   */
  bridgeRegisterHandler<Omit<IPushCommandNavigation, 'command'>, null>(
    'onNavigation',
    async (_str, json) => {
      json._name = createPushCommandName('navigation_on');
      dealNavigation(json);
      return null;
    },
    {
      logType: BIT_LOG_START_DETAIL,
    }
  );

  //#endregion

  //#region onAttach

  /**
   * Wallet      activity
   */
  bridgeRegisterHandler<{ index: number }, boolean>(
    'onAttach',
    function () {
      //
      store.commit('bridge/setWalletAttach', {});

      return TrueResult;
    },
    {
      dontParse: true,
      logType: BIT_LOG_START_DETAIL,
    }
  );
  //#endregion

  //#region app
  // /**
  //  * app
  //  */
  // bridgeRegisterHandler(
  //   'hasClaimTask',
  //   function () {
  //     const taskCount = getTaskClaimCountForWallet();
  //     return {
  //       Result: 1,
  //       data: taskCount,
  //     };
  //   },
  //   {
  //     dontParse: true,
  //   }
  // );
  //#endregion

  //#region   Wallet
  // /**
  //  *
  //  * */
  // bridgeRegisterHandler(
  //   'showDailyChallenge',
  //   function () {
  //     setTimeout(async () => {
  //       const result = await store.dispatch('dc/isDailyChallengeActive');
  //       if (result.isActive) {
  //         openAppH5LinkPreferLocal(ROUTEPATH_CHALLENGEREDEEM, {
  //           checkLogin: {
  //             traceEvent: ROUTENAME_INAPP_DailyChallengeRedeem,
  //             traceParamStr: 'app-push-msg',
  //           },
  //           getNavLocker: true,
  //         });
  //       } else if (result.message) {
  //         showToast_bridge({
  //           content: result.message,
  //         });
  //       }
  //     }, 500);

  //     return TrueResult;
  //   },
  //   {
  //     dontParse: true,
  //     logType: BIT_LOG_START,
  //   }
  // );

  // /**
  //  *
  //  * */
  // bridgeRegisterHandler<unknown, IDCIsActiveResult>(
  //   'canShowDCRedeemableTip',
  //   async function () {
  //     // const result = {
  //     //   canOpen: true,
  //     //   activeStatus: null,
  //     //   message: null,
  //     // }
  //     //
  //     const result: IDCIsActiveResult = await store.dispatch(
  //       'dc/isDailyChallengeActive'
  //     );
  //     if (
  //       result.isActive &&
  //       result.activeStatus === DailyChallengeStatus.withdrawable
  //     ) {
  //       return {
  //         Result: 1,
  //         data: result,
  //       };
  //     } else {
  //       if (result.activeStatus === DailyChallengeStatus.doing) {
  //         result.message = 'Activity is not withdrawable';
  //       }
  //       return {
  //         Result: 0,
  //         data: result,
  //         Reason: result.message,
  //       };
  //     }
  //   },
  //   {
  //     dontParse: true,
  //     logType: BIT_LOG_START,
  //   }
  // );

  /**
  //  *   friends   (  refer  )
  //  * */
  // bridgeRegisterHandler(
  //   'showFriendsList',
  //   function () {
  //     setTimeout(() => {
  //       store.commit('bridge/setShowFriendsFlag', true);
  //     }, 500);

  //     return TrueResult;
  //   },
  //   {
  //     dontParse: true,
  //     logType: BIT_LOG_START,
  //   }
  // );

  //#endregion

  //#region WalletTab

  /*
    wallet/bounds  ，
  1.          
    app    ，wallet  ,appTurnIntoBackGround
    app    ，wallet  ,onAppBringToFront,    wallet bounds onViewResume
          ，  MainActivity,  wallet bounds  onViewResume

  2.         (MainActivity)
      tab   onWalletTabChecked
    app    ，wallet  appTurnIntoBackGround、onMainStop({"isAppBackground": false})
    app    ，wallet  onAppBringToFront 
            bounds wallet  ，      onViewResume 
          ，bounds wallet  ，      onViewResume 

 
  */
  /**
   *  Wallet     ，        onMainStop
   *         app
   *   onViewResume
   */
  bridgeRegisterHandler<{ isAppBackground: boolean }, boolean>(
    'onMainStop',
    function (_str, json) {
      storeCommitAndPenetrate('bridge/setMainActivityToBg', json);
      return TrueResult;
    },
    {
      dontParse: false,
      logType: BIT_LOG_START_DETAIL,
    }
  );
  function setAppToFrontOrBack(isFront: boolean) {
    storeCommitAndPenetrate('bridge/setAppFrontBack', { isFront });
  }
  // app
  bridgeRegisterHandler('onAppBringToFront', () => {
    setAppToFrontOrBack(true);
    return null;
  });
  // app
  bridgeRegisterHandler('appTurnIntoBackGround', () => {
    setAppToFrontOrBack(false);
    return null;
  });

  //#endregion

  // //#region

  // // /**
  // // *    app  ，app      (     ！！)
  // // */
  // // bridgeRegisterHandler<{ path: string; }, null>(
  // //   'navigationDialog',
  // //   async (_str, json) => {
  // //     showWebviewDialog(json)
  // //     return null
  // //   },
  // //   {
  // //     doLogDetail: true,
  // //   }
  // // )
  // let isDealingPaidView = false;

  // /**
  //  *
  //  */
  // type IPaidViewOnClickReturn = {
  //   type: 'dialog' | 'reward';
  //   rewardsType: number;
  //   rewardsCount: number;
  //   adRewardsType: number;
  //   adRewardsCount: number;
  // };
  // // eslint-disable-next-line @typescript-eslint/ban-types
  // bridgeRegisterHandler<{ isAuto: boolean }, IPaidViewOnClickReturn>(
  //   'onPaidViewIconClicked',
  //   async (_str, json) => {
  //     console.log('app_call_js onPaidViewIconClicked', _str, json);
  //     if (isDealingPaidView) {
  //       return {
  //         Result: 0,
  //         ErrCode: -1001,
  //         Reason: 'To Busy',
  //       };
  //     }
  //     isDealingPaidView = true;
  //     const res = await storeDispatch<BridgeReturnData<IPaidViewOnClickReturn>>(
  //       'paidview/onPaidViewIconClicked',
  //       json
  //     );
  //     isDealingPaidView = false;
  //     // const redirectA = store.state.wallet.redirectA
  //     // const redirectB = store.state.wallet.redirectB
  //     return {
  //       ...res,
  //       // redirectA: redirectA,
  //       // redirectB: redirectB
  //     };
  //   }
  // );
  // // app    ，updatePaidViewInfo   ，  app     。。。
  // bridgeRegisterHandler<void, boolean>(
  //   'onPaidViewRewardsClientEnable',
  //   async (_str) => {
  //     //
  //     updatePaidViewInfo(store.getters['paidview/curPaidViewInfoForApp']);

  //     return TrueResult;
  //   },
  //   { dontParse: true, logType: BIT_LOG_START }
  // );
  // //#endregion

  //#region google search rlt format html => json
  bridge.registerHandler('glRltHtml2Json', function (data, responseCallback) {
    // console.log('app bridge glRltHtml2Json =>', data, !!responseCallback) !!responseCallback
    if (!responseCallback) {
      return;
    }
    let _data = {} as any;
    try {
      _data = JSON.parse(data);
    } catch {
      console.log('getRltHtml2Json,JSON parse error', data);
    }

    let rltData = '' as string | any;
    let rlObj = null;
    let html = '';
    try {
      _data.html = hextoString(_data.html);
      // console.log('html=>', _data.html)
      html = unescape(_data.html.replace(/[\\]{2,}u/g, '%u'));
    } catch (e) {
      rlObj = {
        Result: 0,
        Message:
          'analysis error:' +
          (e as Error).message +
          '\n' +
          (e as Error).stack +
          '\n' +
          html,
      };
      responseCallback(rlObj);
      return;
    }
    if (html.indexOf('<html') > -1) {
      //
      try {
        rltData = getGoogleFirstPageRlt2(html);
        rlObj = {
          Result: 1,
          data: rltData,
        };
        responseCallback(rlObj);
      } catch (e) {
        rlObj = {
          Result: 0,
          Message:
            'first page:' +
            (e as Error).message +
            '\n' +
            (e as Error).stack +
            '\n' +
            html,
        };
        responseCallback(rlObj);
      }
      // console.log('google video get first page', JSON.stringify(rlObj))
    } else {
      //
      try {
        rltData = getGoogleMorePageRlt2(html);
        rlObj = {
          Result: 1,
          data: rltData,
        };
        responseCallback(rlObj);
      } catch (e) {
        rlObj = {
          Result: 0,
          Message:
            'first page:' +
            (e as Error).message +
            '\n' +
            (e as Error).stack +
            '\n' +
            html,
        };
        responseCallback(rlObj);
      }
      // console.log('google video get more', JSON.stringify(rlObj))
    }
  });
  //#endregion

  //#region
  /**
   *       (   updateTaskInfo             subCategory,    )
   *    ，
   */
  bridgeRegisterHandler<
    { subCategory: string | number; mainCategory: number },
    null
  >(
    'getTaskInfo',
    async function (_, _json) {
      // const res = (await store.dispatch(
      //   'task/tryGetTaskInfoForBridge',
      //   json
      // )) as { Result: 0 | 1; data: ITaskListItemForBridge };
      // return res;
      return { Result: 1, data: null };
    },
    {
      logType: BIT_LOG_END_DETAIL | BIT_LOG_START_DETAIL,
    }
  );
  // /**
  //  *       (   updateTaskInfo             subCategory,    )
  //  *
  //  */
  // bridgeRegisterHandler<
  //   { subCategoryList: number[] },
  //   ITaskListItemForBridge[]
  // >(
  //   'getTaskInfoList',
  //   async function (_, _json) {
  //     // const res = await store.dispatch('task/tryGetTaskListForBridge', json);
  //     return { Result: 1, data: [] };
  //   },
  //   {
  //     logType: BIT_LOG_END_DETAIL | BIT_LOG_START_DETAIL,
  //   }
  // );
  //#endregion

  // //#region
  // /**
  //  *   H5
  //  */
  // bridgeRegisterHandler<{ base?: boolean }, null>(
  //   'userInfoShouldUpdate',
  //   () => {
  //     dispatchRefreshUserInfoAuto();
  //     return null;
  //   },
  //   {
  //     logType: BIT_LOG_START,
  //   }
  // );
  // //#endregion

  //#region onDeviceInfoUpdate
  if (process.env.VUE_APP_ENV_SERVER === 'development') {
    setLocalLog_bridge({
      a: 'RequestDeviceApi',
      b: 'start listen to onDeviceInfoUpdate',
    });
  }
  /**
   * deviceId
   */
  bridgeRegisterHandler<unknown, boolean>(
    'onDeviceInfoUpdate',
    async (_, data) => {
      // data   {Result:0,data:IBridgeModelDeviceInfo.model  }
      if (process.env.VUE_APP_ENV_SERVER === 'development') {
        setLocalLog_bridge({
          a: 'RequestDeviceApi',
          b: 'onDeviceInfoUpdate start   get deviceInfoBridge',
          deviceId: getStore().state.app.deviceId,
        });
      }
      //     getDeviceInfo
      if (data && (data as any).deviceId) {
        //
        storeCommitAndPenetrate('app/setDeviceInfo', data);
      }
      clearGetDeviceInfoBridgeCache();
      getDeviceInfoBridgeWithCache();
      return TrueResult;
    },
    {
      logType: BIT_LOG_START,
    }
  );
  //  ：         getDeviceInfo  ，
  clearGetDeviceInfoBridgeCache();
  getDeviceInfoBridgeWithCache();
  //#endregion

  // #region V

  /**
   * V
   */
  bridgeRegisterHandler<unknown, boolean>(
    'notifyUserHasRecharged',
    (_str) => {
      onUserHasRechargedGameGoldForMainActivity();
      return TrueResult;
    },
    {
      logType: BIT_LOG_START_DETAIL,
      dontParse: true,
    }
  );

  bridgeRegisterHandler<
    { type: 'coin'; coin: VCoinEnum; coinValue: string }[],
    boolean
  >(
    'notifyUserAssetHasChanged',
    (_str, assetInfoList) => {
      const updateInfo: Partial<{
        [type: string]: boolean;
      }> = {};
      if (assetInfoList && assetInfoList.length >= 0) {
        assetInfoList.forEach((item) => {
          updateInfo[item.coin] = true;
        });
        if (updateInfo[VCoinEnum.GOLD] || updateInfo[VCoinEnum.VTOKEN]) {
          stateItemVRightWalletInfo.tryUpdate(0);
        }
      }
      return TrueResult;
    },
    {
      logType: BIT_LOG_START_DETAIL,
    }
  );
  //
  // const lastRefreshWalletTimer: number = null;
  /**
   *
   */
  bridgeRegisterHandler<
    { gameId: string; openId: string; payload: string },
    boolean
  >(
    'notifyWebGameClose',
    async (_str, json) => {
      // 1.
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.time('GameSettle-settlementAgame');
      }
      const dt1 = new Date().getTime();

      const resSettle = await settlementCoinGameHallController(); //json.gameId
      const dt2 = new Date().getTime();
      const dtSpan = dt2 - dt1;

      tryTraceEvent('api_span_settlement', {
        span_time: dtSpan + '',
        value: dtSpan + '',
      });
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.timeEnd('GameSettle-settlementAgame');
      }
      if (process.env.VUE_APP_ENV_SERVER === 'development') {
        console.log('[Game] settle result,then update coin', resSettle);
      }
      // 2.       ，
      updateVAssetInfo(0);
      const perf = {
        start_dt: Date.now(),
        settle_span: dtSpan,
        start_penetrate_dt: Date.now(),
        settle_logno: resSettle.logno,
        settle_code: resSettle.code,
      };
      penetrateGBusOnly('onWebGameClosed', {
        gameId: json.gameId,
        openId: json.openId,
        perf,
      });
      gBusEmitAndPenetrate('onVTaskUpdate', {
        type: 'behavior',
        behavior: 'PLAY',
      });
      return TrueResult;
    },
    {
      logType: BIT_LOG_START_DETAIL,
    }
  );
  // #endregion

  //#region
  bridgeRegisterHandler<{ isTodayFirstLogin: boolean }, boolean>(
    'accountLogin',
    async (_str) => {
      //
      //
      const isOk = await store.dispatch(
        'user/refreshUserAuthInfoFromBridge',
        {}
      );
      // store.commit('user/setIsLogined', {
      //   isLogined: true,
      //   from: 'login',
      // })
      await store.dispatch('base/refreshHttpParams');
      return {
        Result: 1,
        data: isOk,
      };
    },
    {
      logType: BIT_LOG_START_DETAIL,
    }
  );
  //#endregion
  //#region
  bridgeRegisterHandler(
    'accountLoginOut',
    function () {
      //
      // store.commit('user/setIsLogined', {
      //   isLogined: false,
      //   from: 'logout',
      // });
      // store.commit('user/resetUserLogout', {
      //   from: DataSource.bridgePush,
      // });
      storeCommitAndPenetrate('user/setIsLogined', {
        isLogined: false,
        from: 'logout',
      });
      storeCommitAndPenetrate('user/resetUserLogout', {
        from: DataSource.bridgePush,
      });
      // console.log(TAG, 'accountLoginOut', data)
      store.dispatch('base/refreshHttpParams');

      // //    offerlist
      // clearOfferList();

      //
      // store.state.user.userId = '1'
      //   refreshHttpParams
      return TrueResult;
    },
    {
      dontParse: true,
      logType: BIT_LOG_START_DETAIL,
    }
  );
  //#endregion
}
