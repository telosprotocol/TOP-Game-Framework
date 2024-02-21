<template>
  <div
    class="fixed right-6 bottom-1/2 z-50 transition-all duration-100"
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
import { Mixins } from 'vue-property-decorator';
let initialX = 0;
let maxY = 10000;
@Component({
  components: {},
})
export default class DragableBtn extends Mixins(
  TouchMixin,
  BindEventMixinDefault
) {
  $refs: { entry?: HTMLDivElement };

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
      return {};
    }
    const y = this.y;
    const top = Math.min(Math.max(y + this.dy, 10), maxY);
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

  onTouchEnd(event: TouchEvent) {
    const touch = event.touches[0];
    let toX = this.x;
    if (touch) {
      toX = touch.clientX;
      const offsetPos = this.offsetPos || { x: 0, y: 0 };
      this.y = touch.clientY - offsetPos.y;
    }
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
      initialX = boundClient.x;
      this.offsetPos = {
        x: event.targetTouches[0].clientX - boundClient.left,
        y: event.targetTouches[0].clientY - boundClient.top,
      };
      maxY = entry.getBoundingClientRect().y;
      this.x = initialX;
      this.y = maxY;
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
