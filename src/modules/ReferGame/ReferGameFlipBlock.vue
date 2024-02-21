<template>
  <div class="text-white">
    <section
      class="bg-gradient-to-r from-[rgba(255,255,255,0.05)] via-[rgba(255,255,255,0.3)] to-[rgba(255,255,255,0.05)] h-20 flex items-center justify-center robot-medium text-center text-white text-xs mb-3"
    >
      <div v-for="(item, idx) in topRewardList" :key="idx" class="mx-3">
        <div
          class="bg-contain bg-center bg-no-repeat -mt-4"
          :style="
            $ss.getters.convertBgImageStyle(
              item.icon,
              true,
              $ss.getters.designPxsObjToReal({ width: 75, height: 74 })
            )
          "
        ></div>
        <div class="-mt-4">{{ item.title }}</div>
      </div>
    </section>
    <section class="mx-3">
      <h3 class="font-rubik font-bold text-base">
        <div
          class="vgradient-text-outline"
          :data-text="flipTitle"
          :style="{
            '--v-color-from': '#FFFFD0',
            '--v-color-to': '#F5BE36',
            '--v-shadow-from': '#CC3900',
            '--v-shadow-to': '#CC3900',
            '--v-shadow-y': '3px',
            '--v-shadow-x': '0',
          }"
        >
          {{ flipTitle }}
        </div>
      </h3>
      <div class="text-xs mb-1">
        {{
          $t('VRG.flipDesc', { inviteNum: inviteNum == null ? '' : inviteNum })
        }}
      </div>
      <AsyncStatus color="#fff" :status="status" @retry="onRetry"></AsyncStatus>
      <div class="relative">
        <ReferGameCardFlip
          ref="cardFlip"
          :card-list="flipList"
          @cardClick="onCardClick"
          class="-mx-2"
          v-if="status === 'ok'"
        ></ReferGameCardFlip>
        <VHandGuide
          v-if="hasChance && showGuide"
          class="-translate-x-1/2 top-1/2"
          :style="{ left: '54%' }"
        ></VHandGuide>
      </div>
      <div class="flex items-center justify-between">
        <div
          class="bg-[rgba(255,255,255,0.2)] rounded-full h-10 min-w-[140px] flex items-center justify-between pl-2.5 pr-1.5"
        >
          <div
            class="bg-contain bg-center bg-no-repeat mr-2 shrink-0"
            :style="
              $ss.getters.convertBgImageStyle(
                require('@/assets/referGame/cardBg.png?webp'),
                true,
                $ss.getters.designPxsObjToReal({
                  width: 22,
                  height: 32,
                })
              )
            "
          ></div>
          <div class="flex-1 text-base font-robot-medium font-medium">
            {{ txtRemainTimes }}
          </div>
          <button
            @click="onInviteClick"
            class="rounded-full bg-[#FF9533] w-8 h-8 shrink-0 text-white iconfont icon-plus text-xl active:scale-95"
          ></button>
        </div>
        <button
          class="text-white underline text-sm active:scale-95"
          @click="onOpenInviteDetail"
        >
          {{ $t('VRG.myInvite') }}
        </button>
      </div>
      <portal to="modal">
        <VGameInviteInfoListDlg
          :spend-threshold="spendThreshold"
          v-model="isDlgInviteDetailOpened"
        ></VGameInviteInfoListDlg>
        <VGettedRewardsDlg
          ref="rewardDlg"
          v-model="isRewardShow"
          :rewards="rewardList"
        ></VGettedRewardsDlg>
      </portal>
    </section>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { GameInviteFlipCardMixin } from './GameInviteFlipCard.state';
