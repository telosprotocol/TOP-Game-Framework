<template>
  <span>{{ txtLeftTime }}</span>
</template>

<script lang="ts">
import { convertMsSecond2TimeInfo, TimeUnit } from '@/utils/datetime';
import Component, { mixins } from 'vue-class-component';
import TimeCountDownMixin from '@/components/CountDownTimer/TimeCountDownMixin';
@Component({
  components: {},
})
export default class VCountDownShort extends mixins(TimeCountDownMixin) {
  get txtLeftTime() {
    const info = convertMsSecond2TimeInfo(this.curLeftMsSecond, {
      maxUnit: TimeUnit.day,
    });
    if (info.day >= 1) {
      return `${this.$t('Base.xD', [info.day])}${this.$t('Base.xH', [
        info.hour,
      ])}`;
    } else if (info.hour >= 1) {
      return `${this.$t('Base.xH', [info.hour])}:${this.$t('Base.xM', [
        info.minute,
      ])}`;
    } else if (info.minute >= 1) {
      return `${this.$t('Base.xM', [info.minute])}${this.$t('Base.xS', [
        info.second,
      ])}`;
    } else {
      return this.$t('Base.xS', [info.second]);
    }
  }
}
</script>
