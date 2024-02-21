<template>
  <transition name="tz-transwrap">
    <div
      class="tz-modal tz-transwrap-scale flex items-center justify-center"
      v-if="value"
      v-bind="$attrs"
    >
      <div class="tz-modal_mask"></div>

      <div
        class="relative w-[266px] rounded-xl p-2 pt-10 bg-gradient-to-b from-[#AB9CFF] to-[#CBDEFC] tz-transel-scaleInOut"
      >
        <div
          class="absolute z-0 w-40 h-40"
          :style="
            $ss.getters.normalizeCss({
              background:
                'radial-gradient(50% 50% at 50% 50%,#fda7ff 0%,rgba(255, 177, 177, 0) 100%)',
            })
          "
        ></div>
        <div
          class="absolute -right-2 top-0 -translate-y-1/2 bg-contain bg-center bg-no-repeat"
          :style="
            $ss.getters.normalizeCss(
              {
                width: 241,
                height: 156,
              },
              '/online/earnCash/gift2.png?webp',
              true
            )
          "
        ></div>
        <main class="bg-white rounded-xl z-[1] relative">
          <h3
            class="font-rubik font-black text-2xl leading-none text-center -translate-y-1/2 mb-4 text-white vshadow-stroke-2"
            :style="{ '--tw-shadow-color': '#9900FF' }"
          >
            {{ $t('VEC.CheckRewardTip', ['']) }}
          </h3>
          <div class="px-4">
            <div class="flex items-center justify-center flex-col">
              <div
                class="bg-bottom bg-[length:100%_auto] bg-no-repeat"
                :style="
                  $ss.getters.normalizeCss(
                    {
                      width: 128,
                      height: 80,
                    },
                    require('../../assets/earncash/jinbi.png?webp'),
                    true
                  )
                "
              ></div>
              <div
                class="text-[#EE3360] text-4xl leading-none mb-4 text-center font-rubik font-medium"
              >
                Rp{{ txtCoinNum }}
              </div>
            </div>
            <div>
              <button
                class="bg-gradient-to-b from-[#B799F8] to-[#7D5BF6] text-white text-sm font-semibold font-rubik w-full h-10 rounded-full active:scale-95 mb-2"
                :style="{
                  boxShadow:
                    '0px -3px 0px 0px rgba(109, 74, 229, 1) inset,  0 4px 6px -1px rgba(153,0,255,0.25), 0 2px 4px -2px  rgba(153,0,255,0.25)',
                }"
                @click="onOkClicked"
              >
                {{
                  hasWithdraw
                    ? $t('VEC.withdrawSmallX', [smallWithdrawTxt || '300'])
                    : $t('VEC.ToPlayGame')
                }}
              </button>
              <button
                @click="onCancelClick"
                class="font-rubik text-center text-[#999] p-2 mx-auto block"
              >
                {{ $t('VEC.NotNow') }}
              </button>
            </div>
          </div>
        </main>
        <button
          @click="onCloseClicked"
          class="absolute right-1 -top-2 -translate-y-full w-[30px] h-[30px] bg-contain bg-center bg-no-repeat active:scale-95"
          v-webp="require('@/assets/vcommon/close/btnSimpleClose.png?webp')"
        ></button>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Watch, Prop } from 'vue-property-decorator';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/openAppH5LinkPreferLocal';
import { APP_ROUTE_TAB_GAME } from '@/constants/APP_SCHEMA_URLS';
import { formatVGold } from '@/modules/vFormatter';
import { getGoldWithdrawUrl } from '../vRedirect';
@Component({
  components: {},
})
export default class EarnCheckInOkDlg extends mixins(PopupMixin) {
  @Prop({
    type: Number,
  })
  coinNum?: number;

  @Prop({
    type: Boolean,
  })
  hasWithdraw: boolean;

  @Prop({
    type: String,
  })
  smallWithdrawTxt: string;
  get txtCoinNum() {
    if (this.coinNum == null) {
      return '-';
    }

    return formatVGold(this.coinNum);
  }
  //#region Dlg Basic Setting

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      // this.$trace('address_book_writeauth_exposure', {
      //   open_type: from,
      // });
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }

    this.emitDlgVisible(false);
  }
  //#endregion

  onOkClicked() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    this.$trace('click_earn_entrance_signin_playgame', {
      isWithdraw: this.hasWithdraw ? '1' : '0',
    });
    if (this.hasWithdraw) {
      openAppH5LinkPreferLocal(getGoldWithdrawUrl('VEarnCash_checkin'), {});
    } else {
      openAppH5LinkPreferLocal(APP_ROUTE_TAB_GAME, {});
    }
    this.emitDlgVisible(false);
  }
  onCancelClick() {
    this.$trace('click_earn_entrance_signin_notnow');
    this.emitDlgVisible(false);
  }
}
</script>
@/constants/APP_SCHEMA_URLS
