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
          class="relative w-full h-80 bg-top bg-no-repeat bg-contain"
          :style="
            $ss.getters.normalizeCss(
              {
                width: 360,
                height: 338,
              },
              curImage
            )
          "
        >
          <!-- CloseButton -->
          <button
            @click="onCloseClicked"
            class="absolute right-4 top-1.5 w-6 h-6 bg-contain bg-center bg-no-repeat active:scale-95 before:absolute before:inset-0 before:scale-150"
            v-webp="require('@/assets/gameCommon/x2.png?webp')"
          ></button>
          <div
            class="flex"
            :style="
              $ss.getters.normalizeCss({
                height: 60,
                marginTop: 49,
                marginLeft: 56,
                marginRight: 60,
              })
            "
          >
            <div
              v-for="item in [0, 1, 2]"
              :key="item"
              @click="onProductChoose(item)"
              class="flex-1"
            ></div>
          </div>
        </div>
        <button
          class="vbtn-topup active:scale-95 mx-auto -translate-y-full relative block"
          @click="onGoToRecharge"
        >
          <div
            class="text-xs font-rubik font-medium leading-none text-[#196513] mt-1 line-through"
          >
            {{ curOriginPrice }}
          </div>
          <div
            class="text-[15px] font-rubik font-bold -mt-1 vstroke text-white"
            :style="{
              '--tw-stroke-width': '0.5px',
              '--tw-stroke-color': '#196513',
            }"
          >
            {{ curBtnTxt }}
          </div>
        </button>
      </div>
      <div
        v-if="GameFirstTopupDlgImageList"
        class="absolute w-0 h-0 bottom-0 right-0 overflow-hidden"
      >
        <img
          v-for="(item, idx) in GameFirstTopupDlgImageList"
          :key="idx"
          :src="item.url"
        />
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

import { VIsGameFirstRechargedMixin } from './VGameRecharge.state';
// import { tryMergeLocalesForVPrjFFTopup } from '@/locales/Page/VPrj/V_FF/init';
import { Toast } from 'vant';
import { getActivityPayForMultiPrice } from '@/constants/APP_SCHEMA_URLS';
import type { IVTopupSourceType } from '@/constants/APP_SCHEMA_URLS';
import { checkMinVersionName } from '@/store/modules/app/checkMinVersionName';
import { MIN_VERSION_SUPPORT_SEQ } from '@/constants/FEATURE_VERSIONS';
import { waitNextPayActivityEndPromise } from '@/js_bridge/appCallJs/onPayActivityEnd';
// tryMergeLocalesForVPrjFFTopup();
@Component({
  components: {},
})
export default class VGameTopupFirstDiscountV2Dlg extends mixins(
  PopupMixin,
  VIsGameFirstRechargedMixin
) {
  @Prop({
    type: String,
    default: 'gamehall_ffbutton',
  })
  from: IVTopupSourceType;

  dlgSound = true;

  isRealShow = false;

  curProductIdx = 0;

  get curImage() {
    const img = this.GameFirstTopupDlgImageList;
    return img?.[this.curProductIdx]?.url;
  }

  get curOriginPrice() {
    const curItem = this.GameFirstTopupDlgImageList?.[this.curProductIdx];
    if (curItem) {
      return this.$t('Base.xRp', {
        n:
          ' ' +
          this.$ss.getters.formatFloat(
            Number(curItem.givenValue) + Number(curItem.num)
          ) +
          ' ',
      });
    } else {
      return 'Charge';
    }
  }

  get curBtnTxt() {
    const curItem = this.GameFirstTopupDlgImageList?.[this.curProductIdx];
    if (curItem) {
      return this.$t('Base.xRp', {
        n: ' ' + this.$ss.getters.formatFloat(Number(curItem.price)) + ' ',
      });
    } else {
      return 'Charge';
    }
  }

  onProductChoose(idx: number) {
    const item = this.GameFirstTopupDlgImageList?.[idx];
    if (item) {
      this.curProductIdx = idx;
      this.$tracev('click_first_recharge_types_coins', {
        firstrecharge_price: item.price,
      });
    }
  }
  //#region Dlg Basic Setting

  // remove if not used
  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.isOpenedPay = false;
      this.curProductIdx = 0;
    }
    this.isRealShow = isShow;
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close-ff', 0.5)) {
      return;
    }
    this.$tracev('click_close_giftpack', {
      openSource: this.from,
      ui_version: 'v2',
    });

    //   app     

    // if (ButtonLockController.Instance.tryGetNavLock()) {
    //   openAppH5LinkPreferLocal(getVPayUrl('gamehall_ffdlg_close'), {});
    // }
    this.emitDlgVisible(false);
  }
  //#endregion

  /**
   *  
   */
  isOpenedPay: boolean;
  async onGoToRecharge() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    const productItem = this.GameFirstTopupDlgImageList?.[this.curProductIdx];
    if (!productItem) {
      Toast(this.$t('Base.UnknownError'));
      this.refreshVIsGameFirstRecharged();
    } else {
      this.$tracev('click_recharge_giftpack', {
        openSource: this.from,
        recharge_coins: productItem.num + '',
        rechare_price: productItem.price + '',
        ui_version: 'v2',
      });
      this.isOpenedPay = true;
      //  app 
      openAppH5LinkPreferLocal(
        getActivityPayForMultiPrice(
          this.IsGameFirstRechargedInfo.id,
          ('gamehall_ffbutton_' + this.from) as any,
          productItem.price
        ),
        {}
      );
      if (checkMinVersionName(MIN_VERSION_SUPPORT_SEQ)) {
        const payEndRes = await waitNextPayActivityEndPromise();
        if (payEndRes.isRechargeTriggered) {
          this.emitDlgVisible(false);
        }
        return;
      }
    }

    this.emitDlgVisible(false);
  }
}
</script>
@/constants/APP_SCHEMA_URLS@/constants/APP_SCHEMA_URLS
