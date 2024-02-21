<template>
  <div class="pb" :class="'pb-skin-' + skin">
    <header class="pb_header">
      <i class="pb_header_icon" :style="iconStyle"></i>
      <slot name="title"></slot>
      <button
        type="button"
        @click="onBtnClicked"
        class="ruleBtn"
        v-if="rightBtn"
      >
        {{ rightBtn }}
      </button>
    </header>
    <div class="pb_content">
      <div class="progress">
        <div class="progress_bar">
          <div class="progress_bar_inner" :style="progressInnerStyle"></div>
        </div>
        <div class="progress_list">
          <div
            v-for="item in listDetail"
            :key="item.value"
            class="progress_list_item"
            :class="{
              active: item.isActive,
            }"
          >
            <div class="item_goal">{{ item.goalLabel }}</div>
            <div class="item_point"></div>
            <div class="item_txt">
              {{ item.valueLabel || item.value }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { convertBgImageStyle } from '@/utils/styles';
import Vue, { PropType } from 'vue';
type IProcessListItem = {
  goalLabel: string;

  /**
   *    null，   value
   */
  valueLabel?: string;
  value: number;
};
export const ProcessBlock = Vue.extend({
  name: 'ProcessBlock',
  props: {
    icon: {
      type: String,
      required: true,
    },
    skin: {
      type: String as PropType<'default' | 'down'>,
      // down
      default: 'default',
    },
    /**
     *   Rules
     */
    rightBtn: {
      type: String,
      default: undefined,
    },
    rightBtnClicked: {
      type: Function,
      default: function () {
        return () => {};
      },
    },
    list: {
      type: Array as PropType<IProcessListItem[]>,
      required: true,
    },
    currentValue: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    iconStyle() {
      return convertBgImageStyle(this.icon);
    },
    listDetail(): ({ isActive } & IProcessListItem)[] {
      const list = this.list as IProcessListItem[];
      const currentValue = this.currentValue;
      return list.map((item) => {
        return {
          isActive: currentValue >= item.value,
          ...item,
        };
      });
    },
    progressInnerStyle(): { width: string } {
      return {
        width: `${(this.processPercent as number).toFixed(2)}%`,
      };
    },
    processPercent(): number {
      const list = this.list as IProcessListItem[];
      if (list.length === 0) {
        return 0;
      }
      const currentValue = this.currentValue as number;
      const perCount = 100 / (list.length - 1);
      let sum = 0;
      let lastValue = list[0].value;
      for (let i = 1; i < list.length; i++) {
        const item = list[i];
        if (currentValue >= item.value) {
          sum += perCount;
        } else {
          const dis = currentValue - lastValue;
          if (dis > 0) {
            sum += (dis / (item.value - lastValue)) * perCount;
          }
          break;
        }
        lastValue = item.value;
      }
      // console.log('percent', sum, currentValue)
      return sum;
    },
  },
  methods: {
    onBtnClicked(e: MouseEvent) {
      const rightBtnClicked = this.rightBtnClicked;
      if (rightBtnClicked) {
        rightBtnClicked(e);
      }
    },
  },
});
export default ProcessBlock;
</script>

<style lang="less" scoped src="./ProcessBlock.less"></style>
