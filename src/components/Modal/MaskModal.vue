<template>
  <transition name="tz-modal" :duration="300">
    <div
      class="tz-modal"
      :class="{ hasbutton: !!$slots.toolbar }"
      v-show="lazy ? true : value"
      v-if="lazy ? value : true"
      v-bind="$attrs"
    >
      <div class="tz-modal_mask"></div>
      <slot name="body">
        <div class="tz-modal_body">
          <button
            v-if="!noCloseBtn"
            class="tz-modal_close-btn iconfont icon-close-circle text-2xl leading-none"
            @click="$emit('input', false)"
          ></button>
          <div class="tz-modal_title" v-if="$slots.title">
            <slot name="title"></slot>
          </div>
          <div class="tz-modal_content">
            <slot name="default"> </slot>
            <slot name="toolbar"></slot>
          </div>
        </div>
      </slot>
    </div>
  </transition>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component';
import { Component, Prop } from 'vue-property-decorator';
import PopupMixin from './PopupMixin';
@Component<MaskModal>({})
export default class MaskModal extends mixins(PopupMixin) {
  @Prop({
    type: Boolean,
    default: false,
  })
  noCloseBtn: boolean;
  // true:   v-if,false:  v-show

  @Prop({
    type: Boolean,
    default: true,
  })
  lazy: boolean;
}
</script>
