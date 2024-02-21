<template>
  <transition name="btm-toast">
    <div class="btm-toast flex text-sm items-center" v-if="value">
      <div class="flex-1 mr-2">
        <slot name="msg">{{ msg }}</slot>
      </div>
      <div class="btm-toast_buttons">
        <slot name="button">
          <button
            class="tz-touchable"
            v-if="buttonClick && buttonText"
            @click="buttonClick"
          >
            {{ buttonText }}
          </button>
        </slot>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="less">
.btm-toast {
  position: fixed;
  bottom: 0;
  z-index: 4000;
  width: 100%;
  padding: 16px;
  padding-bottom: 12px;
  color: #fff;
  line-height: 1.4286em;
  vertical-align: middle;
  background: #323232;
  &_buttons {
    color: #ffac33;
  }
  &-enter,
  &-leave-to {
    transform: translateY(100%);
  }
  &-enter-to,
  &-leave {
    transform: translateY(0);
  }
  &-enter-active,
  &-leave-active {
    transition: transform 0.8s;
  }
}
</style>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
@Component
export default class BottomToast extends Vue {
  //#region Props
  @Prop(Boolean)
  readonly value: boolean;

  /**
   *     （   msg slot  ）
   */
  @Prop(String)
  readonly msg: string;

  /**
   *     （   buttons slot  ）
   */
  @Prop(String)
  readonly buttonText?: string;

  /**
   * Prop:
   */
  @Prop(Function)
  readonly buttonClick?: () => void;

  /**
   *
   */
  @Prop({ type: Number, default: 5 })
  readonly duration: number;
  //#endregion

  private _timer!: ReturnType<typeof setTimeout>;
  @Watch('value', {
    immediate: true,
  })
  onVisibleChanged(v: boolean) {
    if (v) {
      this._timer = setTimeout(() => {
        this.$emit('input', false); //
      }, this.duration * 1000);
    } else {
      if (this._timer) {
        clearTimeout(this._timer);
      }
    }
  }
}
</script>
