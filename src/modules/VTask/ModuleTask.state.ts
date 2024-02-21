import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { taskListStatusTaskController } from '@/vservices/client/TaskController';
import Vue from 'vue';

export function createModuleTaskState(query: API.TaskGroupQueryAO) {
  /**
   *        (      )
   */
  const stateItemVModuleTasks = createHttpAsyncStateItem(
    () => {
      return taskListStatusTaskController(query);
    },
    null,
    `Task_${query.moduleType}_${query.groupType}`
  );
  //   revalidation for tab active
  const REVALIDATION_MS = MS_MINUTE * 2;

  /**
   *
   */
  const VModuleTasksMixin = Vue.extend({
    data() {
      return {
        stateItemVModuleTasksRef: stateItemVModuleTasks.ref,
      };
    },
    computed: {
      VModuleTasks() {
        return this.stateItemVModuleTasksRef?.current;
      },
    },
    methods: {
      /**
       *
       * @param timeout     ，       revalidation  ，   0
       */
      refreshVModuleTasks(timeout?: number) {
        return stateItemVModuleTasks.tryUpdate(
          timeout == null ? REVALIDATION_MS : timeout
        );
      },
    },
  });

  return { VModuleTasksMixin, stateItemVModuleTasks };
}
