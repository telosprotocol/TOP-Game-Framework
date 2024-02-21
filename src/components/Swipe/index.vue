<template>
  <div class="swipe">
    <div class="swipe__track" :style="trackStyle">
      <div
        class="swipe-item"
        :style="{ width: swipeItemSize + 'px' }"
        v-for="(item, idx) in list"
        :key="idx"
      >
        <slot name="default" :idx="idx" :data="item"></slot>
      </div>
    </div>
    <div class="swipe__indicator" v-if="hasMulti">
      <div
        v-for="(item, idx) in list"
        :key="idx"
        class="swipe__indicator-item"
        :class="{ active: idx === value }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { Component, Vue, Mixins } from 'vue-property-decorator';
import { TouchMixin } from '@/mixins/touch';

const MIN_SWIPE_DISTANCE = 30;
const SwipeProps = Vue.extend({
  props: {
    value: {
      type: Number,
      default: 0,
    },
    // swipe item
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    swipeItemSize: {
      type: Number,
      default() {
        return 360;
      },
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
});
@Component<Swipe>({})
export default class Swipe extends Mixins(
  TouchMixin,
  SwipeProps,
  BindEventMixinDefault
) {
  get hasMulti() {
    return this.list.length > 1;
  }
  useInited() {
    return this.bindTouchEvent(this.$el as HTMLElement);
  }
  get trackStyle() {
    const listLength = this.list.length;
    const value = this.value;
    return {
      width: `${listLength * this.swipeItemSize}px`,
      transform: `translate3d(-${value * this.swipeItemSize}px,0,0)`,
    };
  }

  onTouchStart(event) {
    this.touchStart(event);
  }

  onTouchMove(event) {
    this.touchMove(event);
  }

  // watch swipe touch end
  onTouchEnd() {
    const { direction, deltaX, value } = this;
    if (direction === 'horizontal' && this.offsetX >= MIN_SWIPE_DISTANCE) {
      const toSign = deltaX > 0 ? -1 : 1;
      const toValue = value + toSign;
      if (toValue >= 0 && toValue < this.list.length) {
        this.$emit('change', toValue);
      }
      // if (deltaX > 0) {
      //   if (value !== 0) {
      //     this.$emit('change', value - 1)
      //   }
      //   // else {
      //   //   this.$emit('change', 0)
      //   // }
      // } else if (deltaX < 0) {
      //   if (value !== this.list.length - 1) {
      //     this.$emit('change', value + 1)
      //   }
      //   //  else {
      //   //   this.$emit('change', 0)
      //   // }
      // }
    }
  }
}
</script>

<style scoped lang="less">
.swipe {
  overflow: hidden;
  cursor: grap;
  user-select: none;
  &__track {
    display: -webkit-flex;
    display: flex;
    transition-duration: 500ms;
    will-change: transform;
  }
  &-item {
    // width: 100vw;
    // width: 360px;
    flex-shrink: 0;
  }
  &__indicator {
    display: flex;
    justify-content: center;
    margin-top: 8px;
    &-item {
      width: 7px;
      height: 7px;
      background: #e4e6ea;
      margin-right: 6px;
      border-radius: 10px;
      &:last-child {
        margin-right: 0;
      }
      &.active {
        background: #ffd039;
      }
    }
  }
}
</style>
