<template>
  <div
    class="rounded-md bg-[#F6F6F6] p-3 pl-2.5 flex items-center justify-center"
  >
    <div
      class="w-10 h-10 bg-cover bg-center bg-no-repeat mr-1 shrink-0"
      :style="$ss.getters.convertBgImageStyle(item.icon)"
    ></div>
    <div
      class="flex-1 text-[#333] font-semibold text-sm tz-ellipsis-break-2 mr-3"
    >
      {{ item.name }}
    </div>
    <div class="w-20 shrink-0">
      <div
        v-if="item.status === 'FINISHED' || item.status === 'AVAILABLE'"
        class="bg-contain bg-center bg-no-repeat relative mx-auto"
        :style="
          $ss.getters.convertBgImageStyle(
            $ss.getters.translateImage({
              en: '/online/task/iconDone-en.png?webp',
              id: '/online/task/iconDown-id.png?webp',
            }),
            true,
            $ss.getters.designPxsObjToReal({
              width: 61,
              height: 53,
            })
          )
        "
      ></div>
      <button
        v-else
        @click="onTaskClick(item)"
        class="shrink-0 h-8 flex items-center justify-center rounded-full bg-[#F7ECC5] text-[#C86630] font-semibold text-sm w-20 active:scale-95"
      >
        {{ $t('V.UNDERWAY') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { emitGBus } from '@/utils/GBus';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import type { IVTaskItemBase } from '@/modules/VTask/VTask.model';
@Component({
  components: {},
})
export default class VWithdrawTaskItem extends Vue {
  @Prop({
    type: Object,
  })
  item: IVTaskItemBase;

  @Prop({
    type: String,
  })
  taskModuleType: 'WITHDRAW_SMALL_WITHDRAW' | 'WITHDRAW_LIMIT_TIME';

  onTaskClick(item: IVTaskItemBase) {
    emitGBus('dealTaskLogic', {
      taskInfo: item,
      taskModuleType: this.taskModuleType,
    });
  }
}
</script>
