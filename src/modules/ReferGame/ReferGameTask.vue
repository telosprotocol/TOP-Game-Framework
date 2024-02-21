<template>
  <div class="bg-[#FFFCE5] rounded-t-[20px] p-3">
    <h3 class="font-rubik font-bold text-[#EB5129] text-base mb-3">
      {{ $t('VRG.taskTitle') }}
    </h3>
    <NoDataIcon
      v-if="noTask"
      class="text-[#EB5129] p-2 py-5 opacity-60 text-center text-sm"
    >
      {{ $t('VGT.groupMissionDone') }}
    </NoDataIcon>
    <GameTaskItem
      v-for="(item, idx) in taskList"
      :class="{ 'mb-3': idx !== taskList.length - 1 }"
      :task-info="item"
      :is-new-theme="false"
      task-module-type="INVITE_CONTINUITY"
      :key="item.taskId"
    ></GameTaskItem>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { VModuleTasksMixinForReferGame } from './ReferGameTask.state';
import BindEventMixinDefault from '../../mixins/BindEventMixin';
import GameTaskItem from '../GameTask/GameTaskItem.vue';
import { tryMergeLocalesForVPrjGameTaskPage } from '@/locales/Page/VPrj/VGT/init';
import { onGBus } from '@/utils/GBus';
import stateItemGameInviteFlipCard from './GameInviteFlipCard.state';
import NoDataIcon from '@/components/NoData/NoDataIcon.vue';
tryMergeLocalesForVPrjGameTaskPage();
@Component({
  components: { GameTaskItem, NoDataIcon },
})
export default class ReferGameTask extends mixins(
  BindEventMixinDefault,
  VModuleTasksMixinForReferGame
) {
  useInited() {
    this.refreshVModuleTasks();
    return onGBus('onVTaskUpdate', (payload) => {
      if (
        (payload.type === 'single' &&
          payload.taskModuleType === 'INVITE_CONTINUITY') ||
        payload.type === 'behavior'
      ) {
        this.refreshVModuleTasks(10);
        stateItemGameInviteFlipCard.tryUpdate(10);
      }
    });
  }
  get taskList() {
    return (this.VModuleTasks || []).filter((item) => {
      return item.status !== 'FINISHED';
    });
  }

  get noTask() {
    if (!this.VModuleTasks) {
      return false;
    }
    return this.taskList.length === 0;
  }
}
</script>
