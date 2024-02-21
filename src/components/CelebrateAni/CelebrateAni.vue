<template>
  <div>
    <canvas
      class="w-full h-full"
      :width="width"
      :height="height"
      ref="canvas"
    ></canvas>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Prop, Mixins, Watch } from 'vue-property-decorator';
import { startDraw } from './celebrateAni';
import BaseDlgMixin from '../Modal/BaseDlgMixin';

@Component({
  components: {},
})
export default class CelebrateAni extends Mixins(BaseDlgMixin) {
  $refs!: { canvas: HTMLCanvasElement };
  @Prop({
    type: Number,
    default: 360,
  })
  width: number;
  @Prop({
    type: Number,
    default: 280,
  })
  height: number;

  @Watch('value', { immediate: true })
  onValueChanged(value: boolean) {
    if (value) {
      this.$nextTick(this.startAnim);
    }
  }
  startAnim() {
    const canvas = this.$refs.canvas;
    const context = canvas.getContext('2d');
    startDraw(context, () => {
      // console.log('[Celebrate] End');
      this.$emit('input', false);
    });
  }
}
</script>
