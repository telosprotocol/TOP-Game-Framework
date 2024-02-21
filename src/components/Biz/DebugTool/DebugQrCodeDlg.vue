<template>
  <transition name="tz-transwrap">
    <div
      class="tz-modal tz-transwrap-scale flex items-center justify-center"
      v-if="value"
      v-bind="$attrs"
    >
      <div class="tz-modal_mask" @click="onCloseClicked"></div>
      <div
        class="relative w-[280px] rounded-md pb-5 bg-white text-[#333] tz-transel-scaleInOut"
      >
        <div class="flex items-center justify-center flex-col mx-2 pt-4">
          <div class="text-[#666] text-sm">
            <VueQrcode
              :value="content"
              :options="{ size: qrcodeWidth }"
            ></VueQrcode>
          </div>
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
import { Prop, Watch } from 'vue-property-decorator';
import VueQrcode from '@xkeshi/vue-qrcode';
@Component({
  components: { VueQrcode },
})
export default class DebugQrCodeDlg extends mixins(PopupMixin) {
  @Prop({
    type: String,
  })
  content: string;
  get qrcodeWidth() {
    return this.$ss.getters.designPxToReal(260);
  }
  //#region Dlg Basic Setting

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }

    this.emitDlgVisible(false);
  }
  //#endregion
}
</script>
