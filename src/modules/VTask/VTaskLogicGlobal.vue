<template>
  <VTaskLogic ref="logic" @updateTask="onTaskUpdate"></VTaskLogic>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import VTaskLogic from './VTaskLogic.vue';
import { mixins } from 'vue-class-component';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { onGBus } from '@/utils/GBus';
import type { IVTaskItemBase } from '@/modules/VTask/VTask.model';
import type { ITaskModuleType } from '@/modules/VTask/VTask.controller';
import { emitGBus } from '@/utils/GBus';

/**
 *        （         ， page     ）
 *         ：
 * 
    onGBus('onVTaskUpdate', (payload) => {
    if (
     (payload.type === 'single' &&
          payload.taskModuleType === 'HIGGS_DAY') ||
          payload.type === 'behavior'
    ) {
      this.refreshVGameUserTask(10);
    }
  });
 */
@Component({
  components: { VTaskLogic },
})
export default class VTaskLogicGlobal extends mixins(BindEventMixinDefault) {
  $refs: {
    logic: VTaskLogic;
  };
  useInited() {
    return onGBus(
      'dealTaskLogic',
      ({ taskInfo, taskModuleType, ignoreLoginCheck }) => {
        this.$refs.logic.onTaskClick(
          taskInfo,
          taskModuleType,
          ignoreLoginCheck
        );
      }
    );
  }

  onTaskUpdate(info: {
    taskInfo: IVTaskItemBase;
    taskModuleType: ITaskModuleType;
    taskDealType: 'Claim' | 'Retry';
  }) {
    emitGBus('onVTaskUpdate', {
      type: 'single',
      taskId: info.taskInfo.taskId,
      old: info.taskInfo,
      taskModuleType: info.taskModuleType,
      taskDealType: info.taskDealType,
    });
  }
}
</script>
