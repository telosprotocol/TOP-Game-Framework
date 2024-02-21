<template>
  <div
    class="relative overflow-hidden cursor-grab select-none"
    style="transform: translateZ(0)"
  >
    <div
      ref="track"
      class="flex h-full"
      :style="trackStyle"
      :class="vertical ? 'flex-col' : ''"
    >
      <slot name="default"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import type SwipeLoopItem from './SwipeLoopItem.vue';
import { preventDefault } from '@/utils/dom/event';
import { ParentMixin } from 'vant/es/mixins/relation';
import { TouchMixin } from 'vant/es/mixins/touch';
import { BindEventMixin } from 'vant/es/mixins/bind-event';
import { isHidden } from 'vant/es/utils/dom/style';
import { range } from 'vant/es/utils/format/number';

/**
 *   vant swipe       loop  item
 *   ：  touch  offset
 *          ,      repeat  swipeItem:
 * 1.     >
 */
@Component<SwipeLoop>({
  mixins: [
    TouchMixin,
    ParentMixin('loopSwipe'),
    BindEventMixin(function (
      this: SwipeLoop,
      onOrOff: (
        el: EventTarget,
        eventName: string,
        eventHandler: EventListenerOrEventListenerObject,
        passive: boolean
      ) => void,
      isBind: boolean
    ) {
      onOrOff(window, 'resize', this.resize, true);
      onOrOff(window, 'orientationchange', this.resize, true);
      if (isBind) {
        this.initialize();
      } else {
        this.clear();
      }
    }),
  ],
  components: {},
})
export default class SwipeLoop extends Vue {
  //#region Props

  @Prop({
    type: Boolean,
    default: false,
  })
  vertical: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  loop: boolean;

  /**
   *        loopSize SwipeItem
   */
  @Prop({
    type: Number,
    default: 1,
  })
  loopSize: number;

  /**
   *      swipeItem
   */
  @Prop({
    type: Number,
  })
  width: number;

  /**
   *      swipeItem
   */
  @Prop({
    type: Number,
  })
  height: number;
  /**
   *   duration
   */
  @Prop({
    type: Number,
    default: 500,
  })
  duration: number;

  @Prop({
    type: Number,
    default: 0,
  })
  initialSwipe: number;
  @Prop({
    type: Boolean,
    default: true,
  })
  touchable: boolean;
  // @Prop({
  //   type: Number,
  // })
  // autoplay: number;

  @Prop({
    type: Boolean,
    default: true,
  })
  stopPropagation: boolean;
  //#endregion

  //#region  declaration
  $refs: {
    track: HTMLDivElement;
  };
  $el: HTMLElement;
  /**
   *      size deltaRatio  ，
   */
  @Prop({
    type: Number,
    default: 0.5,
  })
  deltaRatio: number;
  /**
   * minxin:Provided  （relation Mixins）
   */
  children: SwipeLoopItem[];

  //#region Touch Mixins
  bindTouchEvent: (el: HTMLElement) => void;
  direction: 'horizontal' | 'vertical';
  touchStart: (event: any) => void;
  touchMove: (event: any) => void;
  offsetY: number;
  offsetX: number;
  // #endregion
  //#endregion

  mounted() {
    this.bindTouchEvent(this.$refs.track);
  }

  //#region data
  /**
   *
   */
  rect: { width: number; height: number } | null = null;

  /**
   *
   */
  swiping = false;

  /**
   *    item active
   */
  active = 0;

  /**
   * touch move deltaX( TouchMixin  )
   */
  deltaX = 0;
  /**
   * touch move deltaX( TouchMixin  )
   */
  deltaY = 0;

  /**
   * swipeItem   （ Prop.width/rect.width  ）
   */
  computedWidth = 0;
  computedHeight = 0;

  /**
   *   track offset
   */
  offset = 0;

  //#endregion

  //#region computed

  /**
   * SwipeItem   （ vertical）
   *   Prop   width/height,       SwipeLoop
   */
  get size() {
    return this[this.vertical ? 'computedHeight' : 'computedWidth'];
  }
  get count() {
    return this.children.length;
  }

  /**
   *        ，offset  [0,minOffset]
   */
  get minOffset() {
    const rect = this.rect;
    const wrapSize = this.vertical ? rect.height : rect.width;
    return wrapSize - this.size * this.count;
  }

  get maxCount() {
    return Math.ceil(Math.abs(this.minOffset) / this.size);
  }

  /**
   * Track    （ size count  ）
   */
  get trackSize() {
    return this.count * this.size;
  }
  get trackStyle() {
    const vertical = this.vertical;
    const style: Partial<CSSStyleDeclaration> = {
      transitionDuration: `${this.swiping ? 0 : this.duration}ms`,
      transform: `translate${vertical ? 'Y' : 'X'}(${this.offset}px)`,
    };

    if (this.size) {
      const mainAxis = vertical ? 'height' : 'width';
      const crossAxis = vertical ? 'width' : 'height';
      style[mainAxis] = `${this.trackSize}px`;
      style[crossAxis] = this[crossAxis] ? `${this[crossAxis]}px` : '';
    }

    return style;
  }

  /**
   * Touch     （ vertical     )
   */
  get delta() {
    return this.vertical ? this.deltaY : this.deltaX;
  }

  //#endregion

  @Watch('children')
  onChildrenChanged() {
    this.initialize();
  }
  @Watch('initialSwipe')
  onInitialSwipeChanged() {
    this.initialize();
  }

