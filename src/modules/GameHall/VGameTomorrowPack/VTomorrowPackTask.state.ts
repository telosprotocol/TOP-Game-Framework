import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import Vue from 'vue';
import Component from 'vue-class-component';

import { vGameTomorrowGiftTaskController } from '@/vservices/client/TaskController';

const stateItemVTomorrowPackTask = createHttpAsyncStateItem(
  vGameTomorrowGiftTaskController,
  null,
  'VTomorrowPackTask'
);

//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 30;

@Component({})
export class VTomorrowPackTaskMixin extends Vue {
  stateItemVTomorrowPackTaskRef = stateItemVTomorrowPackTask.ref;

  get TomorrowPackTask() {
    return this.stateItemVTomorrowPackTaskRef.current?.[0];
  }

  /**
   *
   * @param timeout     ，       revalidation  ，   0
   */
  refreshVTomorrowPackTask(timeout?: number) {
    return stateItemVTomorrowPackTask.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
}

export default stateItemVTomorrowPackTask;
