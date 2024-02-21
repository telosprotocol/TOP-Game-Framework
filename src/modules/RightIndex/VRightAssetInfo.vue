<template>
  <div
    class="text-white text-xs leading-none pt-2.5"
    @click="onOpenRightWallet"
  >
    <section
      class="flex justify-end items-center text-white font-robot font-black text-sm leading-none mb-2"
    >
      <!-- DST -->
      <div
        class="flex items-center h-6 bg-[rgba(7,3,53,0.15)] pl-1 pr-1 rounded-full tz-ellipsis-break-1 relative ml-1"
        @click="onOpenDSTExchange"
      >
        <div
          class="absolute bottom-0 h-[1px] left-1/4 right-1/4 bg-gradient-to-r from-[rgba(255,255,255,0)] via-white to-[rgba(255,255,255,0)]"
        ></div>
        <div
          class="shrink-0 w-[17px] h-[17px] box-content bg-contain bg-center bg-no-repeat mr-1"
          v-webp="require('@/assets/vcommon/CoinVToken.png?webp')"
        ></div>
        <div class="flex-1 w-[72px] mr-1 text-center tz-ellipsis-break-1">
          {{ vTokenNumText }}
        </div>
        <div
          class="shrink-0 w-4 h-4 bg-contain bg-center bg-no-repeat"
          v-webp="require('@/assets/rightIndex/btnExchange.png?webp')"
        ></div>
      </div>
      <!-- GOLD -->
      <div
        class="flex items-center h-6 bg-[rgba(7,3,53,0.15)] pl-1 pr-1 rounded-full relative ml-1"
        @click="onOpenGoldWithdraw"
      >
        <div
          class="absolute bottom-0 h-[1px] left-1/4 right-1/4 bg-gradient-to-r from-[rgba(255,255,255,0)] via-white to-[rgba(255,255,255,0)]"
        ></div>
        <div
          class="shrink-0 w-[17px] h-[17px] box-content bg-contain bg-center bg-no-repeat mr-1"
          v-webp="require('@/assets/vcommon/CoinGold.png?webp')"
        ></div>
        <div class="flex-1 w-[72px] mr-1 text-center tz-ellipsis-break-1">
          {{ coinNumText }}
        </div>
        <div
          class="shrink-0 w-4 h-4 bg-contain bg-center bg-no-repeat"
          v-webp="require('@/assets/rightIndex/btnRight.png?webp')"
        ></div>
      </div>
    </section>
    <section class="mb-2" @click="onOpenRightWallet">
      <h3 class="font-rubik font-medium text-xs leading-none mb-2 opacity-80">
        {{ $t('VR.totalAsset') }}
      </h3>
      <div class="font-rubik rounded-full flex items-start relative">
        <div class="mr-1 pt-0.5">Rp</div>
        <div class="font-din-bold text-[32px] leading-none">
          {{ totalRp }}
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';

import ButtonLockController from '@/controller/ButtonLockController';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/index';
import {
  ROUTEPATH_V_RIGHTWALLET,
  ROUTENAME_INAPP_VRIGHT,
  ROUTEPATH_V_RIGHT_DSTEXCHANGE,
} from '@/constants/localRoutePath';

import { formatVRp, formatVGold2, formatVToken2 } from '@/modules/vFormatter';
import { goToGoldWithdraw } from '@/modules/vRedirect';
import { VRightStatMixin } from '@/modules/VAssetInfo/RightStat.state';
@Component({
  components: {},
})
export default class VRightAssetInfo extends mixins(VRightStatMixin) {
  get coinNumText() {
    const VRightStat = this.VRightStat;
    if (!VRightStat) {
      return '-';
    }
    return formatVGold2(Number(VRightStat.goldTotalAmount));
  }
  get vTokenNumText() {
    const VRightStat = this.VRightStat;
    if (!VRightStat) {
      return ' ';
    }
    return formatVToken2(Number(VRightStat.dstTotalAmount));
  }

  get totalRp() {
    const VRightStat = this.VRightStat;
    if (!VRightStat) {
      return '-';
    }
    //          ，
    const totalRp =
      Number(VRightStat.dstToRpTotalAmount) +
      Number(VRightStat.goldToRpTotalAmount);
    return formatVRp(totalRp);
  }

  onOpenRightWallet() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    this.$trace('click_your_wallet_income', {
      wallet_type: 'total_value',
      rp_coins: this.totalRp,
    });
    openAppH5LinkPreferLocal(ROUTEPATH_V_RIGHTWALLET, {
      checkLogin: {
        traceEvent: ROUTENAME_INAPP_VRIGHT,
      },
    });
  }

  onOpenGoldWithdraw() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    this.$trace('click_your_wallet_income', {
      wallet_type: 'game_coin',
      rp_coins: this.coinNumText,
    });
    goToGoldWithdraw('right_tab', true);
  }

  onOpenDSTExchange() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    this.$trace('click_your_wallet_income', {
      wallet_type: 'dst_token',
      rp_coins: this.vTokenNumText,
    });
    openAppH5LinkPreferLocal(ROUTEPATH_V_RIGHT_DSTEXCHANGE, {
      checkLogin: {
        traceEvent: ROUTENAME_INAPP_VRIGHT,
      },
    });
  }
}
</script>
