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
    <div class="flex-1 flex flex-col justify-center overflow-hidden">
      <div
        class="text-[#333] text-[13px] font-robot-regular leading-4 tz-ellipsis-break-2 overflow-hidden mr-0.5"
      >
        {{ taskInfo.name }}
      </div>
      <div
        class="flex items-center font-robot-medium font-medium text-sm truncate leading-none mb-0.5 text-[#FFAD01]"
      >
        <div
          class="flex items-end mr-1 shrink-0"
          v-for="pitem in propList"
          :key="pitem.id"
        >
          <div
            class="bg-contain bg-no-repeat bg-center w-5 h-5 mr-[1px]"
            :style="$ss.getters.convertBgImageStyle(pitem.imageUrl, false)"
          ></div>
          <div class="leading-4">{{ getPropNumText(pitem) }}</div>
        </div>
      </div>
    </div>
    <div
      class="shrink-0 flex flex-col items-center justify-center pt-1"
      :style="$ss.getters.normalizeCss({ width: 72 })"
    >
      <template v-if="taskRightInfo.type === 'button'">
        <!-- ProgressBar -->
        <GameTaskProgress
          class="mb-2"
          :style="$ss.getters.normalizeCss({ width: 72 })"
          :task-info="taskInfo"
        ></GameTaskProgress>
        <button
          @click="onTaskClick"
          class="vbtn vbtn--sm w-[72px]"
          :class="taskRightInfo.btnClass"
        >
          {{ btnText }}
        </button>
      </template>
      <div
        v-else
        class="bg-contain bg-center bg-no-repeat w-12 h-12"
        :style="$ss.getters.normalizeCss({}, taskRightInfo.icon)"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import GameTaskProgress from '@/modules/GameTask/GameTaskProgress.vue';
import { emitGBus } from '@/utils/GBus';
import { mixins } from 'vue-class-component';
import VTaskItemMixin from '@/modules/VTask/VTaskItemMixin';
import { webpFilter } from '@/directives/webp';

@Component({
  components: { GameTaskProgress },
})
export default class GameTaskNoviceItem extends mixins(VTaskItemMixin) {
  @Prop({
    type: String,
  })
  taskModuleType:
    | 'VGAME_NOVICE_FIVE_DAYS_VGAME_NOVICE_FIRST_DAY'
    | 'VGAME_NOVICE_FIVE_DAYS_VGAME_NOVICE_SECOND_DAY'
    | 'VGAME_NOVICE_FIVE_DAYS_VGAME_NOVICE_THIRD_DAY'
    | 'VGAME_NOVICE_FIVE_DAYS_VGAME_NOVICE_FOURTH_DAY'
    | 'VGAME_NOVICE_FIVE_DAYS_VGAME_NOVICE_FIFTH_DAY';
  get propList() {
    return this.taskInfo?.propRewards || [];
  }
  get taskRightInfo() {
    const taskInfo = this.taskInfo;
    const status = taskInfo.status;

    if (status === 'TIMEOUT' || status === 'FINISHED') {
      const TIMESTAMP_CONFIG = {
        TIMEOUT: {
          en: webpFilter(
            require('@/assets/gameTaskNovice/overdue-en.png?webp')
          ),
          id: webpFilter(
            require('@/assets/gameTaskNovice/overdue-id.png?webp')
          ),
        },
        FINISHED: {
          en: webpFilter(
            require('@/assets/gameTaskNovice/claimed-en.png?webp')
          ),
          id: webpFilter(
            require('@/assets/gameTaskNovice/claimed-id.png?webp')
          ),
        },
      };
      return {
        type: 'stamp',
        icon: this.$ss.getters.translateImage(TIMESTAMP_CONFIG[status]),
      };
    } else {
      const TEXTMAP = {
        ['UNDERWAY']: this.$t('V.UNDERWAY'),
        ['AVAILABLE']: this.$t('V.AVAILABLE'),
        // [GameUserTaskStatus.received]: this.$t('V.FINISHED'),
      };
      return {
        type: 'button',
        text: TEXTMAP[this.taskInfo.status as 'UNDERWAY'],
        btnClass: status === 'AVAILABLE' ? 'vbtn--primary' : 'vbtn--green',
      };
    }
  }

  async onTaskClick() {
    emitGBus('dealTaskLogic', {
      taskInfo: this.taskInfo,
      taskModuleType: this.taskModuleType,
    });
  }
}
</script>
