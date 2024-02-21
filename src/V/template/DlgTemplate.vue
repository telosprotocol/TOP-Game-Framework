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
        class="relative w-[280px] rounded-md pb-5 bg-white text-[#333] tz-transel-scaleInOut"
      >
        <div class="flex items-center justify-center flex-col mx-6 pt-6">
          <h3 class="robot-bold text-base mb-3">Title</h3>
          <div class="text-[#666] text-sm mb-4">Descriptions</div>
          <button
            class="bg-[#9946DC] text-white text-sm w-full h-[44px] rounded-full active:scale-95"
            @click="onOkClicked"
          >
            ButtonConfirm
          </button>
        </div>
        <!-- CloseButton -->

        <!-- <button
            @click="onCloseClicked"
            class="absolute right-0 -top-0 -translate-y-full iconfont icon-close-circle text-white opacity-90 text-3xl active:scale-95"
          ></button> -->

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
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Toast } from 'vant';
import { Watch } from 'vue-property-decorator';
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
@Component({
  components: {},
})
export default class DlgTemplate extends mixins(BaseDlgMixin) {
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
    // closeDlg
    this.emitDlgVisible(false);
  }
  //#endregion

  onOkClicked() {
    Toast('TODO: ??');
  }
}
</script>
