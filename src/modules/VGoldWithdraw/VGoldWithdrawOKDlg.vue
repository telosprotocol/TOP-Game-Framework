<template>
  <transition name="tz-transwrap">
    <div class="tz-modal tz-transwrap-scale" v-show="value" v-bind="$attrs">
      <div class="tz-modal_mask"></div>
      <!-- Dlg Container: FullScreen -->
      <div
        class="absolute inset-0 flex items-center justify-center tz-transel-scaleInOut"
      >
        <!-- DlgContent Include bg -->
        <div
          class="relative w-80 p-2 pt-3 pb-6 bg-gradient-to-b from-[#AA76F1] to-[#8153DD] text-[#333333] rounded-xl"
        >
          <button
            class="absolute right-1 -top-2 -translate-y-full w-[30px] h-[30px] bg-contain bg-center bg-no-repeat active:scale-95"
            @click="onCloseClicked"
            v-webp="require('@/assets/vcommon/close/btnSimpleClose.png?webp')"
          ></button>
          <h3 class="robot-medium text-base mb-1 text-white flex items-center">
            {{ $t('Base.Tips') }}
          </h3>
          <main class="rounded-xl bg-[#FFFFFF] p-3 py-4 text-[14px]">
            <div
              class="bg-contain bg-center bg-no-repeat mx-auto w-16 h-16"
              v-webp="require('@/assets/vcommon/iconRight.png?webp')"
            ></div>
            <div
              class="text-[#333] text-base text-center font-semibold py-5 mb-5"
            >
              {{ $t('VGW.withdrawalApplicationSubmitted') }}
            </div>
            <button
              class="vbutton font-rubik w-full h-12 active:scale-95 mb-3"
              @click="onOkClicked"
            >
              {{ $t('VGW.continueWithdrawal') }}
            </button>
          </main>
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
export default class VGoldWithdrawOKDlg extends mixins(PopupMixin) {
  // @Prop({
  //   type: Number,
  // })
  // realDrawNum?: number;

  // get txtRealDrawRp() {
  //   if (this.realDrawNum == null) {
  //     return '-';
  //   }
  //   return formatVRp(this.realDrawNum);
  // }
  //#region Dlg Basic Setting

  // remove if not used
  // @Watch('value')
  // onValueChange(isShow: boolean) {
  //   if (isShow) {
  //
  //     // this.$trace('address_book_writeauth_exposure', {
  //     //   open_type: from,
  //     // });
  //   }
  // }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$emit('close');

    this.emitDlgVisible(false);
  }
  //#endregion
  onOkClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$emit('close');
    this.emitDlgVisible(false);
  }
}
</script>
