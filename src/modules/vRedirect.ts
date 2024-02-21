import {
  ROUTENAME_INAPP_V_REFER_GAME,
  ROUTENAME_INAPP_V_REFER_MONEY,
  ROUTEPATH_V_DSTDETAIL,
  ROUTEPATH_V_GOLDWITHDRAW,
  ROUTEPATH_V_PROMOTE_SHARE,
} from '@/constants/localRoutePath';
import type { INavigationLoginFromType } from '@/js_bridge/js_call_app_base';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/index';
import type { TokenSourceType } from './RightWallet/RightWallet.model';

export type IGoldWithdrawFrom =
  | 'game_hall' //
  | 'me_wallet' //
  | 'right_tab' //
  | 'promote_income' //
  | 'VEarnCash' // EarnCash
  | 'VEarnCash_new' //EarnCash
  | 'VEarnCash_checkin' //EarnCash  7
  | 'noviceguide' // app
  | 'gamehall_levelicon'
  | 'gamehall_withdrawicon'
  | 'gamehall_profile_withdrawicon'
  | 'gamehall_weekcard'
  | 'VGame_pay_seq'
  | typeof ROUTENAME_INAPP_V_REFER_MONEY;
// | 'invite_game_page'
// | 'agent_core'
// | 'game_settle' //    ;
export function getGoldWithdrawUrl(
  from: IGoldWithdrawFrom,
  activityType?: string,
  activityId?: string
) {
  const paramList = [];
  // if (isVistorSmallContinue) {
  //   paramList.push('vistorSmallContinue=1');
  // }
  if (from) {
    paramList.push(`from=${encodeURIComponent(from)}`);
  }
  if (activityType) {
    paramList.push(`activityType=${encodeURIComponent(activityType)}`);
  }
  if (activityId) {
    paramList.push(`activityId=${encodeURIComponent(activityId)}`);
  }
  const url = `${ROUTEPATH_V_GOLDWITHDRAW}?${paramList.join('&')}`;
  return url;
}

/**
 *     vistor
 * @param from
 * @param needCheckLogin {Boolean}         ，
 * @returns
 */
export function goToGoldWithdraw(
  from: IGoldWithdrawFrom,
  needCheckLogin: boolean
) {
  const url = getGoldWithdrawUrl(from);
  return openAppH5LinkPreferLocal(url, {
    checkLogin: needCheckLogin
      ? { traceEvent: window.vue205.$route?.name as INavigationLoginFromType }
      : undefined,
  });
}
/**
 * "  ：game，    ：agent_core
      ：invest_passcard"
 */
export type IInvitePageSourceType =
  // | 'invest_passcard' //
  | 'gametask' //
  | 'promote_earn' //
  | 'promote_income' //
  | 'gamehall'
  | 'higgs_share'
  | typeof ROUTENAME_INAPP_V_REFER_MONEY
  | typeof ROUTENAME_INAPP_V_REFER_GAME; //     level

/**
 *
 * @param from
 * @param initialFrom     ('right' | 'game')
 * @returns
 */
export function getInvitePageUrl(
  from: IInvitePageSourceType,
  initialFrom: string
) {
  return `${ROUTEPATH_V_PROMOTE_SHARE}?from=${from}&initialfrom=${initialFrom}`;
}

export function getDSTDetailUrl(sourceType?: TokenSourceType) {
  if (!sourceType) {
    return ROUTEPATH_V_DSTDETAIL;
  }
  return `${ROUTEPATH_V_DSTDETAIL}?sourceType=${sourceType}`;
}
