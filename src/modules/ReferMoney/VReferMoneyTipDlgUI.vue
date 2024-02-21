<template>
  <transition name="tz-transwrap">
    <div
      class="tz-modal tz-transwrap-scale flex items-center justify-center"
      v-if="value"
      v-bind="$attrs"
    >
      <div class="tz-modal_mask"></div>

      <!-- DlgContent Include bg -->
      <div class="relative max-h-screen tz-transel-scaleInOut">
        <button
          @click="onCloseClicked"
          class="absolute z-10 right-1 -top-2 -translate-y-full w-9 h-9 rounded-full border-[2px] border-solid border-[#FFF383] bg-[#89383B] text-[white] active:scale-95"
        >
          <ib class="iconfont icon-close text-3xl leading-none"></ib>
        </button>
        <main
          class="relative w-[336px] rounded-md bg-[#FFFDF6] text-black border-[#F1CF84] border-solid border-[2px] overflow-auto pb-5"
        >
          <div
            class="bg-contain mx-auto my-4"
            :style="
              $ss.getters.normalizeCss(
                { width: 172 / 2, height: 162 / 2 },
                require('@/assets/referMoney/iconTip.png?webp'),
                true
              )
            "
          ></div>
          <div class="max-h-[400px] overflow-auto bg-[#FFFDF6]">
            <div class="flex flex-col items-center justify-center mx-7">
              <slot></slot>
            </div>
          </div>
        </main>
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
export default class VReferMoneyTipDlgUI extends mixins(PopupMixin) {
  //#region Dlg Basic Setting

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    // closeDlg
    this.emitDlgVisible(false);
  }
  //#endregion
}
</script>
