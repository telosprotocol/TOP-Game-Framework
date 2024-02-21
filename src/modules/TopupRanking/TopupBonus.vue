<template>
  <div class="h-screen relative flex flex-col">
    <div
      class="absolute -z-[1] inset-0 bg-contain bg-center bg-no-repeat"
      :style="
        $ss.getters.normalizeCss(
          {
            height: 944 / 2,
          },
          '/online/topupRanking/bonus/bg.png?webp',
          true
        )
      "
    ></div>
    <HeaderTop
      :disable-debug="true"
      left-icon="icon-back"
      class="shrink-0"
      bar-background="transparent"
    >
      <div
        slot="default"
        class="font-rubik font-medium text-center flex-1 text-[#1D5C9D]"
      >
        {{ $t('VTR.bonusRechargeRank') }}
      </div>
      <div slot="right" class="w-[30px] h-[30px]"></div>
    </HeaderTop>
    <div class="shrink-0 flex flex-col items-center pb-2">
      <!-- TabList -->
      <div class="w-full mt-1.5">
        <section
          class="mx-3 rounded-full flex items-center justify-center font-robot-bold font-bold text-xs p-[3px] bg-[#A3D8F1] text-[#558EC9]"
        >
          <div
            class="flex-1 text-center h-7 flex items-center justify-center relative"
            v-for="tabItem in tabList"
            :class="{
              'bg-gradient-to-b from-[#C054C9] to-[#8A55C9] rounded-full text-white':
                tabItem.idx === 2,
            }"
            :key="tabItem.idx"
            @click="$emit('changeTab', tabItem.idx)"
          >
            {{ tabItem.title }}
            <div
              v-if="tabItem.hasRedDot"
              class="w-2 h-2 box-content border border-solid border-white bg-gradient-to-b from-[#FFAEAE] via-[#F41D1D] to-[#DC0000] rounded-full right-0.5 absolute -top-[1px]"
            ></div>
          </div>
        </section>
      </div>
      <div
        class="bg-contain bg-center bg-no-repeat mx-auto relative z-10"
        :style="
          $ss.getters.normalizeCss(
            {
              width: 254,
              height: 75,
            },
            '/online/topupRanking/bonus/title.png?webp',
            true
          )
        "
      >
        <div
          class="text-[#FFFD1B] text-[11px] font-robot-bold font-bold absolute bottom-4 left-0 right-0 text-center"
        >
          {{ txtDateDuration }}
        </div>
      </div>
      <div
        class="rounded-full bg-black opacity-80 text-white leading-3.5 text-xs font-bold font-robot-bold p-2 pb-0.5 px-3 -mt-2"
      >
        Setiap Top Up Mencapai 50K, Boleh Pecah Telor 1 Kali!
        <div
          class="text-xs text-white leading-tight pt-[3px] scale-90 origin-left flex items-center justify-center"
        >
          <div class="text-[#FF9B00] mr-0.5">Telur Selanjutnya:</div>
          <div>
            <template v-if="SmashEgg">
              <span
                :class="{
                  'text-[#FF3300]': !Number(SmashEgg.rechargeAmount),
                  'text-[#FFFD1B]': !!Number(SmashEgg.rechargeAmount),
                }"
                >{{
                  $ss.getters.formatFloat(Number(SmashEgg.rechargeAmount))
                }} </span
              >/
              {{ $ss.getters.formatFloat(Number(SmashEgg.rewardPhaseAmount)) }}
            </template>
          </div>
        </div>
      </div>
      <div class="relative z-10 w-full flex">
        <div class="w-20 ml-2.5 pt-2.5 flex flex-col">
          <section
            class="rounded-[8px] text-white pt-0.5 pb-1 flex items-center justify-center mb-2"
            :style="
              $ss.getters.normalizeCss({
                width: 73,
                height: 70,
                background:
                  'linear-gradient(to bottom,#AC7AE8 0,#AC7AE8 49%,#69439B 50%,#69439B 100%)',
              })
            "
          >
            <div class="w-full h-full rounded-[8px] bg-[#8A55C9] pt-1">
              <div class="text-[11px] leading-tight text-center">
                Kesempatan Pecah Telor :
              </div>
              <div class="text-2xl text-center font-robot-medium -mt-1">
                {{ leftChance }}
              </div>
            </div>
          </section>
          <section
            class="bg-contain bg-center bg-no-repeat active:scale-95"
            @click="onGoToRechargeClick"
            :style="
              $ss.getters.normalizeCss(
                {
                  width: 73,
                  height: 70,
                },
                '/online/topupRanking/bonus/btnRecharge.png?webp',
                true
              )
            "
          ></section>
        </div>
        <div
          class="flex-1 flex flex-col items-center"
          :style="
            $ss.getters.normalizeCss({
              marginRight: 90,
            })
          "
        >
          <div
            class="relative z-0"
            :style="
              $ss.getters.normalizeCss({
                top: -16,
                width: 354 / 2,
                height: 294 / 2,
              })
            "
          >
            <div
              v-if="mode === 'init' || mode === 'smashing'"
              class="bg-contain bg-center bg-no-repeat absolute inset-0"
              v-webp="'/online/topupRanking/bonus/egg.png?webp'"
            ></div>
            <OpenedEggUI
              v-if="mode === 'smash-end'"
              :image="gettedReward ? gettedReward.imageUrl : null"
            ></OpenedEggUI>
            <div
              class="absolute"
              :style="
                $ss.getters.normalizeCss({
                  width: 121,
                  height: 142,
                  left: 120,
                  top: 10,
                })
              "
            >
              <div
                class="hammer_prepare w-full h-full bg-contain bg-center bg-no-repeat"
                :class="{
                  hammer_start: mode === 'smashing',
                  hammer_prepare: mode !== 'smashing',
                }"
                v-webp="'/online/topupRanking/bonus/hammer.png?webp'"
              ></div>
            </div>
          </div>
          <button
            class="vbtn -mt-8 relative z-20 active:scale-95"
            :class="{
              'vbtn--green': canSmash,
              'vbtn--disable': !canSmash,
            }"
            @click="onSmashClick"
            :style="$ss.getters.normalizeCss({ width: 180 })"
          >
            Pecahkan Telur
          </button>
        </div>
      </div>
    </div>
    <section
      class="bg-gradient-to-b flex-1 from-[#8A53C8] to-[#6F9BF8] rounded-t-2xl px-1.5 relative"
      :style="$ss.getters.normalizeCss({ paddingTop: 30 })"
    >
      <div
        class="absolute left-1/2 -translate-x-1/2 bg-contain bg-center bg-no-repeat -top-2"
        :style="
          $ss.getters.normalizeCss(
            { height: 40, width: 150 },
            '/online/topupRanking/bonus/title_prize_pool.png?webp',
            true
          )
        "
      ></div>
      <div
        class="bg-black bg-opacity-25 rounded-md px-2.5 pt-2 mb-0.5 flex items-center justify-between flex-wrap"
      >
        <div
          v-for="(item, idx) in rewardList"
          :key="idx"
          class="bg-contain bg-center bg-no-repeat shrink-0 mb-2 relative flex flex-col justify-end"
          :style="
            $ss.getters.normalizeCss(
              { width: 155 / 2, height: 143 / 2, paddingBottom: 3 },
              '/online/topupRanking/bonus/block_prize.png?webp',
              true
            )
          "
        >
          <div
            class="bg-contain bg-center bg-no-repeat absolute left-1/2 -translate-x-1/2"
            :style="
              $ss.getters.normalizeCss(
                {
                  width: 59,
                  height: 48,
                  top: 5,
                },
                item.propProduct.imageUrl
              )
            "
          ></div>
          <div
            class="text-[#E36500] text-[11px] font-robot-bold font-bold tz-ellipsis-break-2 text-center overflow-hidden px-2 flex flex-col justify-center relative z-[1]"
            :style="
              $ss.getters.normalizeCss({
                height: 24,
                lineHeight: 12,
              })
            "
          >
            {{ item.propProduct.nameText }}
          </div>
        </div>
        <div
          v-for="idx in 3"
          :key="idx + 's'"
          class="h-0"
          :style="$ss.getters.normalizeCss({ width: 155 / 2 })"
        ></div>
      </div>
      <div class="text-xs text-white leading-tight origin-top-left scale-90">
        * Foto Barang Hanya Contoh, Design dan Warna sesuai ketersediaan saat
        dikirimkan
      </div>
    </section>
    <portal to="modal">
      <BonusGetDlg
        ref="getDlg"
        v-model="isGettedDlgOpen"
        :reward="gettedReward"
      ></BonusGetDlg>
    </portal>
  </div>
