import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import Vue from 'vue';
import Component from 'vue-class-component';
import { growthPlanTaskController } from '@/vservices/client/TaskController';

const stateItemGrowthPlanTask = createHttpAsyncStateItem(
  () => {
    return growthPlanTaskController();
  },
  null,
  'GrowthPlanTask'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 5;

@Component({})
export class GrowthPlanTaskMixin extends Vue {
  stateItemGrowthPlanTaskRef = stateItemGrowthPlanTask.ref;

  get GrowthPlanTaskInfo() {
    return this.stateItemGrowthPlanTaskRef.current;
  }

  /**
   *
   * @param timeout     ，       revalidation  ，   0
   */
  async refreshGrowthPlanTask(timeout?: number) {
    return stateItemGrowthPlanTask.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
}

export default stateItemGrowthPlanTask;
