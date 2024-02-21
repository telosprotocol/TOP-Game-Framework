<template>
  <transition name="tz-transwrap">
    <div
      class="tz-modal tz-transwrap-scale flex items-center justify-center"
      v-show="value"
    >
      <div class="tz-modal_mask"></div>
      <div
        class="p-1 text-center robot text-sm leading-tight text-[#FFEAB0] tz-transel-scaleInOut relative"
        v-bind="$attrs"
        :style="tipStyle"
      >
        <slot>{{ message || '' }}</slot>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
import Component, { mixins } from 'vue-class-component';
import { convertUrlExpression } from '@/utils/styles';
import { Prop } from 'vue-property-decorator';
import { getStore } from '@/store/util';
@Component({
  components: {},
})
export default class GameDlgSimpleUI extends mixins(BaseDlgMixin) {
  get tipStyle() {
    //  createGameToast  ，  getToast
    return getStore().getters.normalizeCss({
      borderImageSource: convertUrlExpression(
        require('@/assets/gameCommon/tipsBg.9.png')
      ),
      borderImageSlice: `24 24 32 24 fill`,
      backgroundClip: 'padding-box',
      webkitBackgroundClip: 'padding-box',
      borderWidth: 12,
      borderBottomWidth: 16,
      width: 266,
      marginTop: -24,
    });
  }
  @Prop({
    type: String,
  })
  message: string;
}
</script>
