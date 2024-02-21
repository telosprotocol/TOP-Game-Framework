<template>
  <div class="relative">
    <div
      class="flex items-center justify-between rounded-md overflow-hidden bg-contain bg-center bg-no-repeat pr-3 pl-2.5"
      :style="
        $ss.getters.normalizeCss(
          { width: 260, height: 60 },
          require('@/assets/gameMsg/itemMail.png?webp'),
          true
        )
      "
    >
      <div
        class="shrink-0 w-10 h-10 bg-contain bg-center mr-3"
        :style="iconStyle"
      ></div>
      <div class="flex-1 flex flex-col pt-2 overflow-hidden h-full">
        <h3
          class="flex-1 font-robot-medium font-medium tz-ellipsis-break-2 text-[#333] text-[14px] leading-[15px] mb-1"
          v-html="info.title"
        ></h3>
        <div
          class="flex justify-between items-center text-xs leading-none mb-1.5"
        >
          <div
            class="tz-ellipsis-break-1 text-[#666]"
            v-html="info.content"
          ></div>
          <div class="shrink-0 text-[#999] robot pl-1">
            {{ textDate }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="absolute bg-contain bg-center bg-no-repeat w-4 h-4 -left-1 -top-1"
      v-if="hasDot"
      v-webp="require('@/assets/gameMsg/redDot.png?webp')"
    ></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { dateTimeFmt } from '@/utils/datetime';

//{isRead}_{hasReward}
const IconMap = {
  false_false: require('@/assets/gameMsg/iconNotOpen.png?webp'),
  false_true: require('@/assets/gameMsg/iconNotOpenGift.png?webp'),
  true_false: require('@/assets/gameMsg/iconOpened.png?webp'),
  true_true: require('@/assets/gameMsg/iconOpenedGift.png?webp'),
} as Record<string, string>;
@Component({})
export default class VGameMessageItem extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  info: API.UserMessageVO;

  get textDate() {
    return dateTimeFmt('M/DD hh:mm', Number(this.info.pushDateTime));
  }

  get hasDot() {
    return this.info.hasReward || !this.info.readStatus;
  }

  get iconStyle() {
    const info = this.info;
    const icon = IconMap[`${!!info.readStatus}_${!!info.hasReward}`];
    return this.$ss.getters.convertBgImageStyle(icon, true);
  }
}
</script>
