<template>
  <div
    ref="wrapper"
    @touchstart="onStart"
    @touchmove.prevent="onMove"
    @touchend="onEnd"
    @touchcancel.prevent="onEnd"
    @transitionend="onTransitionEnd"
  >
    <div ref="scroller" class="w-max" :style="scrollerStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class BounceScroll extends Vue {
  $refs: {
    wrapper: HTMLElement;
    scroller: HTMLElement;
  };
  /**
   *    （direction     X，     Y）
   */
  minXOrY = 0;
  /**
   *    （direction     X，     Y）
   */
  maxXOrY = 0;
  /**
   *     （direction       ，       ）
   */
  wrapperSize = 0;
  duration = 0;
  bezier = 'linear';
  /**
   * touchStart    y
   * （direction     X，     Y）
   */
  pointXOrY = 0;
  /**
   * touchStart    y
   * （direction     X，     Y）
   */
  startXOrY = 0;
  /**
   *      y    （direction     X，     Y）
   */
  offsetXOrY = 0;
  /**
   *          startTime
   */
  startTime = 0;
  /**
   *          startY（direction     X，     Y）
   */
  momentumStartXOrY = 0;
  /**
   *
   */
  momentumTimeThreshold = 300;
  /**
   *
   */
  momentumYThreshold = 15;
  /**
   * start
   */
  isStarted = false;

  mounted() {
    this.$nextTick(() => {
      this.resizeInit();
    });
  }

  @Prop({
    type: String,
    default: 'horizontal',
  })
  direction: 'horizontal' | 'vertical';

  get dirXOrY() {
    if (this.direction === 'vertical') {
      return 'Y' as const;
    } else {
      return 'X' as const;
    }
  }
  isDisabled?: boolean;

  resizeInit() {
    const sizeType = this.direction === 'vertical' ? 'height' : 'width';

    const wrapperSize = (this.wrapperSize =
      this.$refs.wrapper.getBoundingClientRect()[sizeType]);
    const scrollSize = this.$refs.scroller.getBoundingClientRect()[sizeType];
    this.minXOrY = wrapperSize - scrollSize;

    const isDisabled = (this.isDisabled = wrapperSize >= scrollSize);
    if (isDisabled) {
      this.startTime = 0;
      this.offsetXOrY = 0;
      this.duration = 0;
    }
    // console.log(
    //   '[DEBUG] resizeInit',
    //   wrapperSize,
    //   scrollSize,
    //   this.minXOrY,
    //   this.direction,
    //   this.dirXOrY
    // );
  }
  onStart(e: TouchEvent) {
    if (this.isDisabled) {
      return;
    }
    const dirXOrY = this.dirXOrY;
    const point = (e.touches ? e.touches[0] : e) as TouchInit;
    this.isStarted = true;
    this.duration = 0;
    this.stop();
    this.pointXOrY = point[('page' + dirXOrY) as 'pageY'];
    this.momentumStartXOrY = this.startXOrY = this.offsetXOrY;
    this.startTime = new Date().getTime();
    // console.log(
    //   '[DEBUG] onStart',
    //   dirXOrY,
    //   this.pointXOrY,
    //   this.momentumStartXOrY
    // );
  }
  onMove(e: TouchEvent) {
    if (this.isDisabled) {
      return;
    }
    if (!this.isStarted) return;
    const dirXOrY = this.dirXOrY;
    const point = (e.touches ? e.touches[0] : e) as TouchInit;
    const deltaXOrY = point[('page' + dirXOrY) as 'pageY'] - this.pointXOrY;
    this.offsetXOrY = Math.round(this.startXOrY + deltaXOrY);
    const now = new Date().getTime();
    //
    if (now - this.startTime > this.momentumTimeThreshold) {
      this.momentumStartXOrY = this.offsetXOrY;
      this.startTime = now;
    }
    // console.log(
    //   '[DEBUG] onMove',
    //   dirXOrY,
    //   this.pointXOrY,
    //   this.momentumStartXOrY
    // );
  }
  onEnd() {
    if (this.isDisabled) {
      return;
    }
    if (!this.isStarted) return;
    this.isStarted = false;
    if (this.isNeedReset()) return;
    const absDeltaY = Math.abs(this.offsetXOrY - this.momentumStartXOrY);
    const duration = new Date().getTime() - this.startTime;
    //
    if (
      duration < this.momentumTimeThreshold &&
      absDeltaY > this.momentumYThreshold
    ) {
      const momentum = this.momentum(
        this.offsetXOrY,
        this.momentumStartXOrY,
        duration
      );
      this.offsetXOrY = Math.round(momentum.destination);
      this.duration = momentum.duration;
      this.bezier = momentum.bezier;
      // console.log(
      //   '[DEBUG] onEnd',

      //   this.offsetXOrY,
      //   this.momentumStartXOrY
      // );
    }
  }
  onTransitionEnd() {
    this.isNeedReset();
  }
  momentum(current: number, start: number, duration: number) {
    const durationMap = {
      noBounce: 2500,
      weekBounce: 800,
      strongBounce: 400,
    } as const;
    const bezierMap = {
      noBounce: 'cubic-bezier(.17, .89, .45, 1)',
      weekBounce: 'cubic-bezier(.25, .46, .45, .94)',
      strongBounce: 'cubic-bezier(.25, .46, .45, .94)',
    };
    let type = 'noBounce' as keyof typeof durationMap;
    //
    const deceleration = 0.003;
    //
    const bounceRate = 10;
    //
    const bounceThreshold = 300;
    //
    const maxOverflowY = this.wrapperSize / 6;
    let overflowXOrY: number;

    const distance = current - start;
    const speed = (2 * Math.abs(distance)) / duration;
    let destination =
      current + (speed / deceleration) * (distance < 0 ? -1 : 1);
    if (destination < this.minXOrY) {
      overflowXOrY = this.minXOrY - destination;
      type = overflowXOrY > bounceThreshold ? 'strongBounce' : 'weekBounce';
      destination = Math.max(
        this.minXOrY - maxOverflowY,
        this.minXOrY - overflowXOrY / bounceRate
      );
    } else if (destination > this.maxXOrY) {
      overflowXOrY = destination - this.maxXOrY;
      type = overflowXOrY > bounceThreshold ? 'strongBounce' : 'weekBounce';
      destination = Math.min(
        this.maxXOrY + maxOverflowY,
        this.maxXOrY + overflowXOrY / bounceRate
      );
    }

    return {
      destination,
      duration: durationMap[type],
      bezier: bezierMap[type],
    };
  }
  //
  isNeedReset() {
    let offsetXOrY: number;
    if (this.offsetXOrY < this.minXOrY) {
      offsetXOrY = this.minXOrY;
    } else if (this.offsetXOrY > this.maxXOrY) {
      offsetXOrY = this.maxXOrY;
    }
    if (typeof offsetXOrY !== 'undefined') {
      this.offsetXOrY = offsetXOrY;
      this.duration = 500;
      this.bezier = 'cubic-bezier(.165, .84, .44, 1)';
      return true;
    }
    return false;
  }
  get scrollerStyle() {
    if (this.isDisabled) {
      return { transform: 'translate3d(0, 0, 0)' };
    }
    const direction = this.direction;
    const transform =
      direction === 'vertical'
        ? `translate3d(0, ${this.offsetXOrY}px, 0)`
        : `translate3d(${this.offsetXOrY}px, 0, 0)`;
    // console.log('[DEBUG] style', this.offsetXOrY);
    return {
      transform,
      'transition-duration': `${this.duration}ms`,
      'transition-timing-function': this.bezier,
    };
  }
  //
  stop() {
    const matrix = window
      .getComputedStyle(this.$refs.scroller)
      .getPropertyValue('transform');
    const dir = this.direction;
    this.offsetXOrY = Math.round(
      +matrix.split(')')[0].split(', ')[dir === 'vertical' ? 5 : 4]
    );
    // console.log('[DEBUG] stop', this.offsetXOrY, this.isDisabled, matrix);
  }

  @Watch('offsetXOrY')
  onOffsetChange() {
    this.$emit('offsetChange', this.offsetXOrY);
  }
}
</script>
