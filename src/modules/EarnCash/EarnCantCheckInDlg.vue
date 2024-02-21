<template>
  <transition name="tz-transwrap">
    <div
      class="tz-modal tz-transwrap-scale flex items-center justify-center"
      v-if="value"
      v-bind="$attrs"
    >
      <div class="tz-modal_mask" @click="onCloseClicked"></div>

      <div
        class="relative w-[280px] rounded-md pb-3 bg-gradient-to-b from-[#FFFEFA] to-[#FFF4D2] text-[#333] tz-transel-scaleInOut"
      >
        <div class="flex items-center justify-center flex-col mx-6 pt-6">
          <h3 class="robot-bold text-[18px] mb-4">{{ $t('Base.Tips') }}</h3>
          <div
            class="text-[#666] text-sm mb-4 text-center vgradient-text font-rubik font-medium px-4"
            :style="{ '--v-color-from': '#C32907', '--v-color-to': '#901203' }"
          >
            {{ $t('VEC.PlayTwoGames') }}
          </div>
          <button
            class="bg-gradient-to-b from-[#FF7074] to-[#FA0C21] shadow-md shadow-[#FF7074] text-white text-base font-semibold font-rubik w-full h-[44px] rounded-full active:scale-95 mb-2"
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
import { navigation } from '@/js_bridge/js_call_app_base';
import { APP_ROUTE_TAB_GAME } from '@/constants/APP_SCHEMA_URLS';

@Component({
  components: {},
})
export default class EarnCantCheckInDlg extends mixins(PopupMixin) {
  //#region Dlg Basic Setting

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$trace('earn_entrance_signin_popup_exposure');
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
    this.$trace('click_earn_entrance_signin_popup');
    this.emitDlgVisible(false);
    navigation({
      url: APP_ROUTE_TAB_GAME,
    });
  }
}
</script>
@/constants/APP_SCHEMA_URLS