  initialize(active = this.initialSwipe) {
    if (!this.$el || isHidden(this.$el)) {
      return;
    }
    // clearTimeout(this.timer);

    const rect = {
      width: this.$el.offsetWidth,
      height: this.$el.offsetHeight,
    };
    this.rect = rect;
    this.swiping = true; // for
    this.active = active;
    this.computedWidth = +this.width || rect.width;
    this.computedHeight = +this.height || rect.height;
    this.offset = this.getTargetOffset(active);
    this.children.forEach((swipe) => {
      swipe.offset = 0;
    });
    this.move({
      pace: 0,
    });
    // this.autoPlay();
  }

  // //
  // timer: number;
  // autoPlay() {
  //   const { autoplay } = this;
  //   if (autoplay > 0 && this.count > 1) {
  //     this.clear();
  //     this.timer = setTimeout(() => {
  //       this.next();
  //       this.autoPlay();
  //     }, autoplay);
  //   }
  // }
  clear() {
    // clearTimeout(this.timer);
  }

  get activeIndicator() {
    const count = this.count;
    return (this.active + count) % count;
  }
  resize() {
    this.initialize(this.activeIndicator);
  }

  //#region Move

  /**
   *   pace  active swipeItem
   * @param pace active(+/-)step
   */
  getTargetActive(pace: number) {
    const { active, count, maxCount } = this;
    if (pace) {
      if (this.loop) {
        return range(active + pace, -1, count) as number;
      }
      return range(active + pace, 0, maxCount) as number;
    }
    return active;
  }

  /**
   *   targetActive   offset--->track offset
   * @param targetActive
   * @param offset
   */
  getTargetOffset(targetActive: number, offset = 0) {
    let currentPosition = targetActive * this.size;
    if (!this.loop) {
      currentPosition = Math.min(currentPosition, -this.minOffset);
    }
    let targetOffset = offset - currentPosition;
    if (!this.loop) {
      targetOffset = range(targetOffset, this.minOffset, 0);
    }
    return targetOffset;
  }

  /**
   * touch   swipe
   */
  get isCorrectDirection() {
    const expect = this.vertical ? 'vertical' : 'horizontal';
    return this.direction === expect;
  }
  correctPosition() {
    this.swiping = true;
    const { active, count } = this;

    this.move({
      toActive: ((active % count) + count) % count,
    });
    // if (active <= -1) {
    //   //
    //   this.move({ pace: count + active });
    // } else if (active >= count) {
    //   // active % count;
    //   this.move({ pace: -count + (active - count) }); //
    // }
  }

  move(options: {
    /**
     * 'pace'|'toActive'        step
     */
    pace?: number;

    toActive?: number;
    /**
     *       offset(touch    )
     */
    offset?: number;
    emitChange?: boolean;
  }) {
    const { pace = 0, offset = 0, toActive, emitChange } = options;
    const { loop, count, active, children, trackSize, minOffset } = this;

    if (count <= 1) {
      return;
    }
    const targetActive =
      toActive == null ? this.getTargetActive(pace) : toActive;
    const targetOffset = this.getTargetOffset(targetActive, offset);

    // auto move first and last swipe in loop mode
    if (loop) {
      const loopSize = this.loopSize;
      children.forEach((item) => {
        item.offset = 0;
      });

      const outRightBound = targetOffset < minOffset;
      if (outRightBound) {
        for (let li = 0; li < loopSize; li++) {
          const cidx = li;
          if (cidx === targetActive) {
            //size=5 ,loopSize=3,targetActive bug
            continue;
          }
          let child = children[cidx];
          if (!child) {
            break;
          }
          child.offset = trackSize;
        }
      }
      const outLeftBound = targetOffset > 0;

      if (outLeftBound) {
        for (let li = 0; li < loopSize; li++) {
          const cidx = count - 1 - li;
          let child = children[cidx];
          if (!child) {
            break;
          }
          child.offset = -trackSize;
        }
      }
    }

    this.active = targetActive;
    this.offset = targetOffset;

    if (emitChange && targetActive !== active) {
      this.$emit('change', this.activeIndicator);
    }
  }
  //#endregion

  //#region Touch
  touchStartTime: number;

  onTouchStart(event: TouchEvent) {
    if (!this.touchable) return;
    this.clear();
    this.touchStartTime = Date.now();
    this.touchStart(event);
    this.correctPosition();
  }

  onTouchMove(event: TouchEvent) {
    if (!this.touchable || !this.swiping) return;

    this.touchMove(event);

    if (this.isCorrectDirection) {
      preventDefault(event, this.stopPropagation);
      this.move({ offset: this.delta });
    }
  }

  onTouchEnd() {
    if (!this.touchable || !this.swiping) return;

    const { size, delta } = this;
    const duration = Date.now() - this.touchStartTime;
    const speed = delta / duration;
    const shouldSwipe =
      Math.abs(speed) > 0.25 || Math.abs(delta) > size * this.deltaRatio;

    if (shouldSwipe && this.isCorrectDirection) {
      const offset = this.vertical ? this.offsetY : this.offsetX;

      let pace = 0;

      if (this.loop) {
        if (offset > 0) {
          const absPace = Math.round(offset / size);
          pace = delta > 0 ? -absPace : absPace;
        }
      } else {
        pace = -Math[delta > 0 ? 'ceil' : 'floor'](delta / size);
      }

      this.move({
        pace,
        emitChange: true,
      });
    } else if (delta) {
      this.move({ pace: 0 });
    }

    this.swiping = false;
    // this.autoPlay();
  }
  //#endregion
}
</script>
