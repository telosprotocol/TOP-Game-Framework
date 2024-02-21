<template>
  <div
    class="rounded-full bg-[rgba(7,3,53,0.46)] flex items-center text-white font-rubik font-medium text-base leading-5 overflow-hidden pr-2"
  >
    <div
      v-webp="iconUrl"
      class="bg-contain bg-center bg-no-repeat mx-0.5 shrink-0"
      :style="$ss.getters.designPxsObjToReal({ width: 25, height: 25 })"
    ></div>
    <div class="text-ellipsis flex-1 overflow-hidden">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import type { VCoinEnum } from '@/modules/VAssetInfo/VCoinEnum';
import { getCoinConfig } from '@/modules/VAssetInfo/VCoin.config';
@Component({
  components: {},
})
export default class VAssetBlockUI extends Vue {
  @Prop({
    type: String,
    required: true,
  })
  coinType: VCoinEnum;

  get iconUrl() {
    return getCoinConfig(this.coinType).icon;
  }
}
</script>
