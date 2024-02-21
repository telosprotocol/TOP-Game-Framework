<template>
  <transition name="tz-transwrap" :duration="250">
    <div class="tz-modal tz-transwrap-scale" v-show="value" v-bind="$attrs">
      <div class="tz-modal_mask"></div>
      <!-- Dlg Container: FullScreen -->
      <div
        class="absolute inset-0 flex items-center justify-center tz-transel-scaleInOut"
      >
        <div
          class="w-80 px-2 py-2.5 bg-gradient-to-b from-[#AA76F1] to-[#8153DD] rounded-xl relative"
        >
          <button
            class="absolute -top-3 -right-2 -translate-y-full w-[30px] h-[30px] bg-contain bg-center bg-no-repeat active:scale-95"
            @click="onCloseClicked"
            v-webp="require('@/assets/vcommon/close/btnPurpleClose.png?webp')"
          ></button>
          <div
            class="font-rubik font-bold text-white text-base flex items-center justify-center pb-2.5"
          >
            {{ $t('VDE.exchangeSuccess') }}
          </div>
          <main class="bg-white rounded-xl py-5 px-4">
            <div class="flex flex-col items-center justify-center relative">
              <div class="relative mb-2.5">
                <div
                  class="absolute bg-contain bg-center bg-no-repeat z-0"
                  :style="lightBgStyle"
                ></div>
                <div
                  class="shrink-0 w-24 h-24 box-content bg-contain bg-center bg-no-repeat z-10 relative"
                  v-webp="require('@/assets/vcommon/CoinGold.png?webp')"
                ></div>
              </div>
              <div
                class="text-base text-medium text-[#7B44C8] robot-bold italic"
              >
                {{ $t('VDE.coinsObtained') }}:<span>{{ txtGettedCoins }}</span>
              </div>
            </div>
            <div class="pt-2">
              <div
                class="vbutton font-rubik w-full h-12 mb-3 active:scale-95"
                @click="onOKClick"
              >
                {{ $t('VDE.playGame') }}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import ButtonLockController from '@/controller/ButtonLockController';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { formatVGold } from '@/modules/vFormatter';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/index';
import { convertBgImageStyle } from '@/utils/styles';
import { close_bridge } from '@/js_bridge/js_call_app_base';
import { APP_ROUTE_TAB_GAME } from '@/constants/APP_SCHEMA_URLS';

@Component({
  components: {},
})
export default class VRightToken2CoinExchangeOkDlg extends mixins(PopupMixin) {
  @Prop({
    type: Number,
    required: true,
  })
  gettedCoins: number;
  @Prop({
    type: String,
    required: true,
  })
  expLevelFee: string;

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$trace('dst_exchange_success_exposure');
    }
  }
  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$trace('close_me_wallet_exchange_result', {
      getted_coins: this.gettedCoins,
      commission: this.expLevelFee,
      exchange_result: 1,
    });

    this.emitDlgVisible(false);
  }

  get lightBgStyle() {
    const padStr = '-30%';
    return convertBgImageStyle(
      '/online/common/light/yellowLight.png?webp',
      true,
      this.$ss.getters.designPxsObjToReal({
        left: padStr,
        right: padStr,
        top: padStr,
        bottom: padStr,
      })
    );
  }
  get txtGettedCoins() {
    return formatVGold(this.gettedCoins);
  }
  onOKClick() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    this.$trace('click_dst_exchange_success_playgame');
    close_bridge();
    openAppH5LinkPreferLocal(APP_ROUTE_TAB_GAME, {});
    this.emitDlgVisible(false);
  }
}
</script>
@/constants/APP_SCHEMA_URLS
