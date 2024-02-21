<template>
  <div
    class="flex justify-between items-stretch bg-[#F8F6FE] rounded-lg py-3 px-2"
  >
    <div
      class="mr-3 shrink-0 bg-center bg-contain bg-no-repeat"
      :style="
        $ss.getters.normalizeCss(
          { width: 72, height: 72 },
          taskInfo.icon,
          false
        )
      "
    ></div>
    <div class="flex-1 flex flex-col justify-between">
      <div
        class="text-sm font-robot-bold font-bold mb-2 tz-ellipsis-break-2 text-[#333] leading-4"
      >
        {{ taskInfo.name }}
      </div>
      <div class="flex justify-between items-center">
        <div class="flex items-center flex-1">
          <div
            v-if="firstReward"
            class="bg-contain bg-center bg-no-repeat w-5 h-5 mr-[1px]"
            :style="$ss.getters.normalizeCss({}, firstReward.imageUrl)"
          ></div>
          <div
            v-if="firstReward"
            class="text-base font-bold text-[#FF5E48] tz-ellipsis-break-1"
          >
            {{ $ss.getters.formatFloat(Number(firstReward.propNum)) }}
          </div>
        </div>
        <button
          v-if="taskStatus !== 'FINISHED'"
          @click="onTaskClick"
          class="shrink-0 h-7 flex items-center justify-center rounded-full text-white font-semibold text-xs active:scale-95 px-2 ml-1"
          :style="{
            background:
              taskStatus === 'AVAILABLE'
                ? 'linear-gradient(107.93deg, #4DC584 20.89%, #33EC97 72.06%)'
                : 'linear-gradient(107.93deg, #FF832C 20.89%, #FFC658 72.06%)',
          }"
        >
          {{ specialBtnText }}
          <ib class="iconfont icon-right" v-if="taskStatus === 'UNDERWAY'"></ib>
        </button>
        <div v-else class="relative h-7 w-14">
          <div
            class="bg-contain bg-center bg-no-repeat absolute"
            :style="
              $ss.getters.normalizeCss(
                { width: 52, height: 52, bottom: -8 },
                $ss.getters.translateImage({
                  en: require('@/assets/gameTaskNovice/claimed-en.png?webp'),
                  id: require('@/assets/gameTaskNovice/claimed-id.png?webp'),
                }),
                true
              )
            "
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { emitGBus } from '@/utils/GBus';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import VTaskItemMixin from '@/modules/VTask/VTaskItemMixin';
import { Prop } from 'vue-property-decorator';
import type { ITaskModuleType } from '@/modules/VTask/VTask.controller';
@Component({
  components: {},
})
export default class EarnTaskItem extends mixins(VTaskItemMixin) {
  get firstReward() {
    const item = this.taskInfo;
    return item?.propRewards?.[0];
  }

  @Prop({
    type: String,
  })
  taskGroupType: ITaskModuleType;

  get specialBtnText() {
    if (this.taskStatus === 'AVAILABLE') {
      return this.$t('VEC.revMoney');
    } else {
      return this.btnText;
    }
  }

  @Prop({
    type: Function,
    required: false,
  })
  taskClick: () => void;

  async onTaskClick() {
    const taskClick = this.taskClick;
    if (taskClick) {
      taskClick();
    } else {
      emitGBus('dealTaskLogic', {
        taskInfo: this.taskInfo,
        taskModuleType: this.taskGroupType,
        ignoreLoginCheck: true,
      });
    }
  }
}
</script>
