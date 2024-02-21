<template>
  <div>{{ leftSecondText }}</div>
</template>

<script lang="ts">
import { paddingLeft } from '@/utils/string';
import Component from 'vue-class-component';
import { Prop, Watch, Mixins } from 'vue-property-decorator';
import { MS_SECOND } from '@/constants/time';
import { convertMsSecond2TimeInfo, TimeUnit } from '@/utils/datetime';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
@Component({
  components: {},
})
export default class VCountDown extends Mixins(BindEventMixinDefault) {
  @Prop({
    type: Number,
    required: true,
  })
  expirationClientTime: number;

  useInited() {
    return () => {
      this.stopUpdate();
    };
  }
  lastInterval: ReturnType<typeof setInterval>;
  @Watch('expirationClientTime', { immediate: true })
  onLeftMsSecondChange(expirationClientTime: number) {
    if (isNaN(expirationClientTime) || !expirationClientTime) {
      return;
    }
    this.stopUpdate();
    this.refreshTime();
    this.lastInterval = setInterval(() => {
      this.refreshTime();
    }, MS_SECOND);
  }

  stopUpdate() {
    if (this.lastInterval) {
      clearInterval(this.lastInterval);
      this.lastInterval = null;
    }
  }
  get leftSecondText() {
    const curLeftSecond = this.curLeftSecond;
    const info = convertMsSecond2TimeInfo(curLeftSecond, {
      maxUnit: TimeUnit.hour,
    });
    return [info.hour, info.minute, info.second]
      .map((item) => {
        return paddingLeft(item + '', 2, '0');
      })
      .join(':');
  }

  curLeftSecond = 0;
  private refreshTime() {
    const dtNow = new Date().getTime();
    const leftMsSecond = this.expirationClientTime - dtNow;
    if (leftMsSecond <= 0) {
      this.curLeftSecond = 0;
      this.stopUpdate();
      this.$emit('end');
      return;
    }
    this.curLeftSecond = leftMsSecond;
  }
}
</script>
