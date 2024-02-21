<template>
  <div>
    <GameTaskItem
      v-for="(item, idx) in taskList"
      :class="{ 'mb-1.5': idx !== taskList.length - 1 }"
      :task-info="item"
      :is-new-theme="groupType === 'NEWHAND'"
      :task-module-type="taskModuleType"
      :key="item.taskId"
    ></GameTaskItem>
    <NoDataIcon
      v-if="taskList.length === 0"
      class="px-2 text-[#F39B07] mt-6 text-center"
    >
      {{ $t('VGT.groupMissionDone') }}
    </NoDataIcon>
    <!-- <div
      v-if="groupInfo.expirationClientTime != null"
      class="rounded-full h-5 px-2 mr-1 flex items-center bg-[rgba(0,0,0,0.3)] text-[#ccc] leading-none"
    >
      {{ $t('VGT.taskRefreshTitle') }}:&nbsp;
      <VCountDown
        @end="onCountDownEnd"
        :expiration-client-time="groupInfo.expirationClientTime"
      ></VCountDown>
    </div> -->
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Prop, Mixins } from 'vue-property-decorator';
import GameTaskItem from './GameTaskItem.vue';
import { GameUserTaskStatus } from '@/modules/VTask/VTask.model';
import type { IGAME_TASK_TYPE } from '@/modules/VTask/VTask.model';
import VCountDown from './VCountDown.vue';
import { VGameUserTaskMixin } from './GameUserTask.state';
import { convertBgImageStyle } from '@/utils/styles';
import type { IUserGameTaskGroupVO } from './GameUserTask.api';
import NoDataIcon from '@/components/NoData/NoDataIcon.vue';

@Component({
  components: {
    GameTaskItem,
    VCountDown,
    NoDataIcon,
  },
})
export default class GameTaskGroupItem extends Mixins(VGameUserTaskMixin) {
  @Prop({
    type: Object,
  })
  groupInfo?: IUserGameTaskGroupVO;

  @Prop({
    type: String,
    default: 'DAILY',
  })
  groupType: IGAME_TASK_TYPE;

  get taskModuleType() {
    const groupType = this.groupType;
    if (groupType === 'NEWHAND') {
      return 'TASK_CENTER_NOVICE';
    } else {
      return 'TASK_CENTER_' + groupType;
    }
  }

  // onCountDownEnd() {
  //   //
  //   this.refreshVGameUserTask(0);
  // }
  get taskList() {
    return (
      this.groupInfo?.tasks?.filter((item) => {
        return item.status !== GameUserTaskStatus.received;
      }) || []
    );
  }
  get needShow() {
    const taskList = this.taskList;
    const noTask = taskList && taskList.length === 0;
    //
    const needHide = noTask && this.groupInfo.taskType === 'NEWHAND';
    return !needHide;
  }

  get bgTitleStyle() {
    return convertBgImageStyle(
      require('@/assets/gametask/bgGroupTitle.png?webp'),
      true,
      {
        height: this.$ss.getters.designPxToReal(37) + 'px',
        textStroke: '1px #710804',
      } as any
    );
  }
}
</script>