</template>
<style lang="less" scoped>
.hammer_prepare {
  animation: 1s hammer_prepare both infinite;
  animation-fill-mode: backwards;
}
@keyframes hammer_prepare {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

.hammer_start {
  animation: 1s hammer_start;
}
@keyframes hammer_start {
  0% {
    transform: none;
  }
  30% {
    transform: translate(-30px, -30px);
  }
  90% {
    transform: rotate(15deg) translate(-30px, -30px);
  }
  100% {
    transform: rotate(15deg) translate(-30px, -30px);
  }
}
</style>
<script lang="ts">
import HeaderTop from '@/components/HeaderTop/index.vue';
import { BannerOpType } from '@/constants/BannerOpType';
import { ROUTENAME_INAPP_V_TOPUP_RANKING } from '@/constants/localRoutePath';
import ButtonLockController from '@/controller/ButtonLockController';
import { navigation_login_bridge } from '@/js_bridge/js_call_app_base';
import { waitUserIsLoginedAuth } from '@/store/modules/user.utils';
import {
  OFFICIAL_SITE_UPDATEVERSION,
  openAppH5LinkPreferLocal,
} from '@/utils/navigator';
import { receiveRewardSmashEggController } from '@/vservices/client/SmashEggController';
import { Toast } from 'vant';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import BonusGetDlg from './BonusGetDlg.vue';
import { SmashEggMixin } from './TopupBonusMixin.state';
import OpenedEggUI from './OpenedEggUI.vue';
import { getVPayUrl } from '@/constants/APP_SCHEMA_URLS';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { onGBus } from '@/utils/GBus';
import { updateRewardsByPropTypes } from '../VAssetInfo/VAsset.utils';

function tryGoToWebsiteForOuter() {
  if (window.GC.isInApp) {
    return false;
  }
  location.href = OFFICIAL_SITE_UPDATEVERSION;
  return true;
}

@Component({
  components: {
    HeaderTop,
    BonusGetDlg,
    OpenedEggUI,
  },
})
export default class TopupBonus extends mixins(
  SmashEggMixin,
  BindEventMixinDefault
) {
  useInited() {
    return onGBus('onVUserRechargeGameGold', () => {
      this.refreshSmashEgg(10);
    });
  }
  $refs: {
    getDlg: BonusGetDlg;
  };
  @Prop({
    type: Array,
  })
  tabList: {
    idx: number;
    traceEvent: string;
    title: string;
    hasRedDot: boolean;
  }[];

  get txtDateDuration() {
    const info = this.SmashEgg;
    function renderDt(dt: Date) {
      return `${dt.getDate()} - ${dt.getMonth() + 1} - ${dt.getFullYear()}`;
    }
    if (info) {
      const startDt = new Date(info.validStartTime);
      const endDt = new Date(info.validEndTime);
      return `${renderDt(startDt)} s/d ${renderDt(endDt)}`;
    } else {
      return '';
    }
  }

  get leftChance() {
    const info = this.SmashEgg;
    if (info) {
      return info.rewardCount;
    } else {
      return '0';
    }
  }

  get rewardList() {
    return this.SmashEgg?.items || [];
  }

  get isLogined() {
    return this.$ss.state.user.isLogined;
  }
  get canSmash() {
    if (!this.isLogined) {
      return true;
    }
    const rewardCount = this.SmashEgg?.rewardCount;
    return rewardCount > 0;
  }

  async onSmashClick() {
    if (this.mode !== 'init') {
      return;
    }
    if (!ButtonLockController.Instance.tryGetLock('smash', 1)) {
      return;
    }
    if (tryGoToWebsiteForOuter()) {
      return;
    }
    const isLogined = await waitUserIsLoginedAuth();
    if (isLogined) {
      // console.log(
      //   '[DEBUG] smash before',
      //   this.canSmash,
      //   this.SmashEgg?.rewardCount,
      //   this.isLogined,
      //   isLogined
      // );
      if (!this.canSmash) {
        return;
      }
      const res = await receiveRewardSmashEggController();
      if (!res.success) {
        Toast(res.message);
      } else {
        this.mode = 'smashing';
        this.gettedReward = res.data.propProduct as {
          imageUrl: string;
          nameText: string;
        };
        updateRewardsByPropTypes('GOLD');
        setTimeout(() => {
          this.mode = 'smash-end';
          setTimeout(() => {
            this.$refs.getDlg.waitDlgClose().then(() => {
              this.mode = 'init';
              this.refreshSmashEgg(0);
            });
            this.isGettedDlgOpen = true;
          }, 500);
        }, 1000);
      }
    } else {
      navigation_login_bridge(ROUTENAME_INAPP_V_TOPUP_RANKING, {
        to: this.$route.path + '?tab=bonus',
        opType: BannerOpType.AppLink,
      });
    }
  }

  async onGoToRechargeClick() {
    if (!ButtonLockController.Instance.tryGetLock('topup', 1)) {
      return;
    }
    if (tryGoToWebsiteForOuter()) {
      return;
    }
    const isLogined = await waitUserIsLoginedAuth();
    if (isLogined) {
      openAppH5LinkPreferLocal(getVPayUrl('smash_egg'), {});
    } else {
      navigation_login_bridge(ROUTENAME_INAPP_V_TOPUP_RANKING, {
        to: this.$route.path + '?tab=bonus',
        opType: BannerOpType.AppLink,
      });
    }
  }

  mode = 'init' as 'init' | 'smashing' | 'smash-end';

  isGettedDlgOpen = false;
  gettedReward: {
    imageUrl: string;
    nameText: string;
  } = null;
}
</script>
@/constants/APP_SCHEMA_URLS
