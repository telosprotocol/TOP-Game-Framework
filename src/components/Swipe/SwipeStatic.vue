<template>
  <div class="swipe">
    <div class="swipe__track" :style="trackStyle">
      <div
        class="swipe-item"
        v-for="(item, idx) in list"
        :key="idx"
        ref="swipeItem"
      ></div>
    </div>
    <div ref="tempWrapper" style="display: none">
      <template v-for="(item, idx) in list">
        <slot name="default" :idx="idx" :data="item"></slot>
      </template>
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
  },
  model: {
    prop: 'value',
    event: 'change',
  },
});
//     swipe  slot     ，     key
@Component<SwipeStatic>({})
export default class SwipeStatic extends Mixins(
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

  updated() {
    // list      dom,
    const childNodes = mapDomChildren(
      (this.$refs.tempWrapper as HTMLDivElement).children,
      (item) => item
    );
    console.log(
      'Test-updated',
      (this as any)._uid,
      childNodes.length,
      '------------------'
    );
    const swipeItemWrapNodes = this.$refs.swipeItem as HTMLDivElement[];
    mapDomChildren(swipeItemWrapNodes, (swipeItem) => {
      mapDomChildren(swipeItem.children, (childItem) => {
        childNodes.push(childItem);
      });
    });
    function mapDomChildren<T extends Element, R>(
      children: HTMLCollection | T[],
      mapFunc: (dom: T) => R
    ) {
      const list: R[] = [];
      if (!children) {
        return list;
      }
      for (let i = 0; i < children.length; i++) {
        const childItem = children[i];
        list.push(mapFunc(childItem as T));
      }
      return list;
    }
    // debugger
    for (let i = 0; i < childNodes.length; i++) {
      const childItem = childNodes[i];
      let swipeIdx = (childItem as any).__vue__?.$attrs?.['swipe-idx'];
      if (swipeIdx == null) {
        swipeIdx = i;
      }
      if (swipeItemWrapNodes[swipeIdx]) {
        swipeItemWrapNodes[swipeIdx].append(childItem);
      }
      console.log(
        'Test-forEach',
        i,
        (this as any)._uid,
        swipeIdx,
        'subCategory',
        (childItem as any).__vue__?.subCategory,
        !!swipeItemWrapNodes[swipeIdx]
      );
    }
    console.log('Test-updated', (this as any)._uid, '------------------end');
  }
  getPortalName(idx: number) {
    return 'swipe_' + (this as any)._uid + '_' + idx;
  }
  get trackStyle() {
    const listLength = this.list.length;
    const value = this.value;
    return {
      width: `${listLength * 100}vw`,
      transform: `translate3d(-${value * 100}vw,0,0)`,
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
    flex-shrink: 0;
     width: 360px;
    width: 360px;
  }
  &__indicator {
    display: flex;
    justify-content: center;
    margin-top: 8px;
    &-item {
      width: 7px;
      height: 7px;
      margin-right: 6px;
      background: #e4e6ea;
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
