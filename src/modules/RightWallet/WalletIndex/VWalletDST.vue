<template>
  <div
    class="bg-white rounded-2xl p-3 shadow-sm shadow-[rgba(173, 138, 221, 0.50)]"
  >
    <div class="flex items-center justify-between text-[#333] mb-2">
      <div class="robot-bold text-sm">
        {{ $t('VRW.dstBalance') }}
      </div>
      <div class="text-[10px] font-bold">
        1 {{ $t('V.DST') }} ≈ Rp {{ txtPriceRp }}
      </div>
    </div>
    <div
      class="rounded-full h-9 py-[1px] flex items-center border border-solid border-[#F1E8FF] bg-[#F6F2FC] px-2.5 mb-3"
    >
      <div
        class="shrink-0 w-7 h-7 box-content bg-contain bg-center bg-no-repeat mr-3"
        v-webp="require('@/assets/vcommon/CoinVToken.png?webp')"
      ></div>
      <div class="robot-bold text-xl">{{ txtToken }}</div>
    </div>
    <div class="flex items-center justify-start">
      <VRightButtonExchange class="mr-2.5"></VRightButtonExchange>
      <VRightButtonDetail class="mr-2.5"></VRightButtonDetail>
      <VRightButtonCharge class="mr-2.5"></VRightButtonCharge>
      <VRightButtonWithdraw></VRightButtonWithdraw>
    </div>
  </div>
</template>

<script lang="ts">
import { VCoinEnum } from '@/modules/VAssetInfo/VCoinEnum';

import Component from 'vue-class-component';
import { Mixins } from 'vue-property-decorator';
import { VCoinPriceInfoMixin } from '@/modules/VAssetInfo/VCoinPriceInfo.state';
import { formatVRp } from '@/modules/vFormatter';
import { VRightWalletInfoMixin } from '../RightWallet.state';
import VRightButtonCharge from '../VRightButtons/VRightButtonCharge.vue';
import VRightButtonDetail from '../VRightButtons/VRightButtonDetail.vue';
import VRightButtonExchange from '../VRightButtons/VRightButtonExchange.vue';
import VRightButtonWithdraw from '../VRightButtons/VRightButtonWithdraw.vue';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { noop } from 'lodash-es';

@Component({
  components: {
    VRightButtonCharge,
    VRightButtonWithdraw,
    VRightButtonExchange,
    VRightButtonDetail,
  },
})
export default class VWalletDST extends Mixins(
  BindEventMixinDefault,
  VCoinPriceInfoMixin,
  VRightWalletInfoMixin
) {
  useInited() {
    this.refreshVCoinPriceInfo();
    return noop;
  }
  /**
   *   Rp
   */
  get txtPriceRp() {
    const CoinPriceInfo = this.CoinPriceInfo;
    if (!CoinPriceInfo) {
      return '-';
    }
    return formatVRp(Number(CoinPriceInfo.dstToRp));
  }

  get txtToken() {
    let tokenStr = this.getCoinAssetText(VCoinEnum.VTOKEN, '-');
    return tokenStr;
    // const assetItem = this.UserAssetInfoMap[VCoinEnum.VTOKEN];
    // const amount = assetItem?.amount;
    // if (amount == null) {
    //   return '-';
    // }
    // return formatVToken2(Number(amount))
  }
}
</script>
