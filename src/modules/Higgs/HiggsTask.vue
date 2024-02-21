<template>
  <div
    class="rounded-xl bg-gradient-to-b from-[#FFD59B] to-[#FFAC41] px-2 py-3 text-black flex items-center justify-between"
  >
    <div
      class="bg-contain bg-no-repeat bg-center shrink-0"
      :style="
        $ss.getters.convertBgImageStyle(
          taskInfo.icon,
          false,
          $ss.getters.designPxsObjToReal({
            width: 53,
            height: 53,
          })
        )
      "
    ></div>
    <div class="flex-1 h-full flex flex-col items-stretch justify-between">
      <div class="mb-1 text-sm leading-[1.1em] robot-bold tz-ellipsis-break-2">
        {{ taskInfo.name }}
      </div>
      <div
        class="bg-contain bg-center bg-no-repeat relative box-border p-[3px] pb-[5px]"
        :style="
          $ss.getters.convertBgImageStyle(
            require('@/assets/higgs/higgs_processBar.png?webp'),
            true,
            $ss.getters.designPxsObjToReal({
              width: 146,
              height: 17,
            })
          )
        "
      >
        <div
          class="bg-gradient-to-b from-[#D3E672] via-[#ADC944] to-[#567428] rounded-full h-full"
          :style="{ width: `${(percent * 100).toFixed(3)}%` }"
        ></div>
      </div>
    </div>
    <button
      @click="onTaskClick"
      class="shrink-0 w-20 h-[30px] rounded-full text-sm flex items-center justify-center active:scale-95 border-solid border font-rubik"
      :class="{
        'bg-gradient-to-b from-[#D3E672] via-[#ADC944] to-[#669A18]   border-[#928F1D] text-white shadow-md ':
          taskStatus !== 'FINISHED' && !isDisabled,
        'border-[#777] text-[#555]  font-medium':
          taskStatus === 'FINISHED' && isDisabled,
      }"
    >
      <div
        :class="{
          'vshadow-stroke shadow-[#727F3B]':
            taskStatus !== 'FINISHED' && !isDisabled,
        }"
      >
        {{ btnText }}
      </div>
    </button>
  </div>
</template>

<script lang="ts">
import { emitGBus } from '@/utils/GBus';
import VTaskItemMixin from '@/modules/VTask/VTaskItemMixin';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class HiggsTask extends mixins(VTaskItemMixin) {
  @Prop({
    type: Boolean,
  })
  isDisabled: boolean;
  async onTaskClick() {
    if (this.isDisabled) {
      return;
    }
    emitGBus('dealTaskLogic', {
      taskInfo: this.taskInfo,
      taskModuleType: 'HIGGS_DAY',
    });
  }
}
</script>
