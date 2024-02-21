<template>
  <div
    class="border-[2px] border-[#FCE5AD] bg-white rounded-md h-20 flex pr-0.5"
  >
    <div
      class="shrink-0 bg-gradient-to-b from-[#ADFAFF] to-[#9694FF] flex items-center justify-center px-1.5 rounded-l-md relative"
    >
      <div
        class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-full"
        :style="
          $ss.getters.normalizeCss({
            width: 45,
            height: 45,
            background:
              'linear-gradient(180deg, rgba(255, 254, 231, 0.9) 0%, rgba(218, 230, 255, 0.9) 100%)',
          })
        "
      ></div>
      <div
        class="bg-contain bg-center bg-no-repeat relative z-10"
        :style="
          $ss.getters.normalizeCss({ width: 45, height: 45 }, taskInfo.icon)
        "
      ></div>
    </div>
    <div class="flex-1 flex flex-col justify-between pl-1.5 pt-1.5 robot">
      <h3
        class="text-[#333] tz-ellipsis-break-3 text-[13px] robo leading-tight"
      >
        {{ taskInfo.description }}
      </h3>
      <div
        class="flex items-center font-robot-medium font-medium text-sm truncate leading-none mb-0.5 text-[#FFAD01]"
      >
        <div
          class="flex items-center mr-1 shrink-0"
          v-for="pitem in propList"
          :key="pitem.id"
        >
          <div
            class="bg-contain bg-no-repeat bg-center w-5 h-5 mr-[1px]"
            :style="$ss.getters.convertBgImageStyle(pitem.imageUrl, false)"
          ></div>
          <div>{{ getPropNumText(pitem) }}</div>
        </div>
      </div>
    </div>
    <div
      class="shrink-0 flex flex-col items-center justify-center pt-1"
      :style="$ss.getters.normalizeCss({ width: 72 })"
    >
      <GameTaskProgress
        v-if="taskStatus !== 'FINISHED'"
        class="mb-2 w-full"
        :task-info="taskInfo"
      ></GameTaskProgress>
      <button
        v-if="taskStatus !== 'FINISHED'"
        @click="onTaskClick"
        class="vbtn vbtn--sm w-[72px]"
        :class="{
          'vbtn--primary': isClaimable,
          'vbtn--green': !isClaimable,
        }"
      >
        <div>
          {{ btnText }}
        </div>
      </button>
      <div
        v-if="taskStatus === 'FINISHED'"
        class="bg-contain bg-center bg-no-repeat"
        :style="
          $ss.getters.normalizeCss(
            {
              width: 52,
              height: 52,
            },
            $ss.getters.translateImage({
              en: require('@/assets/gameCommon/taskStamp/stampDone-en.png?webp'),
              id: require('@/assets/gameCommon/taskStamp/stampDone-id.png?webp'),
            }),
            true
          )
        "
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { GameUserTaskStatus } from '@/modules/VTask/VTask.model';
import Component from 'vue-class-component';
import { emitGBus } from '@/utils/GBus';
import { mixins } from 'vue-class-component';
import VTaskItemMixin from '@/modules/VTask/VTaskItemMixin';
import GameTaskProgress from '@/modules/GameTask/GameTaskProgress.vue';

@Component({
  components: { GameTaskProgress },
})
export default class VTopupTaskItem extends mixins(VTaskItemMixin) {
  get isClaimable() {
    const taskStatus = this.taskStatus;
    return taskStatus === GameUserTaskStatus.claimable;
  }

  get btnText() {
    const TEXTMAP = {
      [GameUserTaskStatus.doing]: this.$t('VGT.toDo'),
      [GameUserTaskStatus.claimable]: this.$t('VGT.toClaim'),
      [GameUserTaskStatus.received]: this.$t('V.FINISHED'),
    };
    return TEXTMAP[this.taskInfo.status as 'UNDERWAY'] || 'Unkown';
  }
  get propList() {
    return this.taskInfo?.propRewards || [];
  }
  async onTaskClick() {
    emitGBus('dealTaskLogic', {
      taskInfo: this.taskInfo,
      taskModuleType: 'RECHARGE_DAILY',
    });
  }
}
</script>
