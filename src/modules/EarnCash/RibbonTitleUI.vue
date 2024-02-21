<template>
  <div
    class="bg-[length:100%_100%] bg-right bg-no-repeat pl-1 pr-3 inline-flex items-center justify-center text-[#A93525] text-[13px] font-bold font-rubik rounded-tl-lg tracking-[-0.07em]"
    :style="bgStyle"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { webpFilter } from '@/directives/webp';
import { convertUrlExpression } from '@/utils/styles';
import Vue from 'vue';
import Component from 'vue-class-component';
@Component({
  components: {},
})
export default class RibbonTitleUI extends Vue {
  get bgStyle() {
    return this.$ss.getters.normalizeCss({
      borderImageSource: convertUrlExpression(
        webpFilter(require('@/assets/earncash/yellowRibbon.png?webp'))
      ),
      borderImageSlice: `8 16 8 16 fill`,
      backgroundClip: 'padding-box',
      webkitBackgroundClip: 'padding-box',
      borderWidth: 4,
      borderRightWidth: 8,
      borderLeftWidth: 8,
      borderColor: 'transparent',
      height: 30,
    });
  }
}
</script>
