import { createActivityMixin } from './activity.factory';

const { VActivityListMixin, stateItemVActivityList } = createActivityMixin(
  'VActivityHallListMixin',
  {
    types: [
      'FIRST_CHARGE',
      'SPECIAL_RECHARGE',
      'BANKRUPTCY_ACTIVITY',
      'TOMORROW_GIFT',
      'RANKING_LIST',
      'HIGGS',
      'WELFARE_ENTRY',
      'GAME_INVITE',
      'TURNTABLE',
      'PAY_ENTRY',
      'PAY',
      'GROWTH_PLAN',
      // 'BENEFIT',
    ],
  },
  []
);

/**
 *
 */
export const VActivityHallListMixin = VActivityListMixin;
export const stateItemVActivityHallList = stateItemVActivityList;

/**
 *
 */
export const VActivityHallReady = {
  FIRST_CHARGE: false,
};
