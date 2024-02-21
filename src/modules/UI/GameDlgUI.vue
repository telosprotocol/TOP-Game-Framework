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
          class="text-[#99411A] z-[1] relative"
          :style="dlgBgStyle"
          v-bind="$attrs"
        >
          <slot name="titleWrap">
            <div
              :style="headerBarStyle"
              class="mx-auto absolute bg-center bg-contain bg-no-repeat flex items-end"
            >
              <slot name="title">
                <div
                  class="w-full bg-contain bg-center bg-no-repeat h-7"
                  :style="$ss.getters.convertBgImageStyle(imgTitle)"
                ></div>
              </slot>
            </div>
          </slot>
          <button
            v-if="!noClose"
            @click="onCloseClicked"
            class="absolute -translate-y-full w-9 h-9 bg-contain bg-center bg-no-repeat active:scale-95"
            :style="
              $ss.getters.normalizeCss(
                {
                  right: -28,
                  top: 8,
                },
                require('@/assets/gameCommon/x.png?webp'),
                true
              )
            "
          ></button>
          <slot></slot>
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
import ImagePreloader from '@/controller/ImagePreloader';
import { webpFilter } from '@/directives/webp';

@Component({
  components: {},
})
export default class GameDlgUI extends mixins(BaseDlgMixin) {
  mounted() {
    ImagePreloader.Instance.preloadImage(
      webpFilter(require('@/assets/gameCommon/dlgWoodTitle.png?webp'))
    );
  }
  //#region UI
  get headerBarStyle() {
    return this.$ss.getters.normalizeCss(
      {
        width: 572 / 2,
        height: 60,
        top: -77,
      },
      require('@/assets/gameCommon/dlgWoodTitle.png?webp'),
      true
    );
  }

  @Prop({
    type: Boolean,
    default: false,
  })
  noClose: boolean;

  @Prop({
    type: Number,
    default: 336,
  })
  width: number;
  get dlgBgStyle() {
    return this.$ss.getters.normalizeCss({
      borderImageSource: convertUrlExpression(
        require('@/assets/gameCommon/dlgWoodBg.9.png')
      ),
      backgroundClip: 'padding-box',
      webkitBackgroundClip: 'padding-box',
      borderImageRepeat: 'stretch',
      borderImageSlice: `40 40 56 40 fill`,
      borderWidth: 20,
      borderBottomWidth: 28,
      width: this.width,
    });
  }
  //#endregion

  @Prop({
    type: String,
  })
  imgTitle: string;

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.emitDlgVisible(false);
    this.$emit('close');
  }
}
</script>
