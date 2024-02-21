<template>
  <div class="flex items-center justify-center overflow-hidden">
    <canvas
      :style="$ss.getters.normalizeCss({ width: width, height: height })"
      :width="width"
      :height="height"
      ref="canvas"
    ></canvas>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Prop, Mixins, Watch } from 'vue-property-decorator';
import { startDraw } from './celebrateAniBomb';
import BaseDlgMixin from '../Modal/BaseDlgMixin';

@Component({
  components: {},
})
export default class CelebrateBombAni extends Mixins(BaseDlgMixin) {
  declare $refs: { canvas: HTMLCanvasElement };
  @Prop({
    type: Number,
    default: 480,
  })
  width: number;
  @Prop({
    type: Number,
    default: 400,
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
    startDraw(
      context,
      () => {
        // console.log('[Celebrate] End');
        this.$emit('input', false);
      },
      {
        size: {
          width: this.width,
          height: this.height,
        },
      }
    );
  }
}
</script>
