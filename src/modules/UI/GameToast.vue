<template>
  <GameDlgSimpleUI :value="value" @input="emitDlgVisible">
    <slot>{{ message || '' }}</slot>
  </GameDlgSimpleUI>
</template>
<script lang="ts">
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import GameDlgSimpleUI from './GameDlgSimpleUI.vue';
@Component({
  components: { GameDlgSimpleUI },
})
export default class GameToast extends mixins(BaseDlgMixin) {
  _lastHideTimer: ReturnType<typeof setTimeout>;
  @Watch('value', { immediate: true })
  onValueChange(isShow: boolean) {
    if (this._lastHideTimer) {
      clearTimeout(this._lastHideTimer);
    }
    if (isShow) {
      const duration = this.duration;
      if (duration) {
        this._lastHideTimer = setTimeout(() => {
          this.emitDlgVisible(false);
        }, duration);
      }
    }
  }

  /**
   *  0
   */
  @Prop({
    type: Number,
    default: 2000,
  })
  duration: number;
  @Prop({
    type: String,
  })
  message: string;
}
</script>
