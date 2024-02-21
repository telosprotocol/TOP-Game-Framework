import { MS_SECOND } from './../../constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { rewardRechargeGetPayGiftController } from '@/vservices/client/PayGiftController';
import Vue from 'vue';
import Component from 'vue-class-component';

const stateItemWeekCardRecharge = createHttpAsyncStateItem(
  () => {
    return rewardRechargeGetPayGiftController({
      activityType: 'WEEK_RECHARGE',
    });
  },
  null,
  'WeekCardRecharge'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_SECOND * 5;

@Component({})
export class WeekCardRechargeMixin extends Vue {
  stateItemWeekCardRechargeRef = stateItemWeekCardRecharge.ref;

  get WeekCardRecharge() {
    return this.stateItemWeekCardRechargeRef.current;
  }

  get WeekCardDays() {
    const WeekCardRecharge = this.WeekCardRecharge;
    if (!WeekCardRecharge) {
      return [];
    }
    const hasBuy = WeekCardRecharge.hasBuy;
    return [
      {
        rewardId: 'xx',
        rewardType: 'GOLD',
        rewardAmount: WeekCardRecharge.coinNum,
        rewardStatus: hasBuy ? 'HAS_RECEIVED' : 'CAN_BUY',
      },
      ...WeekCardRecharge.payGiftActivityRewardsView,
    ].map((item, idx) => {
      return {
        ...item,
        day: idx + 1,
      };
    });
  }

  /**
   *
   * @param timeout     ，       revalidation  ，   0
   */
  async refreshWeekCardRecharge(timeout?: number) {
    return stateItemWeekCardRecharge.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
}

export default stateItemWeekCardRecharge;
