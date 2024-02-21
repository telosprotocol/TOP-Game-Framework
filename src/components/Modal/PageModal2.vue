<template>
  <transition name="page-modal">
    <div class="page-modal" v-show="value">
      <div class="page-modal_head">
        <div class="page-modal_title">
          <slot name="title"></slot>
          <button
            class="page-modal_btn-close iconfont icon-close-circle"
            @click="$emit('input', false)"
          ></button>
        </div>
      </div>
      <div class="page-modal_body">
        <slot name="default"> </slot>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
@Component({})
export default class PageModal2 extends Vue {
  @Prop({
    type: Boolean,
    required: true,
  })
  value: boolean;
}
</script>

<style lang="less" scoped>
@import '~@/styles/utils.less';
.page-modal {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #fff;
  z-index: @index-dialog;
  &_head {
    height: 56px;
  }
  &_title {
    height: 56px;
    line-height: 56px;
    vertical-align: middle;
    padding: 0 18px;

    font-size: 16px;
    font-weight: 700;
    color: #333;
    position: relative;
  }
  &_btn-close {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #fff;
  }
  &_body {
    margin-top: 0;
    position: absolute;
    top: 56px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    padding: 0 12px;
  }
}
</style>
