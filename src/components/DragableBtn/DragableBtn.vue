<template>
  <div
    class="fixed transition-all duration-100"
    ref="entry"
    v-if="value"
    :style="wrapStyle"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { TouchMixin } from '@/mixins/touch';
import Component from 'vue-class-component';
import { Mixins, Prop } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class DragableBtn extends Mixins(
  TouchMixin,
  BindEventMixinDefault
) {
  $refs: { entry?: HTMLDivElement };

  /**
   * Y
   */
  @Prop({
    type: Number,
    default: 10000,
  })
  maxY: number;

  @Prop({
    type: Object,
    required: false,
  })
  initialPosStyle?: CSSStyleDeclaration;
  value = true;
  useInited() {
    let timer: ReturnType<typeof setTimeout> = null;
    // console.log('BonusCenterEntry', this.item.closeWait)
    let offFuncs: (() => void)[] = [];

    this.$nextTick(() => {
      const entry = this.$refs.entry;
      if (entry) {
        offFuncs.push(this.bindTouchEvent(entry));
      }
    });
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      offFuncs.forEach((func) => {
        func();
      });
      offFuncs = null;
    };
  }

  x: number = null;
  y: number = null;

  dx = 0;
  dy = 0;
  get wrapStyle() {
    const x = this.x;
    if (x == null) {
      return this.initialPosStyle || {};
    }
    const y = this.y;
    const top = Math.min(Math.max(y + this.dy, 10), this.maxY); //10-maxY
    const left = x + this.dx;
    return {
      left: left + 'px',
      top: top + 'px',
      bottom: 'auto',
      right: 'auto',
      transform: `translateX(${this.translateX}px)`,
    };
  }

  translateX = 0;

  /**
   *      x
   */
  initialX: number;
  onTouchEnd(event: TouchEvent) {
    const touch = event.touches[0];
    let toX = this.x;

    if (touch) {
      toX = touch.clientX;
      const offsetPos = this.offsetPos || { x: 0, y: 0 };
      this.y = touch.clientY - offsetPos.y;
    }
    const initialX = this.initialX;
    this.x = initialX;
    this.translateX = toX - initialX;
    this.$nextTick(() => {
      this.translateX = 0;
    });
    event.stopPropagation();
    // //
    // this.hasAnim = true
    // this.$nextTick(() => {
    //   this.x = initialX
    // })
  }
  /**
   *
   */
  offsetPos: { x: number; y: number };
  onTouchStart(event: TouchEvent) {
    if (this.x == null) {
      const entry = this.$refs.entry;
      const boundClient = entry.getBoundingClientRect();
      this.initialX = boundClient.x;
      this.offsetPos = {
        x: event.targetTouches[0].clientX - boundClient.left,
        y: event.targetTouches[0].clientY - boundClient.top,
      };
      this.x = this.initialX;
      this.y = boundClient.top;
    }
    event.stopPropagation();
  }
  onTouchMove(event: TouchEvent) {
    const touch = event.touches[0];
    const offsetPos = this.offsetPos || { x: 0, y: 0 };
    this.x = touch.clientX - offsetPos.x;
    this.y = touch.clientY - offsetPos.y;
    event.stopPropagation();
    event.preventDefault();
  }
}
</script>
