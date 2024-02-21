<template>
  <div
    class="w-full flex justify-between items-center pr-1.5 pl-2 bg-white border-[#FCE5AD] border-[2px] rounded-[10px]"
    :style="
      $ss.getters.normalizeCss({
        height: 64,
      })
    "
  >
    <div
      class="w-12 h-12 rounded-md border border-[#DFB462] shrink-0 mr-1.5 flex items-center justify-center bg-[#634C3B]"
    >
      <div
        class="bg-center bg-contain bg-no-repeat"
        :style="
          $ss.getters.normalizeCss(
            {
              width: 40,
              height: 40,
            },
            taskInfo.icon,
            false
          )
        "
      ></div>
    </div>
    <div
      class="flex-1 -scroll-mr-0.5 flex flex-col justify-center text-[#333] overflow-hidden"
    >
      <div
        class="mb-1 text-sm font-robot-regular leading-[1.1em] tz-ellipsis-break-2 h-[30px]"
      >
        {{ taskInfo.name }}
      </div>
      <div
        class="flex items-center font-robot-medium font-medium text-sm truncate leading-none"
        v-if="propList.length > 0"
      >
        <div
          class="flex items-center mr-1 shrink-0"
          v-for="pitem in propList"
          :style="{ color: pitem.type === 'VTOKEN' ? '#1984AB' : '#FFAD01' }"
          :key="pitem.propId"
        >
          <div
            class="bg-contain bg-no-repeat bg-center w-5 h-5 mr-[1px]"
            :style="$ss.getters.convertBgImageStyle(pitem.imageUrl, false)"
          ></div>
          <div>{{ getPropNumText(pitem) }}</div>
        </div>
      </div>
    </div>
    <div class="shrink-0 flex flex-col items-center justify-center pt-1">
      <!-- ProgressBar -->
      <GameTaskProgress
        class="mb-2"
        :style="$ss.getters.normalizeCss({ width: 72 })"
        :task-info="taskInfo"
      ></GameTaskProgress>
      <button
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
    </div>
  </div>
</template>

<script lang="ts">
import { GameUserTaskStatus } from '@/modules/VTask/VTask.model';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import GameTaskProgress from './GameTaskProgress.vue';
import { emitGBus } from '@/utils/GBus';
import { mixins } from 'vue-class-component';
import VTaskItemMixin from '@/modules/VTask/VTaskItemMixin';

@Component({
  components: { GameTaskProgress },
})
export default class GameTaskItem extends mixins(VTaskItemMixin) {
  @Prop({
    type: String,
  })
  taskModuleType:
    | 'TASK_CENTER_NOVICE'
    | 'TASK_CENTER_DAILY'
    | 'INVITE_CONTINUITY';

  /**
   *     Theme(  ，    )
   */
  @Prop({
    type: Boolean,
  })
  isNewTheme: boolean;

  get isClaimable() {
    const taskInfo = this.taskInfo;
    const status = taskInfo.status;
    return status === GameUserTaskStatus.claimable;
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
    return (this.taskInfo?.propRewards || []).map((item) => {
      return item;
    });
  }
  async onTaskClick() {
    emitGBus('dealTaskLogic', {
      taskInfo: this.taskInfo,
      taskModuleType: this.taskModuleType,
    });
  }
}
</script>