import BindEventMixinDefault from '../../mixins/BindEventMixin';
import ReferGameCardFlip from './ReferGameCardFlip.vue';
import AsyncStatus from '@/components/NoData/AsyncStatus.vue';
import { MS_SECOND_3, MS_SECOND_5 } from '@/constants/time';
import VGameInviteInfoListDlg from '../GameTask/VGameTaskInvite/VGameInviteInfoListDlg.vue';
import { Toast } from 'vant';
import VGettedRewardsDlg, {
  IVGettedRewardDlgInfo,
} from '../VRewardProps/VGettedRewardsDlg.vue';
import { VInviteMixin } from '../VInvite/VInviteMixin';
import {
  NODEJS_SHARE_NUMBER_REFERGAME,
  NODEJS_SHARE_NUMBER_VGAME,
} from '../../constants/invite';
import { waitShareInfoForGame } from '../VInvite/vInvite';
import ButtonLockController from '@/controller/ButtonLockController';
import { ROUTENAME_INAPP_V_REFER_GAME } from '../../constants/localRoutePath';
import { playInviteFlipCardInviteGiftController } from '@/vservices/client/InviteGiftController';
import VHandGuide from '@/components/VHandGuide.vue';
import { wait } from '@/utils/wait';
import { updateRewardsByPropTypes } from '../VAssetInfo/VAsset.utils';
@Component({
  components: {
    ReferGameCardFlip,
    AsyncStatus,
    VGameInviteInfoListDlg,
    VGettedRewardsDlg,
    VHandGuide,
  },
})
export default class ReferGameFlipBlock extends mixins(
  BindEventMixinDefault,
  GameInviteFlipCardMixin,
  VInviteMixin
) {
  $refs: {
    cardFlip: ReferGameCardFlip;
    rewardDlg: VGettedRewardsDlg;
  };
  useInited() {
    this.refreshGameInviteFlipCard();

    const clearInvite = this.initInviteByTp(
      [NODEJS_SHARE_NUMBER_VGAME],
      waitShareInfoForGame
    );
    return () => {
      clearInvite();
    };
  }
  get spendThreshold() {
    return this.GameInviteFlipCard?.spendThreshold;
  }

  get inviteNum() {
    return this.GameInviteFlipCard?.inviteNum;
  }
  //#region
  get topRewardList() {
    return [
      {
        icon: require('@/assets/referGame/coinR.png?webp'),
        title: this.$t('V.Coin'),
      },
      {
        icon: require('@/assets/referGame/dstR.png?webp'),
        title: this.$t('V.DST'),
      },
      {
        icon: require('@/assets/referGame/dataCard.png?webp'),
        title: this.$t('VRG.dataCard'),
      },
    ];
  }
  //#endregion

  get flipTitle() {
    return this.$t('VRG.flipTitle');
  }
  //#region List

  get flipList() {
    return this.GameInviteFlipCard?.items || [];
  }

  get hasChance() {
    return Number(this.GameInviteFlipCard?.remainTimes) > 0;
  }

  showGuide = true;

  get status() {
    return this.stateItemGameInviteFlipCardRef.status;
  }
  onRetry() {
    this.refreshGameInviteFlipCard(MS_SECOND_3);
  }
  //#endregion
  //#region
  /**
   *
   */
  isDlgInviteDetailOpened = false;

  onOpenInviteDetail() {
    this.$tracev('click_gamehall_invite_gift_meinvite');
    this.isDlgInviteDetailOpened = true;
  }

  get txtRemainTimes() {
    const remainTimes = this.GameInviteFlipCard?.remainTimes;
    if (remainTimes != null) {
      return remainTimes;
    }
    return remainTimes;
  }

  //#endregion

  //#region
  onInviteClick() {
    if (!ButtonLockController.Instance.tryGetNormalLock()) {
      return;
    }
    this.$tracev('click_gamehall_invite_plus_sharelink');
    this.onQuickShareClick(
      {
        shareNumber: NODEJS_SHARE_NUMBER_REFERGAME,
        traceParams: {
          share_type: ROUTENAME_INAPP_V_REFER_GAME,
          share_initialfrom: 'refergame',
          pkg_name: 'vGame',
        },
      },
      waitShareInfoForGame
    );
  }
  //#endregion

  //#region
  isRewardShow = false;
  rewardList: IVGettedRewardDlgInfo[] = [];
  isFlotingAnimate = false;
  isFlotingLoading = false;

  /**
   *
   * @param cardIdx the card idx of clicked card position
   */
  async onCardClick(cardIdx: number) {
    const GameInviteFlipCard = this.GameInviteFlipCard;
    if (!GameInviteFlipCard) {
      return false;
    }
    if (this.isFlotingAnimate) {
      return;
    }
    this.showGuide = false;
    this.$tracev('close_gamehall_invite_gift_flop');
    this.isFlotingAnimate = true;
    const res = await playInviteFlipCardInviteGiftController({
      timeout: MS_SECOND_5,
    });
    if (!res.success) {
      // this.$tracev('higgs_coin_flop_numberlow_exposure', {
      //   flop_content: res.Reason,
      // });
      Toast(res.message);
      this.isFlotingAnimate = false;
    } else {
      await this.$refs.cardFlip.startPlay(res.data, cardIdx);
      this.isFlotingAnimate = false;
      this.isFlotingLoading = true;
      const item = GameInviteFlipCard.items.find(
        (item) => item.idx === res.data
      );
      this.$tracev('gamehall_invite_gift_flop_result_exposure', {
        flop_coin: item.propNum + '',
      });
      this.rewardList = [
        {
          icon: item.propProduct?.imageUrl,
          num: Number(item.propNum),
        },
      ];
      this.isRewardShow = true;
      await this.$refs.rewardDlg.waitDlgClose();
      await wait(500);

      await this.refreshGameInviteFlipCard(0);
      updateRewardsByPropTypes('GOLD');
      this.$refs.cardFlip.reset();
    }
  }
  //#endregion
}
</script>
