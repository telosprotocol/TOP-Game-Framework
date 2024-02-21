<template>
  <transition name="tz-transwrap">
    <div
      class="tz-modal pt-7 tz-transwrap-scale flex items-center justify-center"
      v-if="value"
    >
      <div class="tz-modal_mask"></div>
      <div class="relative tz-transel-scaleInOut">
        <slot name="beforeMain"></slot>
        <main
          class="text-[#99411A] z-[1] relative -mt-6"
          :style="dlgBgStyle"
          v-bind="$attrs"
        >
          <!-- Title -->
          <div
            class="absolute"
            :style="
              $ss.getters.normalizeCss({
                height: 36,
                left: 0,
                top: -96,
                right: 0,
              })
            "
          >
            <slot name="title">
              <div
                class="bg-contain bg-center w-full h-full bg-no-repeat"
                :style="$ss.getters.normalizeCss({}, imgTitle)"
              ></div>
            </slot>
          </div>
          <button
            v-if="!noClose"
            @click="onCloseClicked"
            class="absolute bg-contain bg-center bg-no-repeat active:scale-95"
            :style="
              $ss.getters.normalizeCss(
                {
                  width: 38,
                  height: 38,
                  top: -110,
                  right: -42,
                },
                require('@/assets/gametask2/x.png?webp'),
                true
              )
            "
          ></button>
          <div
            class="absolute"
            :style="
              $ss.getters.normalizeCss({
                height: 40,
                left: 0,
                top: -50,
                right: 0,
              })
            "
          >
            <slot name="header"></slot>
          </div>

          <slot></slot>
          <div
            class="absolute"
            :style="
              $ss.getters.normalizeCss({
                height: 26,
                left: -25,
                bottom: -30,
                right: -28,
              })
            "
          >
            <slot name="bottom"></slot>
          </div>
        </main>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Prop } from 'vue-property-decorator';
import { convertUrlExpression } from '@/utils/styles';

@Component({
  components: {},
})
export default class GameWoodDlgUI extends mixins(BaseDlgMixin) {
  //#region UI

  @Prop({
    type: Boolean,
    default: false,
  })
  noClose: boolean;

  @Prop({
    type: String,
    required: false,
  })
  imgTitle?: string;

  @Prop({
    type: Number,
    default: 354,
  })
  width: number;
  get dlgBgStyle() {
    return this.$ss.getters.normalizeCss({
      borderImageSource: convertUrlExpression(
        require('@/assets/gameCommon/taskBg.png')
      ),
      backgroundClip: 'padding-box',
      webkitBackgroundClip: 'padding-box',
      borderImageRepeat: 'stretch',
      borderImageSlice: `284 76 64 88 fill`,
      borderLeftWidth: 44,
      borderRightWidth: 38,
      borderBottomWidth: 32,
      borderTopWidth: 142,
      width: this.width,
    });
  }
  //#endregion

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.emitDlgVisible(false);
    this.$emit('close');
  }
}
</script>
