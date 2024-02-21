<template>
  <transition name="tz-transwrap" :duration="250">
    <div class="tz-modal" v-show="value" v-bind="$attrs">
      <!-- Dlg Container: FullScreen -->
      <div
        class="absolute inset-0 flex items-center justify-center tz-transel-scaleInOut"
      >
        <div
          class="w-80 px-2 py-2.5 bg-gradient-to-b from-[#FC6F3D] to-[#D22D23] rounded-xl relative"
        >
          <button
            class="absolute -top-3 -right-2 -translate-y-full w-[30px] h-[30px] bg-contain bg-center bg-no-repeat active:scale-95"
            @click="onCloseClicked"
            v-webp="require('@/assets/vcommon/close/btnRedClose.png?webp')"
          ></button>

          <!-- Title -->
          <div
            class="robot-bold text-white text-xl leading-none flex items-center justify-center pb-2"
          >
            <div class="iconfont icon-warning mr-2"></div>
            <div>{{ $t('VRW.needBindTitle') }}</div>
          </div>
          <main class="bg-white rounded-xl py-5 px-4">
            <div class="mb-8 text-center robot-medium text-base text-[#DC1D1D]">
              {{ $t('VRW.needBindDesc') }}
            </div>

            <button
              class="vbutton vbutton--red font-rubik w-full h-12"
              @click="onOkClicked"
            >
              {{ $t('VRW.needBindButtonText') }}
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
export default class VRightNeedBindDlg extends mixins(PopupMixin) {
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
    this.$trace('click_me_wallet_exchange_bindphone');

    this.emitDlgVisible(false);
  }
  //#endregion

  onOkClicked() {
    if (!ButtonLockController.Instance.tryGetNormalLock()) {
      return;
    }
    this.$trace('click_me_wallet_exchange_bindphone');
    this.$emit('ok');
    this.emitDlgVisible(false);
  }
}
</script>
