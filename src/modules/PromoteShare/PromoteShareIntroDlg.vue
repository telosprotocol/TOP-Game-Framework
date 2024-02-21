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
          class="relative w-80 rounded-xl p-4 bg-gradient-to-b from-[#AA76F1] to-[#8153DD]"
        >
          <h3 class="text-white robot-medium leading-none text-base mb-3">
            {{ $t('VPS.inviteRule') }}
          </h3>
          <div
            class="rounded-md bg-white flex flex-col p-3 pb-6 text-[#333] text-sm leading-4"
          >
            <h3 class="robot-bold text-base text-[#333] mb-2 text-left">
              {{ $t('VPS.q1') }}
            </h3>
            <p class="mb-2">
              {{ $t('VPS.a1_1') }}
            </p>
            <p>
              {{ $t('VPS.a1_2') }}
            </p>
          </div>
          <!-- CloseButton -->
          <button
            @click="onCloseClicked"
            class="absolute right-1 -top-2 -translate-y-full w-[30px] h-[30px] bg-contain bg-center bg-no-repeat active:scale-95"
            v-webp="require('@/assets/vcommon/close/btnSimpleClose.png?webp')"
          ></button>
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
import { Watch } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class PromoteShareIntroDlg extends mixins(PopupMixin) {
  //#region Dlg Basic Setting

  // remove if not used
  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$trace('invite_instructions_exposure', {
        share_type: 'income_share',
      });
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$trace('close_invite_instructions', {
      share_type: 'income_share',
    });

    this.emitDlgVisible(false);
  }
  //#endregion
}
</script>
