<template>
  <Swipe
    :swipe-item-size="swipeItemSize"
    :value="value"
    @change="onValueChange"
    :list="groupList"
  >
    <template #default="{ idx, data: pageList }">
      <slot name="default" :idx="idx" :data="pageList"></slot>
    </template>
  </Swipe>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { Component, Vue, Watch } from 'vue-property-decorator';
import Swipe from './index.vue';

const SwipeListGroupProps = Vue.extend({
  props: {
    value: {
      type: Number,
      default: 0,
    },
    list: {
      type: Array as PropType<unknown[]>,
      default() {
        return [];
      },
    },
    // 1
    groupSize: {
      type: Number,
      default: 1,
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

@Component({
  components: {
    Swipe,
  },
})
export default class SwipeListGroup<T> extends SwipeListGroupProps {
  onValueChange(v: boolean) {
    this.$emit('change', v);
  }
  get groupList() {
    const groupList: T[][] = [];
    const groupSize = this.groupSize;
    const list = this.list as T[];
    if (groupSize === 0) {
      return groupList;
    }
    const groupCount = Math.ceil(list.length / groupSize);

    for (let g = 0; g < groupCount; g++) {
      const curGroupItem: typeof list = [];
      const startIdx = g * groupSize;
      for (let j = 0; startIdx + j < list.length && j < groupSize; j++) {
        curGroupItem.push(list[startIdx + j]);
      }
      groupList.push(curGroupItem);
    }
    return groupList;
  }

  @Watch('groupList', {
    immediate: true,
  })
  onGroupListChanged(newGroupList: T[][] | undefined) {
    const maxPageIndex = newGroupList?.length || 0;
    if (this.value >= maxPageIndex) {
      this.$emit('change', 0); //    0
    }
  }
}
</script>
