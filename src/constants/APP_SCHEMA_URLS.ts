import type { UserOperateSituationType } from '../js_bridge/appCallJs/model';

const APP_SCHEME_PROTOCAL = 'vv:';
/**
 *
 */
export const APP_ROUTE_LOGIN = APP_SCHEME_PROTOCAL + '//login';

/**
 * Home Tab
 */
export const APP_ROUTE_TAB_HOME = APP_SCHEME_PROTOCAL + '//home';
/**
 * Wallet Tab
 */
export const APP_ROUTE_TAB_WALLET = APP_SCHEME_PROTOCAL + '//wallet';
/**
 *   Tab
 */
export const APP_ROUTE_TAB_GAME = APP_SCHEME_PROTOCAL + '//tabGame';

/**
 * app vgame
 */
export const APP_ROUTE_OPEN_GAME_SETTING = `${APP_SCHEME_PROTOCAL}//open/gameSetting/`;

export function getHomeTabUrl(situationType: UserOperateSituationType) {
  if (situationType === 'movie') {
    return APP_SCHEME_PROTOCAL + `//theater?tabCode=2`;
  }
  return `${APP_ROUTE_TAB_HOME}?action=${situationType}`;
}

/**
 * App
 */
const APP_ROUTE_P_PAY = `${APP_SCHEME_PROTOCAL}//payCoins`;

/**
 *
 */
export type IVTopupSourceType =
  | 'gamehall_ffbutton_' //  , activity,gamehall
  | 'finish5000' //5000 -->
  | 'me_wallet' //
  | 'daily_tasks' //
  | 'gameinvite' //
  | 'gamehall_goldbar' //
  | 'gamehall_profile'
  | 'game_luckywheel'
  | 'gamehall_topup' //
  | 'gamehall_topup2' //
  | 'withdraw_limit'
  | 'gamehall_bankrupt'
  | 'withdraw_queue_audit' //
  | 'gamehall_activity_week_recharge' // ，
  | 'smash_egg'
  | 'GROWTH_PLAN_MONTH'
  | 'GROWTH_PLAN';
export function getVPayUrl(from: IVTopupSourceType) {
  return APP_ROUTE_P_PAY + '?from=' + encodeURIComponent(from);
}

/**
 * App -
 */
const APP_ROUTE_FIRST_DISCOUNT_PAY =
  APP_SCHEME_PROTOCAL + '//promotionPayCoins';

/**
 *
 */
const APP_ROUTE_BANKRUPTCY_PAY = APP_SCHEME_PROTOCAL + '//payBankruptcyCoins';

/**
 *
 */
const APP_ROUTE_GIFT_RECOVERY_PAY =
  APP_SCHEME_PROTOCAL + '//payGiftRecoveryRechargeCoins';

/**
 *
 */
const APP_ROUTE_SPECIAL_PAY =
  APP_SCHEME_PROTOCAL + '//payGiftSpecialRechargeCoins';
/**
 *
 */
export function getBankRuptcyPayUrl(
  from: 'gameSettle' | 'backruptcy_activity'
) {
  return `${APP_ROUTE_BANKRUPTCY_PAY}?from=${encodeURIComponent(from)}`;
}

/**
 *
 */
export function getSpecialPayUrl(
  from: 'gameSettle' | 'special_activity' | 'game_pay_seq'
) {
  return `${APP_ROUTE_SPECIAL_PAY}?from=${encodeURIComponent(from)}`;
}
/**
 *
 */
export function getGiftRecoveryPayUrl(from: 'gameSettle') {
  return `${APP_ROUTE_GIFT_RECOVERY_PAY}?from=${encodeURIComponent(from)}`;
}
/**
 *  ( )
 */
export function getActivityPayForOnePrice(
  activityId: string,
  from: IVTopupSourceType
) {
  return `${APP_ROUTE_FIRST_DISCOUNT_PAY}?activityId=${activityId}&from=${encodeURIComponent(
    from
  )}`;
}
/**
 *  ( )
 */
export function getActivityPayForMultiPrice(
  activityId: string,
  from: IVTopupSourceType,
  price: BigDecimalString
) {
  return `${APP_ROUTE_FIRST_DISCOUNT_PAY}?activityId=${activityId}&from=${encodeURIComponent(
    from
  )}&price=${price}`;
}
