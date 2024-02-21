<template>
  <div
    class="w-full h-3.5 relative rounded-full overflow-hidden flex items-center justify-center"
    :class="{ 'bg-[#E7E4DC]': true }"
  >
    <div
      v-if="progressInfo.percent"
      class="absolute left-0 top-0 bottom-0 z-0 rounded-full bg-[length:24px_100%] bg-repeat-x bg-left"
      :style="{
        width: `${(progressInfo.percent * 100).toFixed(3)}%`,
        backgroundImage:
          'linear-gradient(-45deg, #FCCE3E 36%, #FABC0A 28%, #FABC0A 67%, #FCCE3E 25%)',
      }"
    ></div>
    <div
      v-if="!noText"
      class="relative z-1 text-center robot text-[#6D1216] whitespace-nowrap scale-75 text-xs"
    >
      {{ progressInfo.text }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { GameUserTaskStatus } from '@/modules/VTask/VTask.model';
import type { IVGameTaskItem } from '@/modules/VTask/VTask.model';
import { formatNumberInAbbreviation } from '@/store/modules/universe/universe';
@Component({
  components: {},
})
export default class GameTaskProgress extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  taskInfo: IVGameTaskItem;

  @Prop({
    type: Boolean,
  })
  noText: boolean;

  get progressInfo() {
    const taskInfo = this.taskInfo;
    if (taskInfo) {
      const status = taskInfo.status;
      const currentValue = Number(taskInfo.currentValue);
      const targetValue = Number(taskInfo.targetValue);
      // const MAX_VALUE = 10000000;
      const curText = formatNumberInAbbreviation(currentValue, 4, 0);
      // currentValue > MAX_VALUE
      //   ? formatFloatG(MAX_VALUE, {
      //       precision: 0,
      //     }) + '+'
      //   : formatFloatG(currentValue, {
      //       precision: 0,
      //     });
      const text = `${curText}/${formatNumberInAbbreviation(
        targetValue,
        4,
        0
      )}`;
      if (status === GameUserTaskStatus.doing || status === 'NOT_TAKEN') {
        return {
          percent: Math.min(currentValue / targetValue, 1),
          text,
        };
      } else {
        //if(status===GameUserTaskStatus.claimable)
        return {
          percent: 1,
          text,
        };
      }
    } else {
      return {
        percent: 1,
        text: '',
      };
    }
  }
}
</script>
