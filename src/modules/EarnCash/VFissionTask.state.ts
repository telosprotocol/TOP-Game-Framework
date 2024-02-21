import { waitUserIsLoginedAuth } from '@/store/modules/user.utils';
import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { taskListUserFissionController } from '@/vservices/client/UserFissionController';
import Vue from 'vue';
import { noLoginTaskListUserFissionController } from '@/vservices/restful/UserFissionController';

/**
 *
 */
const stateItemVFissionTask = createHttpAsyncStateItem(
  async () => {
    const isLogined = await waitUserIsLoginedAuth();
    if (!isLogined) {
      return noLoginTaskListUserFissionController();
    }
    return taskListUserFissionController();
  },
  null,
  `FissionTask`
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 2;

/**
 *
 */
export const VFissionTaskMixin = Vue.extend({
  data() {
    return {
      stateItemVFissionTaskRef: stateItemVFissionTask.ref,
    };
  },
  computed: {
    VFissionTask() {
      return this.stateItemVFissionTaskRef?.current?.tasks;
    },
    VFissionIsNovice() {
      return this.stateItemVFissionTaskRef?.current?.novice;
    },
  },
  methods: {
    /**
     *
     * @param timeout     ，       revalidation  ，   0
     */
    refreshVFissionTask(timeout?: number) {
      return stateItemVFissionTask.tryUpdate(
        timeout == null ? REVALIDATION_MS : timeout
      );
    },
  },
});
