<template>
  <div class="overflow-hidden relative">
    <div class="relative" :style="innerStyle">
      <div
        v-for="(item, idx) in itemList"
        :key="idx"
        class="absolute w-full"
        :style="getIndexStyle(item.index)"
      >
        <slot :item="item">
          <div v-html="item.html"></div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

const TzMarqueeProps = Vue.extend({
  props: {
    /**
     *
     */
    animateTime: {
      default: 500,
      type: Number,
    },
    direction: {
      default: 'up',
      type: String as PropType<'up' | 'down'>,
    },

    /**
     * 1     ，  > animateTime
     */
    interval: {
      default: 60000,
      type: Number,
    },

    /**
     *     ，        html
     */
    list: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
});

@Component({})
export default class TzMarquee2 extends TzMarqueeProps {
  get directionSign() {
    return this.direction === 'up' ? 1 : -1;
  }

  get innerStyle() {
    const transition = this.hasAnimation
      ? `top ${this.animateTime / 1000}s ease 0s`
      : '0s';

    return {
      top: `-${(this.currentIndex + 1) * 100}%`,
      height: `${(this.list.length + 1) * 100}%`,
      transition,
    };
  }

  getIndexStyle(idx: number) {
    const heightPercent = 100 / (this.list.length + 1);
    return {
      // position: 'absolute',
      height: `${heightPercent}%`,
      top: `${heightPercent * (idx + 1)}%`,
    };
  }
  hasAnimation = true;

  /**
   *    item,
   */
  lastItem: { html: string; index: number } = null;

  currentItem: { html: string; index: number } = null;

  get currentIndex() {
    if (!this.currentItem) {
      return 0;
    }
    return this.currentItem.index;
  }

  get itemList() {
    if (!this.currentItem) {
      return [];
    }
    const list = [this.currentItem];
    if (this.lastItem) {
      const lastItem = this.lastItem;
      if (this.directionSign > 0) {
        list.push(lastItem);
      } else {
        list.splice(0, 0, lastItem);
      }
    }
    return list;
  }

  /**
   *     list Timer
   */
  private changeInterval: number = null;

  @Watch('list', {
    immediate: true,
  })
  onListChanged() {
    this.hasAnimation = false;
    this.lastItem = null;
    this.currentItem = {
      html: this.list[0],
      index: 0,
    };
    if (this.changeInterval) {
      clearInterval(this.changeInterval);
    }
    if (this.changeTimer) {
      clearTimeout(this.changeTimer);
    }
    if (this.list.length > 1) {
      this.changeInterval = setInterval(() => {
        const nextIndex = (this.currentIndex + 1) % this.list.length;
        this.lastItem = this.currentItem;
        this.changeToNext(nextIndex);
      }, this.interval);
    }
  }

  private changeTimer: number = null;
  changeToNext(nextIndex: number) {
    const nextItem = this.list[nextIndex];
    this.hasAnimation = true;
    if (this.changeTimer) {
      clearTimeout(this.changeTimer);
    }
    if (this.lastItem) {
      const currentItemIndex = this.lastItem.index + this.directionSign * 1;
      const currentItem = {
        html: nextItem || '',
        index: currentItemIndex,
      };
      this.currentItem = currentItem;
      if (currentItemIndex !== nextIndex) {
        this.changeTimer = setTimeout(() => {
          this.changeTimer = null;

          //
          if (this.currentItem === currentItem) {
            this.hasAnimation = false;
            this.$set(this.currentItem, 'index', nextIndex);
          }
        }, this.animateTime);
      }
    } else {
      this.currentItem = {
        html: nextItem || '',
        index: nextIndex,
      };
    }
  }
}
</script>
