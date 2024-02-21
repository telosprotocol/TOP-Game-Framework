<template>
  <transition name="tz-transwrap">
    <div class="tz-modal tz-transwrap-scale" v-show="value" v-bind="$attrs">
      <div class="tz-modal_mask"></div>
      <!-- Dlg Container: FullScreen -->
      <div
        class="absolute inset-0 flex items-center justify-center tz-transel-scaleInOut"
      >
        <!-- DlgContent Include bg -->
        <main
          class="relative text-[#333333] bg-center bg-no-repeat bg-contain"
          :style="
            $ss.getters.normalizeCss(
              {
                width: 564 / 2,
                height: 748 / 2,
                paddingTop: 124,
                paddingLeft: 21,
                paddingRight: 21,
              },
              $ss.getters.translateImage({
                en: require('@/assets/withdraw/smallWithdrawSuccess-en.png'),
                id: require('@/assets/withdraw/smallWithdrawSuccess-id.png'),
              })
            )
          "
        >
          <button
            @click="onCloseClicked"
            class="absolute right-2 top-6 -translate-y-full w-6 h-6 bg-contain bg-center bg-no-repeat active:scale-95"
            v-webp="require('@/assets/vcommon/close/btnSimpleClose.png?webp')"
          ></button>
          <div
            class="text-center text-xl leading-6 font-robot-medium font-medium text-[#533695]"
          >
            <div>
              {{ $t('VGW.smallSuccessTip1') }}
            </div>
            <div>{{ $t('VGW.smallSuccessTip2') }}</div>
          </div>
          <button
            class="bg-gradient-to-b from-[#B799F8] to-[#7D5BF6] text-white text-xl font-bold font-rubik w-full h-10 rounded-full active:scale-95 mb-1"
            :style="
              $ss.getters.normalizeCss({
                marginTop: 66,

                boxShadow:
                  '0px -3px 0px 0px rgba(109, 74, 229, 1) inset,  0 4px 6px -1px rgba(153,0,255,0.25), 0 2px 4px -2px  rgba(153,0,255,0.25)',
              })
            "
            @click="onContinueClick"
          >
            {{ $t('VGW.joinImm') }}
          </button>
          <button
            @click="onTryAgain"
            class="font-rubik text-center text-[#999] p-2 mx-auto block"
          >
            {{ $t('VGW.tryAgainLater') }}
          </button>
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
import { Prop, Watch } from 'vue-property-decorator';
import { formatVRp } from '../vFormatter';
import { openAppH5LinkPreferLocal } from '@/utils/navigator';

import { close_bridge } from '@/js_bridge/js_call_app_base';
import { APP_ROUTE_TAB_GAME } from '@/constants/APP_SCHEMA_URLS';

@Component({
  components: {},
})
export default class VGoldWithdrawOKDlgForSmall extends mixins(PopupMixin) {
  @Prop({
    type: Number,
  })
  realDrawNum?: number;

  @Prop({
    type: String,
  })
  from?: string;

  get txtRealDrawRp() {
    if (this.realDrawNum == null) {
      return '-';
    }
    return formatVRp(this.realDrawNum);
  }
  //#region Dlg Basic Setting

  // remove if not used
  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$trace('small_withdrawal_success_exposure');
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$emit('close');
    this.emitDlgVisible(false);
  }

  //#endregion

  onTryAgain() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$trace('click_entrance_smallwithdraw_later');
    close_bridge();
    // this.emitDlgVisible(false);
  }
  onContinueClick() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$trace('click_entrance_smallwithdraw_playgame');
    //
    openAppH5LinkPreferLocal(APP_ROUTE_TAB_GAME, {});
  }
}
</script>
@/constants/APP_SCHEMA_URLS
