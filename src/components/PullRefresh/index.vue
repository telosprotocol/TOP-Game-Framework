<template>
  <div class="overflow-hidden select-none">
    <div
      ref="track"
      class="relative h-full transition-transform"
      :style="trackStyle"
      :trackClass="trackClass"
    >
      <div
        class="absolute left-0 w-full top-0"
        :style="headTopExtraStyle"
      ></div>
      <div
        class="absolute left-0 w-full h-12 overflow-hidden -translate-y-full text-center flex items-center justify-center"
        :style="headStyle2"
        :class="headClass"
      >
        <slot name="success" v-bind="{ distance }" v-if="status == 'success'">
          <div class="pullrefresh--text" v-if="successText">
            {{ successText }}
          </div>
        </slot>
        <slot v-bind="{ distance }" name="pulling" v-if="status == 'pulling'"
          >{{ pullingText || $t('Base.PullToRefresh') }}
        </slot>
        <slot v-bind="{ distance }" name="loosing" v-if="status == 'loosing'"
          >{{ loosingText || $t('Base.ReleaseToRefresh') }}
        </slot>
        <slot v-bind="{ distance }" name="loading" v-if="status == 'loading'">
          <ib class="iconfont icon-loading"></ib
          ><span class="ml-2">{{ loadingText || $t('Base.Loading') }}</span>
        </slot>
        <slot name="normal" v-if="status == 'normal'"></slot>
      </div>
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { TouchMixin } from '@/mixins/touch';
import { getScroller, getScrollTop } from '@/utils/dom/scroll';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Mixins, Watch } from 'vue-property-decorator';
const DEFAULT_HEAD_HEIGHT = 50;
const PullRefreshProps = Vue.extend({
  props: {
    /**
     *
     */
    disabled: {
      type: Boolean,
      default: null,
    },
    //
    successText: {
      type: String,
      default: null,
    },
    //
    pullingText: {
      type: String,
      default: null,
    },
    //      headStyle
    headBg: {
      type: String,
      default: null,
    },
    //   head   style,        ，   headBg
    headStyle: {
      type: Object,
      default: null,
    },

    //
    loosingText: {
      type: String,
      default: null,
    },
    //
    loadingText: {
      type: String,
      default: null,
    },
    headHeight: {
      type: [Number, String],
      default: DEFAULT_HEAD_HEIGHT,
    },
    //    headHeight
    pullDistance: {
      type: [Number, String],
      default: null,
    },
    successDuration: {
      type: [Number, String],
      default: 500,
    },
    animationDuration: {
      type: [Number, String],
      default: 300,
    },
    /**
     * isLoading
     */
    value: {
      type: Boolean,
      required: true,
    },

    headClass: {
      type: String,
      default: null,
    },
    trackClass: {
      type: String,
      default: null,
    },
  },
});
// ['pulling', 'loosing', 'success']
@Component({
  components: {},
})
export default class PullRefresh extends Mixins(TouchMixin, PullRefreshProps) {
  /**
   * normal:
   * loading:    ,  value=true
   * success: value=true  false ，   successText   （  successDuration    normal）
   * loosing： loading success   ，        pullDistance  loading  ,       refresh
   * pulling：  loading success   ，      <pullDistance  loading
   */
  status = 'normal' as 'normal' | 'loading' | 'success' | 'loosing' | 'pulling';

  /**
   *
   */
  duration = 0;

  /**
   *
   */
  distance = 0;
  get touchable() {
    return (
      this.status !== 'loading' && this.status !== 'success' && !this.disabled
    );
  }
  @Watch('distance', { immediate: true })
  onDistanceChanged() {
    this.$emit('distanceChanged', this.distance);
  }

  get headStyle2() {
    const bg = this.headBg;
    const style = this.headStyle;
    const headHeight = this.headHeight;
    const curStyle = {
      ...(style || {}),
      background: bg || undefined,
    };
    if (headHeight !== DEFAULT_HEAD_HEIGHT) {
      return {
        ...curStyle,
        height: `${headHeight}px`,
      };
    }
    return curStyle;
  }

  /**
   *     （head       ）
   */
  get headTopExtraStyle() {
    const bg = this.headBg;
    const distance = this.distance;
    const duration = this.duration;
    return {
      transitionDuration: `${duration}ms`,
      transform: distance ? `translate3d(0,-${distance}px, 0)` : '',
      height: distance + 'px',
      background: bg || undefined,
    };
  }

  get trackStyle() {
    const distance = this.distance;
    const duration = this.duration;
    return {
      transitionDuration: `${duration}ms`,
      transform: distance ? `translate3d(0,${distance}px, 0)` : '',
    };
  }

  scrollEl: HTMLElement | Window;

  $refs: {
    track: HTMLDivElement;
  };
  mounted() {
    this.bindTouchEvent(this.$refs.track);
    this.scrollEl = getScroller(this.$el as HTMLElement);
  }
  @Watch('value')
  onValueChange(loading: boolean) {
    this.duration = Number(this.animationDuration);

    if (loading) {
      this.setStatus(+this.headHeight, true);
    } else if (this.$slots.success || this.successText) {
      this.showSuccessTip();
    } else {
      this.setStatus(0, false);
    }
  }
  showSuccessTip() {
    this.status = 'success';
    setTimeout(() => {
      //    normal
      this.setStatus(0);
    }, Number(this.successDuration));
  }

  /**
   *
   * true:
   */
  ceiling: boolean;
  checkPullStart(event: TouchEvent) {
    this.ceiling = getScrollTop(this.scrollEl) === 0;

    if (this.ceiling) {
      this.duration = 0;
      this.touchStart(event);
    }
  }

  onTouchStart(event: TouchEvent) {
    if (this.touchable) {
      this.checkPullStart(event);
    }
  }

  onTouchMove(event: TouchEvent) {
    if (!this.touchable) {
      return;
    }

    if (!this.ceiling) {
      // move      pull Refresh
      this.checkPullStart(event);
    }

    this.touchMove(event);

    if (this.ceiling && this.deltaY >= 0 && this.direction === 'vertical') {
      //
      if (typeof event.cancelable !== 'boolean' || event.cancelable) {
        event.preventDefault();
      }
      this.setStatus(this.ease(this.deltaY));
    }
  }

  ease(distance: number) {
    const pullDistance = +(this.pullDistance || this.headHeight);
    if (distance > pullDistance) {
      if (distance < pullDistance * 2) {
        distance = pullDistance + (distance - pullDistance) / 2;
      } else {
        distance = pullDistance * 1.5 + (distance - pullDistance * 2) / 4;
      }
    }
    return Math.round(distance);
  }

  onTouchEnd() {
    if (this.touchable && this.ceiling && this.deltaY) {
      this.duration = Number(this.animationDuration);

      if (this.status === 'loosing') {
        this.setStatus(+this.headHeight, true);
        this.$emit('input', true);

        // ensure value change can be watched
        this.$nextTick(() => {
          this.$emit('refresh');
        });
      } else {
        this.setStatus(0);
      }
    }
  }

  /**
   *   distance isLoading  status distance
   */
  setStatus(distance: number, isLoading?: boolean) {
    let status: typeof PullRefresh.prototype.status;
    if (isLoading) {
      status = 'loading';
    } else if (distance === 0) {
      status = 'normal';
    } else {
      status =
        distance < (this.pullDistance || this.headHeight)
          ? 'pulling'
          : 'loosing';
    }

    this.distance = distance;

    if (status !== this.status) {
      this.status = status;
    }
  }
}
</script>
