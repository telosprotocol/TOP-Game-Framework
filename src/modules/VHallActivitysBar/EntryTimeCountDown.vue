<template>
  <div
    v-if="clientEndTime"
    class="absolute bg-contain bg-center bg-no-repeat flex items-center justify-center font-robot-bold font-bold text-[10px] leading-none text-[#1E222C]"
    :style="
      $ss.getters.normalizeCss(
        {
          width: 38,
          height: 19,
          paddingBottom: 0.5,
          top: 27,
        },
        require('@/assets/gameHall/time-bg.png?webp'),
        true
      )
    "
  >
    {{ leftCountDownTxt }}
  </div>
</template>

<script lang="ts">
import TimeCountDownMixin from '@/components/CountDownTimer/TimeCountDownMixin';
import Component, { mixins } from 'vue-class-component';
import TimeCountDown from '../../components/CountDownTimer/TimeCountDown.vue';
@Component({
  components: { TimeCountDown },
})
export default class EntryTimeCountDown extends mixins(TimeCountDownMixin) {}
</script>
