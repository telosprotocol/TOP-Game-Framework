<template>
  <GameDlgUI
    :value="value"
    @input="emitDlgVisible"
    @close="onCloseClicked"
    :img-title="require('@/assets/gameCommon/dlgTitle/Tips.png')"
  >
    <section class="pb-2 px-2.5">
      <p class="text-base my-7 font-bold px-2">
        {{ $t('V_T.noGoldToRecharge') }}
      </p>
      <button
        @click="onGoToRecharge"
        class="vbtn vbtn--yellow active:scale-95 w-full"
      >
        {{ $t('V_T.toRecharge') }}
      </button>
    </section>
  </GameDlgUI>
</template>

<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Prop, Watch } from 'vue-property-decorator';
import { openAppH5LinkPreferLocal } from '@/utils/navigator';
import { getVPayUrl } from '@/constants/APP_SCHEMA_URLS';
import GameDlgUI from '../UI/GameDlgUI.vue';
@Component({
  components: { GameDlgUI },
})
export default class TurntableNoGoldDlg extends mixins(PopupMixin) {
  @Prop({
    type: String,
    required: true,
  })
  type: 'GOLD' | 'DIAMOND';
  //#region Dlg Basic Setting

  dlgSound = true;
  @Watch('value')
  async onValueChange(isShow: boolean) {
    if (isShow) {
      this.$tracev('game_luckywheel_lack_exposure', {
        checkin_tab: this.type,
      });
    }
  }
  onCloseClicked() {
    this.$tracev('close_game_luckywheel_lack', {
      checkin_tab: this.type,
    });
  }
  //#endregion

  onGoToRecharge() {
    if (!ButtonLockController.Instance.tryGetLock('recharge', 1)) {
      return;
    }
    this.$tracev('click_game_luckywheel_topup', {
      checkin_tab: this.type,
    });
    openAppH5LinkPreferLocal(getVPayUrl('game_luckywheel'), {
      checkLogin: {
        traceEvent: 'luckywheel_pay',
      },
    });
  }
}
</script>
@/constants/APP_SCHEMA_URLS
