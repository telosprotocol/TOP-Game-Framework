<template>
  <section
    class="inline-flex items-center justify-between h-5 bg-black bg-opacity-30 border border-[#E4A35C] rounded-full relative"
    :style="$ss.getters.normalizeCss({ width: 100 })"
  >
    <div
      class="shrink-0 -ml-1 w-6 h-6 box-content bg-contain bg-center bg-no-repeat"
      v-webp="iconAssetWebp"
    ></div>
    <div
      class="flex-1 robot-medium text-xs leading-none font-[900] overflow-hidden whitespace-nowrap text-ellipsis text-center text-white"
    >
      <slot></slot>
    </div>
    <div
      class="shrink-0 w-5 h-5 -mr-[1px] box-content bg-contain bg-center bg-no-repeat relative before:absolute before:-inset-1/2"
      @click="$emit('clickRight')"
      v-webp="iconRightWebp"
    ></div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class VGameAssetBlock extends Vue {
  showCoinSplitPopover = false;

  @Prop({
    type: String,
  })
  txtNum: string;

  @Prop({
    type: String,
  })
  iconAssetWebp: string;

  @Prop({
    type: String,
  })
  iconRightWebp: string;
}
</script>
