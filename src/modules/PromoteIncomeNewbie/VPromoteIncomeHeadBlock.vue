<template>
  <div>
    <div
      class="relative z-0"
      :style="$ss.getters.designPxsObjToReal({ height: 298 })"
    >
      <div
        class="absolute bottom-0 bg-contain bg-no-repeat bg-center z-0"
        :style="headBgStyle"
      ></div>
      <h3 class="font-rubik font-bold text-[#333] text-xl ml-4 mr-6 mb-2">
        {{ $t('VPIN.beGamePartnerTitle') }}
      </h3>
      <button
        class="bg-gradient-to-bl from-[#5F0ABF] to-[#B07BFA] p-2 pl-3 text-white font-rubik font-bold absolute right-0 rounded-l-md box-content leading-[14px]"
        @click="onOpenDlg"
        v-if="hasInviteCodeButton"
        :style="$ss.getters.designPxsObjToReal({ width: 69 })"
      >
        {{ $t('VPIN.bindBtnText') }}
      </button>
      <portal to="modal">
        <VPromoteIncomeInviteCodeDlg
          @bindOK="onBindOK"
          v-model="isDlgShow"
        ></VPromoteIncomeInviteCodeDlg>
      </portal>
    </div>
    <div
      class="bg-no-repeat bg-center bg-contain mx-auto relative z-[1]"
      :style="
        $ss.getters.convertBgImageStyle(
          $ss.getters.translateImage({
            en: '/online/playIncomeN/headBlock-en.png?webp',
            id: '/online/playIncomeN/headBlock-id.png?webp',
          }),
          true,
          $ss.getters.designPxsObjToReal({
            width: 326,
            height: 212,
            marginTop: -5,
          })
        )
      "
    ></div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import VPromoteIncomeInviteCodeDlg from './VPromoteIncomeInviteCodeDlg.vue';
import { mixins } from 'vue-class-component';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { noop } from 'lodash-es';
import { VInviteGameMixin } from './VInviteGame.state';
@Component({
  components: { VPromoteIncomeInviteCodeDlg },
})
export default class VPromoteIncomeHeadBlock extends mixins(
  BindEventMixinDefault,
  VInviteGameMixin
) {
  useInited() {
    this.$nextTick(() => {
      this.startShowBg = true;
    });
    this.refreshVInviteGame();
    return noop;
  }
  isDlgShow = false;

  get hasInviteCodeButton() {
    if (!this.InviteGameInfo) {
      return false;
    }
    return !this.InviteGameInfo.inviterUserId;
  }

  startShowBg = false;
  get headBgStyle() {
    if (this.startShowBg) {
      return this.$ss.getters.convertBgImageStyle(
        '/online/playIncomeN/head.png?webp',
        true,
        this.$ss.getters.designPxsObjToReal({
          width: 304,
          height: 247,
          left: 33,
        })
      );
    } else {
      return {};
    }
  }

  onOpenDlg() {
    this.isDlgShow = true;
    this.$trace('click_promotion_invite_write');
  }

  onBindOK() {
    this.InviteGameInfo.inviterUserId = ' ';
    this.refreshVInviteGame(0);
  }
}
</script>
