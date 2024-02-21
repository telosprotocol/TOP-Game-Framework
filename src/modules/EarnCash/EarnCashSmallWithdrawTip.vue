<template>
  <transition name="tz-transwrap">
    <div
      class="tz-modal tz-transwrap-scale flex items-center justify-center"
      v-if="value"
      v-bind="$attrs"
    >
      <div class="tz-modal_mask" @click="onCloseClicked"></div>

      <div
        class="relative w-[336px] rounded-md pb-4 bg-gradient-to-b from-[#8153DD] via-[#FFFFFF] to-[#FFFFFF] text-[#333] tz-transel-scaleInOut"
      >
        <div class="flex items-center justify-center flex-col mx-6 pt-5">
          <div
            class="bg-contain bg-center mx-auto mb-5"
            :style="
              $ss.getters.normalizeCss(
                {
                  width: 228,
                  height: 159,
                },
                require('@/assets/withdraw/iconWithdraw.png?webp'),
                true
              )
            "
          ></div>
          <div
            class="text-[#4659E5] text-xl text-center font-medium font-rubik mb-4"
          >
            {{ $t('VEC.withdrawNow') }}
          </div>
          <div
            class="text-[#333] text-base mb-8 text-center font-rubik px-4 leading-tighth"
          >
            {{ $t('VEC.smallWithdrawTip', [txtMoney]) }}
          </div>
          <button
            class="vbutton font-rubik w-full h-12 active:scale-95 mb-3"
            @click="onOkClicked"
          >
            {{ $t('VEC.withdrawNow') }}
          </button>
        </div>
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
import { Watch } from 'vue-property-decorator';
import { goToGoldWithdraw } from '../vRedirect';
import { Prop } from 'vue-property-decorator/lib/decorators/Prop';
import { close_bridge } from '@/js_bridge/js_call_app_base';

@Component({
  components: {},
})
export default class EarnCashSmallWithdrawTip extends mixins(PopupMixin) {
  @Prop({
    type: String,
  })
  txtMoney: string;
  //#region Dlg Basic Setting

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$trace('earn_entrance_smallwithdraw_popup_exposure');
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
    this.$trace('click_earn_entrance_smallwithdraw_popup');
    this.emitDlgVisible(false);
    goToGoldWithdraw('VEarnCash_new', false);
    setTimeout(() => {
      close_bridge();
    });
  }

  // onCancelClick() {
  //   this.$trace('click_earn_entrance_smallwithdraw_notnow');
  //   this.emitDlgVisible(false);
  // }
}
</script>
