<template>
  <transition name="page-modal">
    <div class="page-modal" v-show="value">
      <div class="page-modal_head">
        <div class="page-modal_title">
          <slot name="title"></slot>
          <button
            class="page-modal_btn-close iconfont icon-close text-2xl leading-none"
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
/**
 *
 */
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
@Component({})
export default class PageModal extends Vue {
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
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: @index-dialog;
  background-color: #fff;
  &_head {
    height: 80px;
    padding-top: 24px;
  }
  &_title {
    position: relative;
    height: 56px;
    padding: 0 18px;
    color: #333;
    font-weight: 700;
    font-size: 16px;
    line-height: 56px;
    vertical-align: middle;
  }
  &_btn-close {
    position: absolute;
    top: 50%;
    right: 16px;
    color: #333;
    transform: translateY(-50%);
  }
  &_body {
    position: absolute;
    top: 80px;
    right: 0;
    bottom: 0;
    left: 0;
    margin-top: 18px;
    padding: 0 12px;
    overflow: auto;
  }
}
</style>
