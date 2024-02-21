<template>
  <div class="stepbar">
    <div class="stepbar__barouter">
      <div class="stepbar__bar" :style="innerBarStyle"></div>
    </div>
    <div class="stepbar__main">
      <div
        v-for="item in stepCount"
        :key="item"
        :class="{
          stepbar__item: true,
          'stepbar__item--active': item <= stepNum,
        }"
      >
        <span v-if="item < stepNum" class="iconfont icon-check-outlined"></span>
        <span v-else>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '~@/styles/utils.less';
@defaultColor: #f6f6f6;
@activeColor: #ffd039;
@barSize: 18px;
.iconfont {
  font-size: 1.2em;
}
.stepbar {
  position: relative;
  &::before,
  &__barouter {
    top: @barSize / 2;
    content: '';
    position: absolute;
    left: @barSize / 2;
    right: @barSize / 2;
    height: 4px;
    transform: translateY(-50%);
  }
  &::before {
    background-color: @defaultColor;
    z-index: -1;
    right: @barSize / 2;
  }
  &__barouter {
    z-index: 0;
  }
  &__bar {
    border-radius: 4px;
    height: 100%;
    background-color: @activeColor;
    transition: width 0.3s;
  }
  &__main {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
  }
  &__item {
    font-size: 12px;
    width: @barSize;
    height: @barSize;
    line-height: @barSize;
    border-radius: @barSize;
    background: #bbbcc6;
    color: @defaultColor;
    text-align: center;
    vertical-align: middle;
    &--active {
      color: #fff;
      background: @activeColor;
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
const StepBarProps = Vue.extend({
  props: {
    stepNum: {
      type: Number,
      required: true,
    },
    stepCount: {
      type: Number,
      required: true,
    },
  },
});
@Component({
  components: {},
})
export default class StepBar extends StepBarProps {
  get innerBarStyle() {
    return {
      width: `${(((this.stepNum - 1) / (this.stepCount - 1)) * 100).toFixed(
        2
      )}%`,
    };
  }
}
</script>
