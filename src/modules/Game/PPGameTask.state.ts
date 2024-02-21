import { MS_MINUTE } from '@/constants/time';
import {
  createHttpAsyncStateItem,
  getClientTimestampByAsyncStateItemRef,
} from '@/controller/AsyncStateItem';
import { vGameNoviceTaskController } from '@/vservices/client/TaskController';
import Vue from 'vue';
import Component from 'vue-class-component';

const stateItemVPPGameTask = createHttpAsyncStateItem(
  vGameNoviceTaskController,
  null,
  'PPGameTask'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE;

@Component({})
export class VPPGameTaskMixin extends Vue {
  stateItemVPPGameTaskRef = stateItemVPPGameTask.ref;

  get VPPGameTaskInfo() {
    return this.stateItemVPPGameTaskRef.current;
  }
  get VPPGameTaskInfoFiltered() {
    return this.VPPGameTaskInfo?.filter((item) => {
      return item.status === 'UNDERWAY' || item.status === 'AVAILABLE';
    });
  }

  get PPGameClientEndTime() {
    const endTime = this.VPPGameTaskInfo?.[0]?.endTime;
    return getClientTimestampByAsyncStateItemRef(
      endTime,
      this.stateItemVPPGameTaskRef
    );
  }
  /**
   *
   * @param timeout     ，       revalidation  ，   0
   */
  async refreshVPPGameTask(timeout?: number) {
    return stateItemVPPGameTask.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
}

export default stateItemVPPGameTask;
