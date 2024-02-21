<template>
  <div class="relative shrink-0" :style="swipeItemStyle">
    <slot name="default"></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import type SwipeLoop from './SwipeLoop.vue';
import { ChildrenMixin } from 'vant/es/mixins/relation';
@Component({
  mixins: [ChildrenMixin('loopSwipe')],
  components: {},
})
export default class SwipeLoopItem extends Vue {
  //#region data
  offset = 0;

  //#endregion

  /**
   * Provided
   */
  parent: SwipeLoop;
  get swipeItemStyle() {
    const parent = this.parent;
    const style: Partial<CSSStyleDeclaration> = {};
    if (!parent) {
      return style;
    }
    const { size, vertical } = parent;
    if (size) {
      style[vertical ? 'height' : 'width'] = `${size}px`;
    }
    const offset = this.offset;
    if (offset) {
      style.transform = `translate${vertical ? 'Y' : 'X'}(${offset}px)`;
    }
    return style;
  }
  // updated() {
  //   console.log('swipeLoopItem updated', this.offset, (this as any).key);
  // }
}
</script>
