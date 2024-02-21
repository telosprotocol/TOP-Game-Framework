<template>
  <div>
    <template v-if="curTabIdx !== 2">
      <div class="h-screen flex flex-col">
        <HeaderTop
          :disable-debug="true"
          left-icon="icon-back"
          class="shadow-md"
          bar-background="linear-gradient(180deg, #DE32BE 0%, #9D31CB 100%)"
          skin="dark"
        >
          <div slot="default" class="font-rubik font-medium text-center flex-1">
            {{ $t('VTR.title') }}
          </div>
          <div slot="right" class="w-[30px] h-[30px]"></div>
        </HeaderTop>
        <!-- RankBg -->
        <main
          class="flex-1 flex flex-col relative z-[1] pt-1.5 text-white"
          :style="
            $ss.getters.normalizeCss({
              background:
                'linear-gradient(180deg, #4E1B66 0%, #4E1B66 ' +
                $ss.getters.designPxToReal(410) +
                'px, #31357D 100%)',
            })
          "
        >
          <div
            class="absolute -top-10 left-0 -z-10 bg-contain bg-center bg-no-repeat"
            :style="
              $ss.getters.normalizeCss(
                {
                  width: 360,
                  height: 410,
                },
                '/online/topupRanking/v5/rankBg.png?webp',
                true
              )
            "
          ></div>
          <!-- TabList -->
          <div
            class="mx-3 rounded-full p-[3px] flex justify-between items-center relative z-[3] bg-[#0B0B0B] mb-14"
          >
            <div
              class="h-7 rounded-full flex-1 flex items-center justify-center text-xs rubik-bold relative"
              :class="{
                'bg-gradient-to-b from-[#DF31BE] to-[#9C31CC] text-white':
                  curTabIdx === tabItem.idx,
                'text-white': curTabIdx !== tabItem.idx,
              }"
              v-for="tabItem in tabList"
              :key="tabItem.idx"
              @click="onChangeTab(tabItem.idx)"
            >
              {{ tabItem.title }}

              <div
                v-if="tabItem.hasRedDot"
                class="w-2 h-2 box-content border border-solid border-white bg-gradient-to-b from-[#FFAEAE] via-[#F41D1D] to-[#DC0000] rounded-full right-0.5 absolute -top-[1px]"
              ></div>
            </div>
          </div>
          <!-- Top3 -->
          <div class="relative z-[0] pt-4 flex items-start justify-center mx-4">
            <div
              v-for="item in top3List"
              :key="item.no"
              :style="item.blockStyle"
              class="relative flex flex-col items-center"
            >
              <div
                :style="getDefaultAvatarStyle(item.avatarStyle)"
                class="bg-cover bg-no-repeat bg-center rounded-full absolute -z-[1]"
              ></div>
              <div
                :style="item.avatarStyle"
                class="bg-cover bg-no-repeat bg-center rounded-full absolute -z-[1]"
              ></div>
              <div
                class="bg-top bg-contain bg-no-repeat relative z-0"
                :style="item.circleStyle"
              ></div>
              <div
                class="text-center mx-auto font-rubik font-bold mt-1 tz-ellipsis-break-2 max-h-8 break-words break-all px-2 leading-tight drop-shadow-md"
              >
                {{ item.nickName }}
              </div>
              <div class="min-h-10 mb-2 flex-col items-center">
                <div
                  v-if="item.isTeam"
                  class="flex items-center justify-center"
                >
                  <div class="text-[11px] font-medium text-[#FFE353]">
                    {{
                      $tc('VTR.numberOfPeople', item.teamCount, {
                        n: item.teamCountText,
                      })
                    }}
                  </div>
                </div>
                <div
                  :style="item.rpBlockStyle"
                  class="flex items-center justify-center text-[11px] font-medium italic font-rubik vshadow-stroke-0.5 rounded-full mt-1 px-2"
                >
                  <div
                    class="bg-contain bg-center bg-no-repeat mr-1"
                    :style="
                      $ss.getters.normalizeCss(
                        {
                          width: 33 / 2,
                          height: 35 / 2,
                        },
                        '/online/topupRanking/walletIcon.png'
                      )
                    "
                  ></div>
                  <div>{{ item.rpText }}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- CountDown -->
          <div
            class="relative bg-[rgba(28,28,28,0.6)] rounded-full mx-4 text-[#FF6D6D] font-rubik font-semibold italic flex items-center py-[1px] text-xs mb-0.5"
          >
            <div
              class="bg-contain bg-center bg-no-repeat h-6 ml-0.5 mt-[1px]"
              v-if="realLeftMS > 0 || realLeftMS == null"
              :style="
                $ss.getters.normalizeCss(
                  {
                    width: 23,
                  },
                  '/online/topupRanking/timer.png'
                )
              "
            ></div>

            <div
              class="flex-1 h-6 leading-6 flex items-center justify-center"
              v-if="realLeftMS > 0"
            >
              <van-count-down
                ref="countDown"
                :time="realLeftMS"
                style="color: #ff6d6d; font-size: 12px; line-height: none"
                @finish="onCountDownFinish"
                format="DD Hari HH Jam mm Menit ss Detik"
              />
            </div>
            <div v-else class="flex items-center justify-center flex-1 h-6">
              {{
                realLeftMS == null ? '&nbsp;' : 'Kegiatan ini telah berakhir'
              }}
            </div>
          </div>
          <AsyncStatus
            color="white"
            :status="curStatus"
            @retry="onRetryClick"
          ></AsyncStatus>
          <!-- RankList -->
          <section class="px-4 pb-4">
            <div
              v-for="item in restRankList"
              class="flex items-center justify-between border-t border-solid border-[rgba(255,255,255,0.1)] py-2 pr-2 font-rubik font-medium"
              :class="{
                'border-b': item.isLast,
              }"
              :key="item.no"
            >
              <div class="shrink-0 w-5 text-right mr-2 text-[15px]">
                {{ item.no }}.
              </div>
              <div
                class="shrink-0 bg-cover bg-center bg-no-repeat rounded-full mr-2"
                :style="getDefaultAvatarStyle(item.avatarStyle)"
              >
                <div
                  :style="item.avatarStyle"
                  class="bg-cover bg-center bg-no-repeat rounded-full"
                ></div>
              </div>
              <div class="flex-1 flex flex-col px-1">
                <div class="leading-none mb-2">{{ item.nickName }}</div>

                <div class="flex items-center">
                  <div class="mr-1 font-bold font-rubik relative">
                    <div
                      class="vgradient-text"
                      :style="{
                        '--v-color-from': '#FFF6A6',
                        '--v-color-to': '#FFC909',
                        webkitTextStroke: '0.5px #991C1C',
                      }"
                      data-text="Top Up"
                    >
                      Top Up
                    </div>
                  </div>
                  <div
                    :style="item.rpBlockStyle"
                    class="inline-flex items-center justify-between text-[14px] leading-none font-semibold italic font-rubik rounded-full pl-2 pr-3"
                  >
                    <div
                      class="bg-contain bg-center bg-no-repeat mr-1"
                      :style="
                        $ss.getters.convertBgImageStyle(
                          '/online/topupRanking/walletIcon.png',
                          false,
                          $ss.getters.designPxsObjToReal({
                            width: 33 / 2,
                            height: 35 / 2,
                          })
                        )
                      "
                    ></div>
                    <div class="text-[#001EBC] min-w-[45px]">
                      {{ item.rpText }}
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="item.isTeam"
                class="flex flex-col items-end justify-center"
              >
                <div class="text-[11px]">
                  {{
                    $tc('VTR.numberOfPeople', item.teamCount, {
                      n: item.teamCountText,
                    })
                  }}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </template>
    <template v-else>
      <TopupBonus :tab-list="tabList" @changeTab="onChangeTab"></TopupBonus>
    </template>
  </div>
