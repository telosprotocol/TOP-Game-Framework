<template>
  <div class="px-2 pb-4">
    <h3 class="flex items-center robot-bold text-base mb-1">
      <div
        class="bg-contain bg-center bg-no-repeat mr-1 w-12 h-12"
        :style="
          $ss.getters.convertBgImageStyle(
            require('@/assets/referMoney/iconInvite1.png?webp'),
            true
          )
        "
      ></div>
      <div class="flex-1">
        {{ $t('VRM.howToEarn') }}
      </div>
      <button
        class="text-[#FF8718] pl-3 active:scale-95"
        @click="onTipDlgOpenClick"
      >
        <ib class="iconfont icon-question"></ib>
      </button>
    </h3>
    <section class="mx-2 mb-3">
      <div
        class="mx-auto bg-contain bg-center bg-no-repeat"
        @click="onTipDlgOpenClick"
        :style="
          $ss.getters.convertBgImageStyle(
            require('@/assets/referMoney/imgInviteDesc1.png?webp'),
            true,
            $ss.getters.designPxsObjToReal({
              width: 518 / 2,
              height: 156 / 2,
            })
          )
        "
      ></div>
      <div
        class="flex justify-between robot-medium text-[#8E4431] text-xs mx-3"
      >
        <div class="flex-1 text-center">{{ $t('VRM.step1') }}</div>
        <div class="flex-1 text-center mx-1">{{ $t('VRM.step2') }}</div>
        <div class="flex-1 text-center">{{ $t('VRM.step3') }}</div>
      </div>
    </section>
    <h3 class="flex items-center robot-bold text-base mb-1">
      <div
        class="bg-contain bg-center bg-no-repeat mr-1 w-12 h-12"
        :style="
          $ss.getters.convertBgImageStyle(
            require('@/assets/referMoney/iconInvite2.png?webp'),
            true
          )
        "
      ></div>
      <div class="flex-1">
        {{ $t('VRM.inviteRewards') }}
      </div>
    </h3>
    <div
      class="bg-contain bg-center bg-no-repeat mx-auto"
      :style="
        $ss.getters.normalizeCss(
          { width: 260, height: 144 },
          $ss.getters.translateImage({
            en: require('@/assets/referMoney/imgInviteDesc2-en.png'),
            id: require('@/assets/referMoney/imgInviteDesc2-id.png'),
          })
        )
      "
    ></div>
    <portal to="modal">
      <VReferMoneyInviteStepDlg v-model="showTipDlg"></VReferMoneyInviteStepDlg>
    </portal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import VReferMoneyInviteStepDlg from './VReferMoneyInviteStepDlg.vue';
@Component({
  components: { VReferMoneyInviteStepDlg },
})
export default class VReferMoneyInviteTab extends Vue {
  showTipDlg = false;

  onTipDlgOpenClick() {
    this.showTipDlg = true;
  }
}
</script>
