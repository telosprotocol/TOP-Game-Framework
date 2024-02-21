<template>
  <div
    class="bg-white rounded-2xl p-3 shadow-sm shadow-[rgba(173, 138, 221, 0.50)]"
  >
    <div class="flex items-center justify-between text-[#333] mb-2">
      <div class="robot-bold text-sm">
        {{ $t('VRW.coinBalance') }}
      </div>
      <div class="text-[10px] font-bold">
        1 <span class="capitalize">{{ $t('V.Coin') }}</span> = Rp
        {{ txtPriceRp }}
      </div>
    </div>
    <div
      class="rounded-full h-9 py-[1px] flex items-center border border-solid border-[#F1E8FF] bg-[#F6F2FC] px-2.5 mb-3"
    >
      <div
        class="shrink-0 w-7 h-7 box-content bg-contain bg-center bg-no-repeat mr-3"
        v-webp="require('@/assets/vcommon/CoinGold.png?webp')"
      ></div>
      <div class="robot-bold text-xl">{{ txtGold }}</div>
    </div>
    <div class="flex items-center justify-start">
      <button
        class="rounded-2.5 w-16 px-[1px] h-14 py-[1px] text-[11px] robot-medium flex items-center justify-center flex-col leading-none bg-gradient-to-b from-[#EBFCF7] to-[#F2FEFA]Et14:55 mr-2.5 active:scale-95"
        @click="onRechargeClick"
      >
        <div
          class="w-6 h-6 shrink-0 bg-contain bg-center bg-no-repeat mb-1"
          v-webp="require('../imgs/rightButton/Topup.png?webp')"
        ></div>
        <div class="text-[#1CCB86] font-rubik font-[500]">
          {{ $t('VRW.recharge') }}
        </div>
      </button>
      <button
        class="rounded-2.5 w-16 px-[1px] h-14 py-[1px] text-[11px] robot-medium flex items-center justify-center flex-col leading-none bg-gradient-to-b from-[#FFEFF5] to-[#FFF5FA] mr-2.5 active:scale-95"
        @click="onWithdrawClick"
      >
        <div
          class="w-6 h-6 shrink-0 bg-contain bg-center bg-no-repeat mb-1"
          v-webp="require('../imgs/rightButton/Withdraw.png?webp')"
        ></div>
        <div class="text-[#FC385B] font-rubik font-[500]">
          {{ $t('VRW.withdraw') }}
        </div>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import ButtonLockController from '@/controller/ButtonLockController';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/openAppH5LinkPreferLocal';
import { VCoinEnum } from '@/modules/VAssetInfo/VCoinEnum';
import { goToGoldWithdraw } from '@/modules/vRedirect';

import Component from 'vue-class-component';
import { Mixins } from 'vue-property-decorator';
import { VCoinPriceInfoMixin } from '@/modules/VAssetInfo/VCoinPriceInfo.state';
import { formatVRp } from '@/modules/vFormatter';
import { VRightWalletInfoMixin } from '../RightWallet.state';
import VRightButtonCharge from '../VRightButtons/VRightButtonCharge.vue';
import VRightButtonWithdraw from '../VRightButtons/VRightButtonWithdraw.vue';
import { getVPayUrl } from '@/constants/APP_SCHEMA_URLS';
@Component({
  components: {
    VRightButtonCharge,
    VRightButtonWithdraw,
  },
})
export default class VWalletGold extends Mixins(
  VCoinPriceInfoMixin,
  VRightWalletInfoMixin
) {
  get txtRp() {
    const CoinPriceInfo = this.CoinPriceInfo;
    if (!CoinPriceInfo) {
      return '-';
    }
    return formatVRp(Number(CoinPriceInfo.dstToRp));
  }

  get txtGold() {
    return this.getCoinAssetText(VCoinEnum.GOLD, '-');
  }

  onWithdrawClick() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    this.$trace('click_me_wallet_exchange_tarikdana');
    goToGoldWithdraw('me_wallet', true);
  }

  onRechargeClick() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }

    this.$trace('click_me_wallet_exchange_recharge');
    openAppH5LinkPreferLocal(getVPayUrl('me_wallet'), {});
  }

  /**
   *   Rp
   */
  get txtPriceRp() {
    // const CoinPriceInfo = this.CoinPriceInfo;
    // if (!CoinPriceInfo) {
    //   return '-';
    // }
    return formatVRp(Number(1));
  }
}
</script>
@/constants/APP_SCHEMA_URLS
