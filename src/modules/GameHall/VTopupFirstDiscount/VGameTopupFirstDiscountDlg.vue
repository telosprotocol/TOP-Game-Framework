<template>
  <transition name="tz-transwrap">
    <div
      class="tz-modal tz-transwrap-scale"
      v-show="isRealShow"
      v-bind="$attrs"
    >
      <div class="tz-modal_mask"></div>
      <!-- Dlg Container: FullScreen -->
      <div
        class="absolute inset-0 flex flex-col items-center justify-center tz-transel-scaleInOut"
      >
        <div class="absolute inset-0" @click="onCloseClicked"></div>
        <div
          class="relative w-full h-80 bg-top bg-no-repeat bg-contain mb-5"
          :style="dlgBgStyle"
        >
          <!-- CloseButton -->
          <button
            @click="onCloseClicked"
            class="absolute top-[84px] scale-[0.6] right-3 w-[30px] h-[30px] bg-contain bg-center bg-no-repeat active:scale-50"
            v-webp="
              require('@/assets/vcommon/close/btnCloseYellowRaw.png?webp')
            "
          ></button>
        </div>
        <div class="px-10 w-full">
          <button
            class="vbutton vbutton--green font-rubik w-full h-10 active:scale-95 mb-3"
            @click="onGoToRecharge"
          >
            {{ $t('V_FF.goToRecharge') }}
          </button>
        </div>
        <!-- BUtton and tip -->
      </div>
      <div
        v-if="firstTopupDlgImage"
        class="absolute w-0 h-0 bottom-0 right-0 overflow-hidden"
      >
        <img :src="firstTopupDlgImage" />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/index';

import { Prop, Watch } from 'vue-property-decorator';

import { convertBgImageStyle } from '@/utils/styles';
import { VIsGameFirstRechargedMixin } from './VGameRecharge.state';
import { tryMergeLocalesForVPrjFFTopup } from '@/locales/Page/VPrj/V_FF/init';
import { Toast } from 'vant';
import { getActivityPayForOnePrice } from '@/constants/APP_SCHEMA_URLS';
import type { IVTopupSourceType } from '@/constants/APP_SCHEMA_URLS';
tryMergeLocalesForVPrjFFTopup();
@Component({
  components: {},
})
export default class VGameTopupFirstDiscountDlg extends mixins(
  PopupMixin,
  VIsGameFirstRechargedMixin
) {
  @Prop({
    type: String,
    default: 'gamehall_ffbutton',
  })
  from: IVTopupSourceType;

  get firstTopupDlgImage() {
    return this.GameFirstTopupDlgImageList?.[0]?.url;
  }

  get dlgBgStyle() {
    const productImage = this.firstTopupDlgImage;
    if (productImage) {
      return convertBgImageStyle(productImage);
    } else {
      return {};
    }
  }

  isRealShow = false;

  //#region Dlg Basic Setting

  // remove if not used
  @Watch('value')
  onValueChange(isShow: boolean) {
    this.isRealShow = isShow;
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close-ff', 0.5)) {
      return;
    }
    this.$tracev('click_close_giftpack', {
      openSource: this.from,
    });

    this.emitDlgVisible(false);
  }
  //#endregion
  async onGoToRecharge() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    this.$tracev('click_recharge_giftpack', {
      openSource: this.from,
      recharge_coins: this.IsGameFirstRechargedInfo?.reward,
    });
    const activityId = this.IsGameFirstRechargedInfo?.id;
    if (!activityId) {
      Toast(this.$t('Base.UnknownError'));
      this.refreshVIsGameFirstRecharged();
    } else {
      //   app

      openAppH5LinkPreferLocal(
        getActivityPayForOnePrice(
          activityId,
          ('gamehall_ffbutton_' + this.from) as any
        ),
        {}
      );
    }

    this.emitDlgVisible(false);
  }
}
</script>
@/constants/APP_SCHEMA_URLS@/constants/APP_SCHEMA_URLS
