<template>
  <header class="px-4 text-white pb-3 bg-cover bg-center bg-no-repeat">
    <div class="mb-2">
      <div class="flex justify-between items-center">
        <div class="robot-bold flex-1 text-base">
          {{ $t('VRW.totalAssets') }}
        </div>
      </div>
    </div>
    <div
      class="rounded-full bg-white px-3 h-10 flex items-center text-[#9567D1]"
    >
      <div class="robot-bold text-2xl">Rp {{ totalText }}</div>
    </div>
  </header>
</template>

<script lang="ts">
import { VCoinEnum } from '@/modules/VAssetInfo/VCoinEnum';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { VCoinPriceInfoMixin } from '@/modules/VAssetInfo/VCoinPriceInfo.state';
import { formatVRp } from '@/modules/vFormatter';
import HeaderTop from '@/components/HeaderTop/index.vue';
import { VRightWalletInfoMixin } from '../RightWallet.state';
@Component({
  components: {
    HeaderTop,
  },
})
export default class VWalletHead extends mixins(
  VRightWalletInfoMixin,
  VCoinPriceInfoMixin
) {
  get totalText() {
    const priceInfo = this.CoinPriceInfo;
    const goldItem = this.UserAssetInfoMap[VCoinEnum.GOLD];
    const tokenItem = this.UserAssetInfoMap[VCoinEnum.VTOKEN];

    if (!goldItem || !tokenItem || !priceInfo) {
      return '-';
    }

    return formatVRp(
      Number(goldItem.amount) / Number(priceInfo.rpToGold) +
        Number(tokenItem.amount) * Number(priceInfo.dstToRp)
    );
  }

  get expLevel() {
    const RightWalletInfo = this.RightWalletInfo;
    return RightWalletInfo?.expLevel ?? '-';
  }

  // goToLevel() {
  //   if (!ButtonLockController.Instance.tryGetNavLock()) {
  //     return;
  //   }
  //   this.$trace('click_me_wallet_mylevel');
  //   openAppH5LinkPreferLocal(ROUTEPATH_V_RIGHTLEVEL, {});
  // }
}
</script>
