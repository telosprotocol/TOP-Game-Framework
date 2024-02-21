<template>
  <transition name="tz-transwrap" :duration="250">
    <div class="tz-modal tz-transwrap-scale" v-show="value" v-bind="$attrs">
      <div class="tz-modal_mask" @click="onCloseClicked"></div>
      <!-- Dlg Container: FullScreen -->
      <div
        class="absolute left-0 right-0 bottom-0 tz-transel-slideBottomInOut bg-white rounded-t-xl px-4 py-6"
      >
        <div class="robot-bold text-xl leading-none relative text-center mb-4">
          {{ $t('VRW.tokenPurchase') }}

          <button
            @click="onCloseClicked"
            class="iconfont -top-1 icon-close-circle text-[#ccc] absolute right-0 text-[1.2em]"
          ></button>
        </div>
        <div>
          <!-- <div class="px-3 pt-7">
            <div class="flex justify-between items-center mb-4">
              <div class="text-[#333] flex-1 robot-bold text-base leading-none">
                {{ $t('VRW.totalDSTRecycled') }}
              </div>
              <div
                class="shrink-0 w-6 h-6 box-content bg-contain bg-center bg-no-repeat mr-1"
                v-webp="
                  require('@/assets/vcommon/CoinVToken.png?webp')
                "
              ></div>
              <div class="font-din-bold text-[#B659FF] text-[28px]">
                {{ dstNum }}
              </div>
            </div>
            <div class="text-[#aaa] text-xs leading-none mb-4">
              {{ $t('VRW.totalDSTRecycled') }}
            </div>
          </div> -->
          <div class="text-[#aaa] text-xs leading-none mb-4">
            {{ $t('VRW.purchaseFunctionComingSoon') }}
          </div>
          <div
            @click="onCloseClicked"
            class="bg-[#B659FF] opacity-50 text-white flex items-center justify-center rounded-lg flex-1 py-2"
          >
            {{ $t('V.pleaseLookForward') }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';

@Component({
  components: {},
})
export default class VRightBuyTokenDlg extends mixins(PopupMixin) {
  //#region Dlg Basic Setting

  // // remove if not used
  // @Watch('value')
  // async onValueChange(isShow: boolean) {
  //   if (isShow) {
  //     const res = await getReclaimInfo();
  //     if (res.Result === 1 && res.data) {
  //       this.dstNum = formatVToken(Number(res.data));
  //     } else {
  //       Toast(res.Reason);
  //     }
  //   }
  // }

  dstNum = '';

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$trace('close_me_wallet_dst_window_recharge');

    this.emitDlgVisible(false);
  }
  //#endregion
}
</script>
