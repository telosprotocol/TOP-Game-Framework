import { MS_SECOND } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';

import { gameWithdrawalGoldInfoByTypeWithdrawalController } from '@/vservices/client/WithdrawalController';
import Vue from 'vue';
import Component from 'vue-class-component';

const stateItemVGoldWithdrawWeekRecharge = createHttpAsyncStateItem(
  () => {
    return gameWithdrawalGoldInfoByTypeWithdrawalController({
      ao: {
        withdrawalType: 'ACTIVITY',
        activityType: 'WEEK_RECHARGE',
      },
    });
  },
  null,
  'VGoldWithdrawWeekRecharge'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_SECOND * 5;

@Component({})
export class VGoldWithdrawWeekRechargeMixin extends Vue {
  stateItemVGoldWithdrawWeekRechargeRef =
    stateItemVGoldWithdrawWeekRecharge.ref;

  get VGoldWithdrawWeekRecharge() {
    return this.stateItemVGoldWithdrawWeekRechargeRef.current;
  }
  /**
   *
   * @param timeout     ，       revalidation  ，   0
   */
  async refreshVGoldWithdrawWeekRecharge(timeout?: number) {
    return stateItemVGoldWithdrawWeekRecharge.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
}

export default stateItemVGoldWithdrawWeekRecharge;
