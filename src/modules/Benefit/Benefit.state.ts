import { MS_SECOND } from './../../constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { rewardRechargeGetPayGiftController } from '@/vservices/client/PayGiftController';
import Vue from 'vue';
import Component from 'vue-class-component';

const stateItemBenefit = createHttpAsyncStateItem(
  () => {
    return rewardRechargeGetPayGiftController({
      activityType: 'WEEK_RECHARGE',
    });
  },
  null,
  'Benefit'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_SECOND * 5;

@Component({})
export class BenefitMixin extends Vue {
  stateItemBenefitRef = stateItemBenefit.ref;

  get Benefit() {
    return this.stateItemBenefitRef.current;
  }

  get WeekCardDays() {
    const Benefit = this.Benefit;
    if (!Benefit) {
      return [];
    }
    const hasBuy = Benefit.hasBuy;
    return [
      {
        rewardId: 'xx',
        rewardType: 'GOLD',
        rewardAmount: Benefit.coinNum,
        rewardStatus: hasBuy ? 'HAS_RECEIVED' : 'CAN_BUY',
      },
      ...Benefit.payGiftActivityRewardsView,
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
  async refreshBenefit(timeout?: number) {
    return stateItemBenefit.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
}

export default stateItemBenefit;
