import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import { penetrateGBusOnly } from '@/js_bridge/jsCallApp/utilsPenetrate';
import { onGBus } from '@/utils/GBus';
import Vue from 'vue';
import { getVGameUserTask } from './GameUserTask.api';

let isInited = false;
function tryInitGameTaskUpdate() {
  if (isInited) {
    return;
  }
  isInited = true;
  //      server     ，
  onGBus('onVUserGameTaskSync', (newInfo) => {
    stateItemVGameUserTask.setSuccessResult(newInfo);
  });
}
/**
 *        (      )
 */
const stateItemVGameUserTask = createHttpAsyncStateItem(
  () => {
    tryInitGameTaskUpdate();
    return getVGameUserTask();
  },
  null,
  'GameUserTask'
);
//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 2;

export function onGameTaskInfoSyncForGameTaskPage() {
  const cb = stateItemVGameUserTask.on2('updated', (res) => {
    if (res) {
      penetrateGBusOnly('onVUserGameTaskSync', res);
    }
  });
  // const cancelGBus = onGBus('onVUserGameTaskSync', () => {
  //   stateItemVGameUserTask.tryUpdate(0);
  // });
  return () => {
    stateItemVGameUserTask.off('updated', cb);
    // cancelGBus();
  };
}
/**
 *
 */
export const VGameUserTaskMixin = Vue.extend({
  data() {
    return {
      stateItemVGameUserTaskRef: stateItemVGameUserTask.ref,
    };
  },
  computed: {
    gameUserTaskGroups() {
      return this.stateItemVGameUserTaskRef?.current;
    },
  },
  methods: {
    // getTaskGroupByTaskGroup(taskGroupType: IGAME_TASK_TYPE) {
    //   const gameUserTaskGroups = this.gameUserTaskGroups;
    //   if (!gameUserTaskGroups) {
    //     return null;
    //   }
    //   return gameUserTaskGroups.find((groupItem) => {
    //     return (groupItem.taskType = taskGroupType);
    //   });
    // },

    /**
     *
     * @param timeout     ，       revalidation  ，   0
     */
    refreshVGameUserTask(timeout?: number) {
      return stateItemVGameUserTask.tryUpdate(
        timeout == null ? REVALIDATION_MS : timeout
      );
    },
  },
});

export default stateItemVGameUserTask;
