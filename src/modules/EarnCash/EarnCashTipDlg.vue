<template>
  <transition name="tz-transwrap">
    <div
      class="tz-modal tz-transwrap-scale flex items-center justify-center"
      v-if="value"
      v-bind="$attrs"
    >
      <div class="tz-modal_mask" @click="onCloseClicked"></div>

      <div
        class="relative w-[336px] rounded-md bg-white text-[#333] tz-transel-scaleInOut"
      >
        <div class="flex items-center justify-center flex-col mx-6 py-4">
          <h3 class="robot-bold text-[18px] mb-6">
            {{ $t('VEC.EarnCash') }}
          </h3>
          <div class="text-[#333] text-base mb-6 text-center font-rubik px-4">
            {{ $t('VEC.CompleteDailyTasks') }}
          </div>
          <button
            class="vbutton font-rubik w-full h-12 active:scale-95 mb-3"
            @click="onOkClicked"
          >
            {{ $t('Base.OK') }}
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
import { Watch } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class EarnCashTipDlg extends mixins(PopupMixin) {
  //#region Dlg Basic Setting

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$trace('earn_entrance_makemoney_popup_exposure');
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
    this.$trace('click_earn_entrance_makemoney_popup');
    this.emitDlgVisible(false);
  }
}
</script>
