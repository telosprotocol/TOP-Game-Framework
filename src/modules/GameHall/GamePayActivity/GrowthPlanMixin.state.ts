import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import Vue from 'vue';
import Component from 'vue-class-component';
import { growthPlanGetPayGiftController } from '@/vservices/client/PayGiftController';

const stateItemGrowthPlan = createHttpAsyncStateItem(
  () => {
    return growthPlanGetPayGiftController();
  },
  null,
  'GrowthPlan'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 5;

@Component({})
export class GrowthPlanMixin extends Vue {
  stateItemGrowthPlanRef = stateItemGrowthPlan.ref;

  get GrowthPlanInfo() {
    return this.stateItemGrowthPlanRef.current;
  }

  /**
   *
   * @param timeout     ，       revalidation  ，   0
   */
  async refreshGrowthPlan(timeout?: number) {
    return stateItemGrowthPlan.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
}

export default stateItemGrowthPlan;
