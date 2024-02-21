<template>
  <section class="mb-4">
    <div class="text-[#333] font-semibold mb-2">
      {{ $t('VGW.completeTasksForImmediateWithdrawal') }}
    </div>
    <VWithdrawTaskItem
      v-for="item in taskList"
      class="mb-2"
      :item="item"
      task-module-type="WITHDRAW_SMALL_WITHDRAW"
      :key="item.taskId"
    >
    </VWithdrawTaskItem>
  </section>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { VModuleTasksMixinForSmallWithdraw } from './controller/WithdrawTask.state';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { onGBus } from '@/utils/GBus';
import VWithdrawTaskItem from './VWithdrawTaskItem.vue';

@Component({
  components: { VWithdrawTaskItem },
})
export default class VWithdrawTaskBlockForSmall extends mixins(
  VModuleTasksMixinForSmallWithdraw,
  BindEventMixinDefault
) {
  useInited() {
    this.refreshVModuleTasks();
    return onGBus('onVTaskUpdate', (payload) => {
      if (
        (payload.type === 'single' &&
          payload.taskModuleType === 'WITHDRAW_SMALL_WITHDRAW') ||
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
    //
    const taskList = this.VModuleTasks || [];
    for (let i = 0; i < taskList.length; i++) {
      const taskStatus = taskList[i].status;
      if (!(taskStatus === 'FINISHED' || taskStatus === 'AVAILABLE')) {
        return false;
      }
    }

    return true;
  }
}
</script>
