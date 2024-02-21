<template>
  <button
    class="flex items-center flex-col active:scale-95 relative"
    @click.stop="onButtonClick"
    :style="$ss.getters.normalizeCss({ minWidth: 62 })"
  >
    <div
      class="w-10 h-10 bg-contain bg-center bg-no-repeat relative"
      :style="$ss.getters.normalizeCss({ marginBottom: 3 }, info.icon, false)"
    >
      <VDotStatus status="red" position="right" v-if="hasDot"></VDotStatus>
    </div>
    <EntryTimeCountDown
      v-if="clientEndTime"
      :client-end-time="clientEndTime"
      @countdownEnd="onCountDownEnd"
    ></EntryTimeCountDown>
    <slot></slot>
    <div
      class="relative text-white font-robot-bold font-[600] text-xs leading-4 vshadow-stroke shadow-[#C65133] -mt-0.5"
    >
      {{ info.name || ' ' }}
    </div>
  </button>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import type { IActivityBaseModel } from './activity-logic.config';
import { mixins } from 'vue-class-component';
import { VActivityHallListMixin } from '@/modules/VActivityList/activity-hall.state';
import VDotStatus from '@/modules/GameHall/VDotStatus.vue';
import EntryTimeCountDown from './EntryTimeCountDown.vue';
@Component({
  components: { VDotStatus, EntryTimeCountDown },
})
export default class VHallActivityButton extends mixins(
  VActivityHallListMixin
) {
  @Prop({
    type: Object,
    required: true,
  })
  info: IActivityBaseModel;

  @Prop({
    type: Number,
    required: false,
  })
  clientEndTime?: number;

  get hasDot() {
    return !!this.info.hasRedDot;
  }

  async onButtonClick() {
    this.$emit('click', this.info);
  }

  onCountDownEnd() {
    this.$emit('countdownEnd', this.info);
  }
}
</script>
