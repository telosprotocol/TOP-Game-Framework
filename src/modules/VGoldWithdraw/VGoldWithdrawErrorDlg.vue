<template>
  <transition name="tz-transwrap">
    <div
      class="tz-modal tz-transwrap-scale flex items-center justify-center"
      v-if="value"
      v-bind="$attrs"
    >
      <div class="tz-modal_mask"></div>

      <!-- DlgContent Include bg -->
      <div
        class="relative w-[336px] rounded-md pb-5 bg-white text-[#333] tz-transel-scaleInOut"
      >
        <div class="flex items-center justify-center flex-col mx-6 pt-2">
          <div
            class="bg-contain bg-center bg-no-repeat"
            :style="
              $ss.getters.convertBgImageStyle(
                require('@/assets/vcommon/iconAlert.png?webp'),
                true,
                $ss.getters.designPxsObjToReal({ width: 98, height: 98 })
              )
            "
          ></div>
          <div class="text-[#666] text-base mx-6 text-center mb-4">
            {{ msg }}
          </div>
          <button
            class="bg-[#9946DC] text-white text-sm w-full h-[44px] rounded-full active:scale-95"
            @click="onOkClicked"
          >
            {{ btnText }}
          </button>
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
import { Prop } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class VGoldWithdrawErrorDlg extends mixins(PopupMixin) {
  @Prop({
    type: String,
  })
  btnText: string;

  @Prop({
    type: String,
  })
  msg: string;

  @Prop({
    type: Function,
  })
  dealClose: () => void;
  //#region Dlg Basic Setting

  // @Watch('value')
  // onValueChange(isShow: boolean) {
  //   if (isShow) {
  //   }
  // }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    // closeDlg
    this.emitDlgVisible(false);
  }
  //#endregion

  onOkClicked() {
    if (!ButtonLockController.Instance.tryGetLock('withdrawError', 0.5)) {
      return;
    }
    if (this.dealClose) {
      this.dealClose();
    }
    this.emitDlgVisible(false);
  }
}
</script>