</template>

<script lang="ts">
import HeaderTop from '@/components/HeaderTop/index.vue';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import StatusBarMixin from '@/mixins/StatusBarMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
// import { tryMergeLocalesForVPrjCheckin } from '@/locales/Page/VPrj/VC/init';
import { tryMergeLocalesForVPrjTopupRanking } from '@/locales/Page/VPrj/VTR/init';
import { convertBgImageStyle } from '@/utils/styles';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';

import { MS_MINUTES_30 } from '@/constants/time';
import AsyncStatus from '@/components/NoData/AsyncStatus.vue';
import {
  formatNumberInAbbreviationBase,
  getFirstString,
  stringShield,
} from '@/utils/string';
import { CountDown } from 'vant';
import { DEFAULT_GAME_AVATAR_URL } from '@/constants/DEFAULT_GAME_AVATAR_URL';
import {
  userInviteRechargeRankingForuneCenterController,
  userInviteRechargeTeamRankingForuneCenterController,
} from '@/vservices/restful/ForuneCenterController';
import TopupBonus from '@/modules/TopupRanking/TopupBonus.vue';
import stateItemSmashEgg from '@/modules/TopupRanking/TopupBonusMixin.state';
import { RankActivityTimeMixin } from '@/modules/TopupRanking/TopupRank.state';

tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjTopupRanking();

function formatVRp2(num: number) {
  // const store = getStore();
  // const langConfig = store.getters.langConfig;
  return formatNumberInAbbreviationBase(num, 6, 0, {
    decimalMark: ',',
    separator: '.',
    KMGT: {
      K: ' K',
      M: ' Jt',
      G: ' M',
      T: ' T',
    },
    maxKMGT: 'M',
  });
}
const RANK_RP_BLOCK_STYLES = [
  {
    // img: '/online/topupRanking/block1.png',
    style: {
      '--tw-shadow-color': '#967800',
      background:
        'linear-gradient(272.96deg, #CB993B 2.46%, #F8D449 43.26%),linear-gradient(267.02deg, #FFE189 6.17%, #FBE69D 52.48%)',
      border: '0.5px solid #FFE189',
    },
  },
  {
    style: {
      '--tw-shadow-color': '#515151',
      background: 'linear-gradient(302deg, #8C8A82 0%, #CECFC6 100%)',
      border: '0.5px solid #666666',
    },
  },
  {
    style: {
      '--tw-shadow-color': '#885B15',
      background:
        'linear-gradient(272.96deg, #9B691B 2.46%, #F1A834 43.26%),linear-gradient(267.02deg, #FAB451 6.17%, #FBC163 52.48%)',
      border: '0.5px solid #FAB451',
    },
  },
  {
    style: {
      '--tw-shadow-color': '#9B1DB0',
      background: 'linear-gradient(270deg, #C1C2C2 0%, #FFFFFF 100%)',
      border: '0.5px solid #1712FF',
    },
  },
];
const DEFAULT_STATUSBAR_COLOR = '#DE32BE';
// tryMergeLocalesForVPrjCheckin();//
@Component({
  components: {
    HeaderTop,
    AsyncStatus,
    'van-count-down': CountDown,
    TopupBonus,
  },
})
export default class TopupRankingPage extends mixins(
  BindEventMixinDefault,
  RankActivityTimeMixin,
  StatusBarMixin
) {
  $refs: {
    countDown: CountDown;
  };
  /**
   *   statusBar
   */
  statusBarColor = DEFAULT_STATUSBAR_COLOR;
  useInited() {
    if (this.queryTab === 'bonus') {
      this.curTabIdx = 2;
    }
    this.refreshCurTab();
    stateItemSmashEgg.tryUpdate(MS_MINUTES_30);
    this.$tracev('top_person_rank_exposure');
    this.refreshRankActivityTime().then((res) => {
      if (res.ok) {
        const endTime = this.RankActivityEndTime;
        if (endTime) {
          // const curDt=new Date().getTime()
          // this.realLeftMS = deadlineTime - serverTime;
          this.realLeftMS =
            endTime - this.stateItemRankActivityTimeRef.lastServerDt;
        } else {
          this.realLeftMS = 0;
        }
      }
    });
    return () => {};
  }
  get queryTab() {
    return getFirstString(this.$route.query.tab);
  }

  onCountDownFinish() {
    this.realLeftMS = 0;
  }

  realLeftMS: number = null;

  //#region tab

  curTabIdx = 0;

  baseTabList = [
    {
      idx: 0 as const,
      stateItem: createHttpAsyncStateItem(() => {
        return userInviteRechargeRankingForuneCenterController();
      }),
      traceEvent: 'click_top_person_rank',
      title: this.$t('VTR.personalRechargeRank'),
    },
    {
      idx: 1 as const,
      stateItem: createHttpAsyncStateItem(() => {
        return userInviteRechargeTeamRankingForuneCenterController();
      }),
      traceEvent: 'click_top_team_rank',
      title: this.$t('VTR.teamRechargeRank'),
    },
    {
      idx: 2 as const,
      traceEvent: 'click_top_bonus_rank',
      title: this.$t('VTR.bonusRechargeRank'),
      stateItem: stateItemSmashEgg,
    },
  ];
  get tabRedpointMap() {
    return {
      2: stateItemSmashEgg.ref?.current?.rewardCount > 0,
    } as Record<number, boolean>;
  }
  get tabList() {
    const baseTabList = this.baseTabList;
    const tabList = [baseTabList[0], baseTabList[2]];
    const tabRedpointMap = this.tabRedpointMap;
    return tabList.map((item) => {
      return {
        ...item,
        hasRedDot: !!tabRedpointMap[item.idx],
      };
    });
  }
  onChangeTab(idx: number) {
    this.curTabIdx = idx;
    this.$tracev(this.curTabItem.traceEvent);
    this.refreshCurTab();
  }
  refreshCurTab() {
    if (this.curTabIdx === 2) {
      this.statusBarColor = '#AEECFB';
    } else {
      this.statusBarColor = DEFAULT_STATUSBAR_COLOR;
    }
    const tabItem = this.curTabItem;
    tabItem.stateItem.tryUpdate(MS_MINUTES_30);
  }

  get curTabItem() {
    const curTabIdx = this.curTabIdx;
    return this.tabList.find((item) => curTabIdx === item.idx);
  }

  get curStateRef() {
    return this.curTabItem.stateItem.ref;
  }

  get curStatus() {
    const curStateRef = this.curStateRef;
    const status = curStateRef.status;
    if (this.curTabItem.idx === 2) {
      return status;
    }
    if (
      status === 'ok' &&
      (curStateRef.current == null ||
        (curStateRef.current as RAPI.UserInviteRechargeRankingVO[]).length ===
          0)
    ) {
      return 'nodata';
    }
    return status;
  }

  onRetryClick() {
    const tabItem = this.curTabItem;
    if (tabItem) {
      tabItem.stateItem.tryUpdate(0);
    }
  }
  //#endregion

  get top3ListBase() {
    return [
      {
        no: 2,
        blockStyle: this.$ss.getters.designPxsObjToReal({
          width: 104,
          marginTop: 48,
        }),
        circleStyle: convertBgImageStyle(
          '/online/topupRanking/v4/circle2.png',
          true,
          this.$ss.getters.designPxsObjToReal({
            width: 105,
            height: 110,
          })
        ),
        avatarStyle: this.$ss.getters.designPxsObjToReal({
          width: 86,
          height: 86,
          top: 4,
        }),
      },
      {
        no: 1,
        blockStyle: this.$ss.getters.designPxsObjToReal({
          width: 125,
          marginTop: 4,
        }),
        circleStyle: convertBgImageStyle(
          '/online/topupRanking/v4/circle1.png',
          true,
          this.$ss.getters.designPxsObjToReal({
            width: 122,
            height: 122,
          })
        ),
        avatarStyle: this.$ss.getters.designPxsObjToReal({
          width: 99,
          height: 99,
          top: 7,
        }),
      },
      {
        no: 3,
        blockStyle: this.$ss.getters.designPxsObjToReal({
          width: 104,
          marginTop: 48,
        }),
        circleStyle: convertBgImageStyle(
          '/online/topupRanking/v4/circle3.png',
          true,
          this.$ss.getters.designPxsObjToReal({
            width: 105,
            height: 110,
          })
        ),
        avatarStyle: this.$ss.getters.designPxsObjToReal({
          width: 84,
          height: 84,
          top: 6,
        }),
      },
    ].map((item) => {
      const rpBlockConfig = RANK_RP_BLOCK_STYLES[item.no - 1];
      return {
        ...item,
        rpBlockStyle: this.$ss.getters.designPxsObjToReal({
          height: 21,
          ...rpBlockConfig.style,
        }),
      };
    });
  }

  get top3List() {
    const res = this.dataRankList;
    return this.top3ListBase.map((item) => {
      const info = res?.[item.no - 1];
      const img = info?.avatar || DEFAULT_GAME_AVATAR_URL;
      const teamInfo = info as RAPI.UserInviteRechargeTeamRankingVO;
      return {
        ...item,
        nickName: stringShield(info?.nickName || info?.userId || ''),
        avatarStyle: convertBgImageStyle(img, false, item.avatarStyle),
        rpText: info ? formatVRp2(Number(info.totalRpAmount)) : '',
        ...this.convertTeamInfo(teamInfo),
      };
    });
  }

  convertTeamInfo(info: RAPI.UserInviteRechargeTeamRankingVO) {
    const teamCount = info?.teamCount;
    if (teamCount == null) {
      return { isTeam: false };
    }
    // const avatarTeamCount = Math.min(teamCount, 3);
    // const avatarList = [];
    // const rawAvatarList = info.avatars || [];
    // for (let i = 0; i < avatarTeamCount; i++) {
    //   avatarList.push(rawAvatarList[i] || DEFAULT_GAME_AVATAR_URL);
    // }
    return {
      isTeam: true,
      teamCount: teamCount,
      teamCountText: this.$ss.getters.formatFloat(teamCount, {
        precision: 0,
      }),
      // avatarList,
    };
  }

  get dataRankList() {
    if (this.curTabIdx === 2) {
      return [];
    }

    const res = this.curStateRef.current;
    return (res || []) as RAPI.UserInviteRechargeRankingVO[];
  }

  getDefaultAvatarStyle(style: Partial<CSSStyleDeclaration>) {
    return this.$ss.getters.normalizeCss(style as any, DEFAULT_GAME_AVATAR_URL);
  }

  get restRankList() {
    if (this.curTabIdx === 2) {
      return [];
    }
    const list = this.dataRankList.slice(3);
    const listCount = list.length;
    return list.map((item, idx) => {
      const rpBlockConfig = RANK_RP_BLOCK_STYLES[3];
      return {
        no: idx + 4,
        ...item,
        nickName: stringShield(item.nickName || item.userId || ''),
        avatarStyle: convertBgImageStyle(
          item.avatar || DEFAULT_GAME_AVATAR_URL,
          false,
          this.$ss.getters.designPxsObjToReal({
            width: 52,
            height: 52,
          })
        ),

        rpBlockStyle: this.$ss.getters.designPxsObjToReal({
          height: 21,
          ...rpBlockConfig.style,
        }),
        isLast: idx === listCount - 1,
        rpText: formatVRp2(Number(item.totalRpAmount)),
        ...this.convertTeamInfo(item as RAPI.UserInviteRechargeTeamRankingVO),
      };
    });
  }
}
</script>
@/modules/TopupRanking/TopupRank.api
