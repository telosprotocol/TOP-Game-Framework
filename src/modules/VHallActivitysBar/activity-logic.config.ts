import { emitGBus } from '@/utils/GBus';
import { checkMinVersionName } from '@/store/modules/app/checkMinVersionName';
import {
  ROUTENAME_INAPP_VGAME,
  ROUTEPATH_V_EARN_CASH,
  ROUTEPATH_V_REFER_MONEY,
  ROUTEPATH_V_TOPUP_RANKING_MIX2,
} from './../../constants/localRoutePath';
import { tryTraceEventV } from '@/utils/trace';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/openAppH5LinkPreferLocal';
import {
  getBankRuptcyPayUrl,
  getSpecialPayUrl,
  getVPayUrl,
} from '../../constants/APP_SCHEMA_URLS';
import stateItemVGamePayGift from '../GameHall/VTopupFirstDiscount/VGamePayGift.state';

/**      Enum (  :FIRST_CHARGE,  :SIGN_IN,  :TURNTABLE,Higgs:HIGGS,    :SEVEN_DAY_ACTIVITIES,   :RANKING_LIST) */
export type IActivityType =
  //
  | 'FIRST_CHARGE' //
  | 'SPECIAL_RECHARGE' //
  | 'BANKRUPTCY_ACTIVITY' //
  | 'TOMORROW_GIFT' //
  | 'RANKING_LIST' //
  | 'HIGGS' // Higgs
  | 'WELFARE_ENTRY' //     (    )
  | 'GAME_INVITE' //
  | 'TURNTABLE' //
  | 'PAY_ENTRY' //
  | 'BENEFIT' //

  //
  | 'PAY' //
  | 'GROWTH_PLAN' //

  //
  | 'FISSION_TASK' //
  | 'NOVICE_FIVE_DAYS' //   5
  | 'WEEK_RECHARGE' //
  | 'TOPUP_ENTRY' //    ，

  //
  | 'SIGN_IN' // LOGIC
  | 'GAME_HALL_TASK' // 2900
  | 'SEVEN_DAY_ACTIVITIES'; //2900
export type IActivityBaseModel = Pick<
  API.ActivitiesManagementVO,
  'icon' | 'name' | 'hasRedDot' // | 'state'
> & { type: IActivityType };
/**
 *
 */
export type IActivityEntryFrom = 'gamehall' | 'activity';
//     ，  、     （      ）
export const ACTIVITY_CONFIG_MAP: {
  [key: string]: {
    // component?: any;
    onClick?: (from?: IActivityEntryFrom) => Promise<void>;
  };
} = {
  RANKING_LIST: {
    async onClick(_from: IActivityEntryFrom) {
      openAppH5LinkPreferLocal(ROUTEPATH_V_TOPUP_RANKING_MIX2, {
        // checkLogin: {
        //   traceEvent: (_from + '_ranklist') as 'activity_ranklist',
        // },
        getNavLocker: true,
      });
    },
  },
  RECOVERY_SMASH_EGG: {
    async onClick(_from: IActivityEntryFrom) {
      openAppH5LinkPreferLocal(ROUTEPATH_V_TOPUP_RANKING_MIX2 + '?tab=bonus', {
        // checkLogin: {
        //   traceEvent: (_from +
        //     '_RECOVERY_SMASH_EGG') as 'activity_RECOVERY_SMASH_EGG',
        // },
        getNavLocker: true,
      });
    },
  },
  TOPUP_ENTRY: {
    async onClick(_from?: IActivityEntryFrom) {
      tryTraceEventV('click_gamehall_topup_entry', {});
      openAppH5LinkPreferLocal(getVPayUrl('gamehall_topup'), {
        checkLogin: {
          traceEvent: (_from + '_topup') as 'gamehall_topup',
        },
        getNavLocker: true,
      });
    },
  },
  BANKRUPTCY_ACTIVITY: {
    async onClick(_from?: IActivityEntryFrom) {
      tryTraceEventV('click_gamehall_bankup_entry', {
        activity_type: _from,
      });
      openAppH5LinkPreferLocal(getBankRuptcyPayUrl('backruptcy_activity'), {
        checkLogin: {
          traceEvent: (_from + '_bankruptcy') as 'gamehall_bankruptcy',
        },
        getNavLocker: true,
      });
    },
  },
  SPECIAL_RECHARGE: {
    async onClick(_from?: IActivityEntryFrom) {
      const specialStatus =
        stateItemVGamePayGift?.ref?.current?.activityVos?.find((item) => {
          return item.activitiesType === 'SPECIAL_RECHARGE';
        })?.status;
      if (!checkMinVersionName('2.8.8.1')) {
        emitGBus('openGameHallDlg', { type: 'updateDlg' });
        return;
      }
      tryTraceEventV('vgame_click_recharge_special_gift', {
        activity_type: _from,
        recharge_status: specialStatus,
      });
      openAppH5LinkPreferLocal(getSpecialPayUrl('special_activity'), {
        checkLogin: {
          traceEvent: (_from + '_special_pay') as 'gamehall_special_pay',
        },
        getNavLocker: true,
      });
    },
  },
  FISSION_TASK: {
    async onClick(_from?: IActivityEntryFrom) {
      tryTraceEventV('click_gamehall_fission_task', {
        activity_type: _from,
      });
      openAppH5LinkPreferLocal(
        ROUTEPATH_V_EARN_CASH + '?from=' + ROUTENAME_INAPP_VGAME + '_' + _from, //activity
        {
          checkLogin: {
            traceEvent: (_from + '_fissiontask') as 'activity_fissiontask',
          },
          getNavLocker: true,
        }
      );
    },
  },
  GAME_INVITE: {
    async onClick(_from?: IActivityEntryFrom) {
      tryTraceEventV('click_gamehall_invite_gift', {});
      openAppH5LinkPreferLocal(
        ROUTEPATH_V_REFER_MONEY +
          '?from=' +
          ROUTENAME_INAPP_VGAME +
          '_' +
          _from,
        {
          checkLogin: {
            traceEvent: (_from + '_invite') as 'gamehall_invite',
          },
          getNavLocker: true,
        }
      );
    },
  },
  // SEVEN_DAY_ACTIVITIES: {},
};
