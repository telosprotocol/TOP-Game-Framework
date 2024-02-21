import { waitUserIsLoginedAuth } from '@/store/modules/user.utils';
import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';

import Vue from 'vue';
import Component from 'vue-class-component';
import { taskListStatusTaskController } from '@/vservices/client/TaskController';
import { createHttpOKResponse } from '@/http/createHttpResponse';
const moduleType = 'VGAME_WELCOME';
const groupType = 'VGAME_WELCOME';
async function getVNoviceGuideTask() {
  const isLogined = await waitUserIsLoginedAuth();
  if (!isLogined) {
    const result = createHttpOKResponse({
      list: [{ status: 'AVAILABLE' }] as Partial<API.TaskItemVO>[],
      isLogined: false,
    });
    return result;
  }
  return taskListStatusTaskController({ moduleType, groupType }).then((res) => {
    const { data, ...rest } = res;
    return {
      ...rest,
      data: data
        ? {
            list: data,
            isLogined: true,
          }
        : null,
    };
  });
}

const stateItemVNoviceGuideTask = createHttpAsyncStateItem(
  () => {
    return getVNoviceGuideTask();
  },
  null,
  'NoviceGuideTask'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 5;

@Component({})
export class VNoviceGuideTaskMixin extends Vue {
  stateItemVNoviceGuideTaskRef = stateItemVNoviceGuideTask.ref;

  get VNoviceGuideTaskInfo() {
    return this.stateItemVNoviceGuideTaskRef.current;
  }

  get VNoviceGuideIsNew() {
    const taskStatus = this.VNoviceGuideTaskInfo?.list?.[0]?.status;
    return taskStatus === 'UNDERWAY' || taskStatus === 'AVAILABLE';
  }

  /**
   *
   * @param timeout     ，       revalidation  ，   0
   */
  async refreshVNoviceGuideTask(timeout?: number) {
    const isLogined = await waitUserIsLoginedAuth();
    const isLoginedChanged = this.VNoviceGuideTaskInfo?.isLogined !== isLogined;
    if (isLoginedChanged) {
      stateItemVNoviceGuideTask.ref.lastSetDt = 0; //
    }
    return stateItemVNoviceGuideTask.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
}

export default stateItemVNoviceGuideTask;
