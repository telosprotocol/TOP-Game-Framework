import type { IActivityType } from './../modules/VHallActivitysBar/activity-logic.config';
import type {
  IVGameTaskItem,
  IVTaskItemBase,
} from '@/modules/VTask/VTask.model';
import type { IPlayFormListItem } from '@/modules/playform/service';
import type { IInvitePageSourceType } from '@/modules/vRedirect';

import type { ITaskModuleType } from '@/modules/VTask/VTask.controller';
import type { IUserGameTaskGroupVO } from '@/modules/GameTask/GameUserTask.api';
import type { IUserPropRewardItemBase } from '@/modules/VRewardProps/controller/prop.model';

export type MainActivityTabName =
  | 'wallet'
  | 'bounds'
  | 'home'
  | 'theater'
  | 'me';
export type IGBusEventPayloadMap = {
  /**
   * app
   */
  appBgSwitch: { isFront: boolean };
  // /**
  //  *  Activity  tab  ，
  //  * wallet TabChecked
  //  */
  // mainActivityTabChecked: {
  //   tabName: MainActivityTabName;
  // };
  //#region

  //
  walletPenetrateKey: string;

  /**
   *   collect
   */
  onPlayFormStoredChange: {
    playformId: number | string;
    isCancel: boolean;
    detail: Omit<IPlayFormListItem, 'collectStatus'>;
  };
  //#endregion
  // /**
  //  *         （10s   ）
  //  */
  // onRightExploreTask: { taskDict: number };

  /**
   * V
   */
  onVUserRechargeGameGold: unknown;

  /**
   *   -    、Token  (            )
   */
  onVUserAssetInfoInfoSync: API.UserStatVO;

  /**
   *
   */
  onVUserGameTaskSync: IUserGameTaskGroupVO[];

  /**
   *         Tab，
   */
  onVUserAssetInfoChanged: unknown;

  /**
   *         5000      （    ）
   */
  openInviteDlg: { from: IInvitePageSourceType };

  /**
   *
   */
  onWebGameClosed: {
    gameId: string;
    openId: string;
    perf: Record<string, number | string>;
  };

  // /**
  //  *  WalletTab
  //  */
  // onOpenGame: { gameId: string; from: IOpenGameSource };

  //#region
  /**
   *   CenterTab  nav
   */
  startWatchNavTaskComplete: {
    holdItem: IVGameTaskItem;
    taskModuleType: ITaskModuleType; //
  };

  dealTaskLogic: {
    taskInfo: IVTaskItemBase;
    taskModuleType: ITaskModuleType;
    ignoreLoginCheck?: boolean;
  };

  // /**
  //  * V
  //  */
  // onVTaskUpdate: {
  //   type: 'right' | 'game';
  //   /**
  //    *
  //    */
  //   taskId?: string;
  // };
  /**
   *     （          ）
   */
  onVTaskUpdate:
    | {
        type: 'single';
        taskId: string;
        old?: IVTaskItemBase;
        taskModuleType: ITaskModuleType;
        taskDealType: 'Claim' | 'Retry' | 'Compelete';
      }
    | {
        type: 'behavior';
        //
        behavior: 'RECHARGE' | 'PLAY';
      };
  //#endregion

  /**
   *            （       ）
   */
  openGameHallGetPropDlg: {
    propList: IUserPropRewardItemBase[];
    onPropClosed?: () => void;
  };

  openGameHallDlg: IOpenGameHallDlgParam;

  /**
   *
   */
  onGiftSpecialRechargeGetRewardSuccess: null;

  onPayActivityEnd: {
    type:
      | 'BANKRUPTCY'
      | 'RECOVERY'
      | 'SPECIAL'
      | 'PromotionPay'
      | 'Store'
      //
      | 'Canceled';
    isRechargeTriggered: boolean;
  };

  onRollMessage: {
    message: string;
    id: string;
  }[];

  onAppGameGuideFinish: {
    /**
     * 1 =         ， -1 =             ， -2=
     */
    type: 1 | -1 | -2;
  };

  onWalletTabChecked: { index: number; name: 'bounds' | 'wallet' | string };

  /**
   *     （for  ）
   */
  onActivityToUpdate: { type: IActivityType };
};

export type IOpenGameHallDlgParam = {
  /**
   *
   */
  from?: string;
} & (
  | {
      type: 'TURNTABLE';
      /**
       *
       */
      tabType: API.LuckyWheelVO['luckyWheelType'];
    }
  | {
      type: // | 'SIGN_IN'
      // | 'SEVEN_DAY_ACTIVITIES'
      | 'MESSAGE'
        | 'NOVICE_FIVE_DAYS'
        | 'WEEK_RECHARGE'
        | 'TOMORROW_GIFT'
        | 'NewbieGuide' //2920
        | 'GROWTH_PLAN' //
        | 'PAY' //2930  TOPUP_TASK  PAY
        | 'closeAll'
        | 'updateDlg';
      // | 'GAME_HALL_TASK' 2900   | '_H5_MISSION'
      //     2880
    }
);
export type GBusEventName = keyof IGBusEventPayloadMap;
