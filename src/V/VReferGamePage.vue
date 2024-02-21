<template>
  <div class="bg-gradient-to-r from-[#EA4128] to-[#EA6029] h-screen">
    <div class="flex flex-col min-h-screen overflow-auto">
      <HeaderTop
        left-icon="icon-back"
        skin="dark"
        bar-background="linear-gradient(to right,#EA4128 0%,#EA6029 100%)"
      >
        {{ $t('VRG.title') }}
        <button
          class="iconfont icon-share-fill active:scale-95 opacity-50 mr-2"
          slot="right"
          @click="onShareRedirectClick"
        ></button>
        <button
          class="iconfont icon-question opacity-50 active:scale-95"
          slot="right"
          @click="onRuleClick"
        ></button>
      </HeaderTop>
      <ReferGameFlipBlock class="mb-3"></ReferGameFlipBlock>
      <ReferGameTask class="flex-1"></ReferGameTask>
      <portal to="modal">
        <ReferGameRuleDlg
          :spend-threshold="spendThreshold"
          v-model="isRuleShow"
        ></ReferGameRuleDlg>
      </portal>
      <VTaskLogicGlobal></VTaskLogicGlobal>
    </div>
  </div>
</template>

<script lang="ts">
import HeaderTop from '@/components/HeaderTop/index.vue';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import StatusBarMixin from '@/mixins/StatusBarMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
import { tryMergeLocalesForVPrjReferGame } from '@/locales/Page/VPrj/VRG/init';
import ReferGameFlipBlock from '../modules/ReferGame/ReferGameFlipBlock.vue';
import ReferGameRuleDlg from '@/modules/ReferGame/ReferGameRuleDlg.vue';
import ReferGameTask from '@/modules/ReferGame/ReferGameTask.vue';
import VTaskLogicGlobal from '@/modules/VTask/VTaskLogicGlobal.vue';
import ButtonLockController from '../controller/ButtonLockController';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/index';
import { ROUTEPATH_V_PROMOTE_SHARE } from '@/constants/localRoutePath';
import { GameInviteFlipCardMixin } from '@/modules/ReferGame/GameInviteFlipCard.state';

tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjReferGame();

@Component({
  components: {
    HeaderTop,
    ReferGameFlipBlock,
    ReferGameRuleDlg,
    ReferGameTask,
    VTaskLogicGlobal,
  },
})
export default class VGameRefer extends mixins(
  BindEventMixinDefault,
  StatusBarMixin,
  GameInviteFlipCardMixin
) {
  /**
   *   statusBar
   */
  statusBarColor = '#EA4128';
  useInited() {
    this.$tracev('gamehall_invite_gift_exposure');
    return () => {};
  }

  get spendThreshold() {
    return this.GameInviteFlipCard?.spendThreshold;
  }
  //#region  ruleDlg
  isRuleShow = false;
  onRuleClick() {
    this.isRuleShow = true;
    this.$tracev('click_gamehall_invite_gift_explain');
  }
  //#endregion

  onShareRedirectClick() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    this.$tracev('click_gamehall_invite_gift_sharelink');
    openAppH5LinkPreferLocal(ROUTEPATH_V_PROMOTE_SHARE, {});
  }
}
</script>
