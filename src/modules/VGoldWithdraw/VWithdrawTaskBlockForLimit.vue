<template>
  <section class="mb-4">
    <div class="text-[#333] font-semibold mb-2">
      {{ $t('VGW.completeTasksForImmediateWithdrawal') }}
    </div>
    <VWithdrawTaskItem
      class="mb-2"
      v-for="item in taskList"
      :item="item"
      task-module-type="WITHDRAW_LIMIT_TIME"
      :key="item.taskId"
    >
    </VWithdrawTaskItem>
  </section>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { VModuleTasksMixinForLimitWithdraw } from './controller/WithdrawTask.state';
import BindEventMixinDefault from '@/mixins/BindEventMixin';

import { onGBus } from '@/utils/GBus';
import VWithdrawTaskItem from './VWithdrawTaskItem.vue';

@Component({
  components: { VWithdrawTaskItem },
})
export default class VWithdrawTaskBlockForLimit extends mixins(
  VModuleTasksMixinForLimitWithdraw,
  BindEventMixinDefault
) {
  useInited() {
    this.refreshVModuleTasks();
    return onGBus('onVTaskUpdate', (payload) => {
      if (
        (payload.type === 'single' &&
          payload.taskModuleType === 'WITHDRAW_LIMIT_TIME') ||
        payload.type === 'behavior'
      ) {
        this.refreshVModuleTasks(10);
      }
    });
  }

  get taskList() {
    return this.VModuleTasks;
  }
  get isTaskWithdrawOK() {
    const taskList = this.VModuleTasks || [];
    if (taskList.length === 0) {
      return true;
    }
    //                 
    for (let i = 0; i < taskList.length; i++) {
      const taskStatus = taskList[i].status;
      if (taskStatus === 'FINISHED' || taskStatus === 'AVAILABLE') {
        return true;
      }
    }
    return false;
  }
}
</script>
