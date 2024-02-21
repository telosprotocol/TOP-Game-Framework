<template>
  <transition name="tz-transwrap">
    <div
      class="tz-modal tz-transwrap-scale flex items-center justify-center"
      v-if="value"
      v-bind="$attrs"
    >
      <div class="tz-modal_mask"></div>
      <!-- Dlg Container: FullScreen -->

      <!-- DlgContent Include bg -->
      <div
        class="relative w-80 p-2 pt-2 pb-6 bg-gradient-to-b from-[#AA76F1] to-[#8153DD] text-[#333333] rounded-xl tz-transel-scaleInOut"
      >
        <h3 class="font-rubik font-bold text-base mb-2 text-white text-center">
          Title
        </h3>
        <main
          class="rounded-xl bg-[#FFFFFF] px-3 pt-1 pb-3 text-[14px] text-[#A874F0]"
        >
          <div
            class="px-1.5 pb-1 text-center mb-4 robot italic font-extrabold text-[#777]"
          >
            Description
          </div>

          <div class="flex items-center justify-between">
            <button
              @click="onCancelClick"
              class="flex-1 h-10 flex items-center justify-center mr-2 font-rubik font-bold text-white text-[18px] active:scale-95 bg-gradient-to-r from-[#FFA487] to-[#FF6969] rounded-[10px]"
            >
              {{ $t('Base.Cancel') }}
            </button>
            <button
              class="flex-1 h-10 flex items-center justify-center mr-2 font-rubik font-bold text-white text-[18px] active:scale-95 bg-gradient-to-r from-[#75FF69] to-[#18A336] rounded-[10px]"
              @click="onOKClick"
            >
              {{ $t('Base.OK') }}
            </button>
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
import { Watch } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class DlgConfirmTemplate extends mixins(PopupMixin) {
  //#region Dlg Basic Setting

  // remove if not used
  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      // do something like trace
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    // closeDlg
    this.emitDlgVisible(false);
  }
  //#endregion

  onOKClick() {
    this.$emit('ok');
    this.emitDlgVisible(false);
  }
  onCancelClick() {
    this.$emit('cancel');
    this.emitDlgVisible(false);
  }
}
</script>
