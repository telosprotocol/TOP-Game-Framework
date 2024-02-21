<template>
  <div
    class="h-screen flex flex-col relative overflow-auto"
    :style="{ background: 'linear-gradient(180deg, #A57AFF 0%, #F7F2FF 100%)' }"
  >
    <HeaderTop
      class="z-10"
      left-icon="icon-back"
      skin="dark"
      bar-background="transparent"
    >
      <template slot="right">
        <button
          @click="onOpenIntroDlg"
          class="text-white rounded-l-full font-[600] text-xs px-3 pr-6 h-[26px] bg-[#9A50E0] absolute -right-3"
        >
          {{ $t('VPS.inviteRule') }}
        </button>
      </template>
    </HeaderTop>
    <section class="flex-1 text-white relative z-[1]">
      <!-- Title -->
      <div
        class="mx-auto bg-contain bg-center bg-no-repeat"
        :style="
          $ss.getters.convertBgImageStyle(
            $ss.getters.translateImage({
              en: '/online/promoteShare/title.png?webp',
              id: '/online/promoteShare/title-id.png?webp',
            }),
            true,
            $ss.getters.designPxsObjToReal({
              width: 339,
              height: 37,
            })
          )
        "
      ></div>
      <!-- UpdateDesc -->
      <i18n
        tag="p"
        path="VPS.invitedXUserGetYMoney"
        class="w-full text-white text-[11px] leading-none flex items-center justify-center mb-3"
        :style="
          $ss.getters.designPxsObjToReal({
            height: 22,
            background:
              'linear-gradient(90deg, rgba(126,76,229,0) 0%, rgba(126, 76, 229, 0.76) 21%, rgba(126, 76, 229, 0.76) 50%, rgba(126, 76, 229, 0.76) 81%, rgba(126,76,229,0) 100%)',
          })
        "
      >
        <div class="text-[#FEFF4A] robot-bold mx-0.5">{{ txtTotalNum }}</div>
        <div class="text-[#FEFF4A] robot-bold mx-0.5">
          {{ txtPercent }}
        </div>
      </i18n>
      <!-- InviteCode -->
      <section
        class="flex items-center justify-center bg-contain bg-center bg-no-repeat mx-auto text-[#7C432C] text-sm mb-2"
        @click="onCopyInviteCode"
        :style="
          $ss.getters.convertBgImageStyle(
            '/online/promoteShare/bg_inviteCode.png?webp',
            true,
            $ss.getters.designPxsObjToReal({
              width: 200,
              height: 23,
            })
          )
        "
      >
        {{ $t('VPS.inviteCode') }}:
        <div class="text-center robot-bold ml-2">
          {{ InviteCode }}
        </div>
        <div
          class="iconfont icon-copy2 text-[#71C7FF] text-sm ml-1 leadong-none"
        ></div>
      </section>
      <i18n
        tag="div"
        path="VPS.hasInvitedX"
        class="relative z-10 text-center text-[#7B45CB]"
      >
        <span class="font-bold">{{ txtInvitedNum }}</span>
      </i18n>
      <PromoteSharePostersSwiper></PromoteSharePostersSwiper>
    </section>
    <portal to="modal">
      <PromoteShareIntroDlg v-model="isIntroDlgOpened"></PromoteShareIntroDlg>
    </portal>
  </div>
</template>

<script lang="ts">
import HeaderTop from '@/components/HeaderTop/index.vue';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import StatusBarMixin from '@/mixins/StatusBarMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';

import { tryMergeLocalesForVPrjVPromoteShare } from '@/locales/Page/VPrj/VPS/init';
import { VInviteMixin } from '@/modules/VInvite/VInviteMixin';
import ButtonLockController from '@/controller/ButtonLockController';
import { pasteStr } from '@/js_bridge/js_call_app_base';
import { Toast } from 'vant';
import PromoteShareIntroDlg from '@/modules/PromoteShare/PromoteShareIntroDlg.vue';
import { noop } from 'lodash-es';
import { shareGameInviteController } from '@/vservices/client/GameInviteController';
import PromoteSharePostersForVGame from '@/modules/PromoteShare/PromoteSharePostersForVGame.vue';
tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjVPromoteShare();
@Component({
  components: {
    HeaderTop,
    PromoteShareIntroDlg,
    PromoteSharePostersSwiper: PromoteSharePostersForVGame,
  },
})
export default class VPromoteSharePage extends mixins(
  BindEventMixinDefault,
  StatusBarMixin,
  VInviteMixin
) {
  /**
   *   statusBar
   */
  statusBarColor = '#A57AFF';
  useInited() {
    this.$trace('go_team_promotion_exposure');
    // this.refreshVInviteGame();
    shareGameInviteController().then((res) => {
      if (res.success) {
        this.info = res.data;
      } else {
        Toast(res.message);
      }
    });
    return noop;
  }

  onCopyInviteCode() {
    const InviteCode = this.InviteCode;
    if (!InviteCode) {
      return;
    }
    if (!ButtonLockController.Instance.tryGetLock('copy', 0.2)) {
      return;
    }
    pasteStr({
      content: InviteCode,
    });
    this.$trace('click_promotion_invitecode_copy1', {
      invite_code: InviteCode,
      invite_url: InviteCode,
    });
    Toast(this.$t('Base.CopySucceeded'));
  }

  // onCopyLink() {
  //   const GameInviteUrl = this.GameInviteUrl;
  //   if (!GameInviteUrl) {
  //     return;
  //   }
  //   if (!ButtonLockController.Instance.tryGetLock('copy', 0.2)) {
  //     return;
  //   }
  //   pasteStr({
  //     content: GameInviteUrl,
  //   });
  //   this.$trace('click_promotion_invitecode_copy', {
  //     invite_url: GameInviteUrl,
  //   });
  //   Toast(this.$t('Base.CopySucceeded'));
  // }

  get txtInvitedNum() {
    // return this.$ss.getters.formatFloat(
    //   Number(this.vInviteGame.inviteUserNumber),
    //   {
    //     precision: 0,
    //   }
    // );
    const info = this.info;
    if (!info) {
      return '-';
    }
    return info.directRechargeCount;
  }
  get txtTotalNum() {
    const info = this.info;
    if (!info) {
      return '-';
    }
    return info.nextLevelNeedRechargeUser;
  }

  get txtPercent() {
    const info = this.info;
    if (!info) {
      return '-%';
    }
    return (
      this.$ss.getters.formatFloat(Number(info.nextLevelIncomeRatio) * 100, {
        precision: 2,
        reserveZeroDecimal: false,
      }) + '%'
    );
  }

  info: API.InviteShareVO = null;

  isIntroDlgOpened = false;

  onOpenIntroDlg() {
    this.$trace('click_invite_instructions', { share_type: 'income_share' });
    this.isIntroDlgOpened = true;
  }
}
</script>
