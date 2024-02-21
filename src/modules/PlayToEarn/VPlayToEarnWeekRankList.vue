<template>
  <VPlayEarnBlockUI>
    <div slot="title">{{ $t('VPE.rankTitle') }}</div>
    <main
      class="bg-gradient-to-b from-[#FFE8CB] via-[#FFEED3] to-[#FFF8E1] rounded-2xl text-[#805A1D]"
      :style="$ss.getters.designPxsObjToReal({ height: 432 })"
    >
      <section class="relative flex items-end pt-2">
        <div
          v-for="item in top3List"
          :key="item.no"
          class="relative shrink-0"
          :style="item.wrapStyle"
        >
          <div
            class="absolute bg-cover bg-center bg-no-repeat z-0 -translate-x-1/2 left-1/2 rounded-full"
            :style="item.avatarStyle"
          ></div>
          <div
            class="bg-contain bg-center bg-no-repeat relative z-10"
            :style="item.blockStyle"
          >
            <div
              class="text-center mx-auto font-rubik font-medium italic text-xs mt-1 tz-ellipsis-break-2 px-3 leading-3 mb-1"
            >
              {{ item.nickName }}
            </div>
            <div
              :style="item.rpBlockStyle"
              class="flex items-center justify-center text-white rounded-full mt-1 pr-2 pl-4 relative robot-bold text-sm mx-auto text-center leading-none"
            >
              <div
                class="absolute -left-2 -top-1 w-7 h-7 box-content bg-contain bg-center bg-no-repeat mr-1"
                v-webp="require('@/assets/vcommon/CoinVToken.png?webp')"
              ></div>
              {{ item.rpText }}
            </div>
          </div>
        </div>
      </section>

      <section class="text-xs leading-none -mt-1">
        <div
          v-for="item in restRankList"
          class="flex items-center border-t border-solid border-[rgba(255,255,255,0.1)] py-[3px] font-rubik font-medium px-2"
          :class="{
            'border-b': item.isLast,
          }"
          :key="item.no"
        >
          <div class="shrink-0 w-5 text-left">{{ item.no }}.</div>
          <div
            class="shrink-0 bg-cover bg-center bg-no-repeat rounded-full mr-1"
            :style="item.avatarStyle"
          ></div>
          <div class="leading-none robot-medium italic flex-1 mr-1">
            {{ item.nickName }}
          </div>
          <div
            :style="item.rpBlockStyle"
            class="flex items-center justify-center rounded-full mt-1 pr-2 pl-4 relative robot-bold text-sm mx-auto text-center leading-none text-[#805A1D]"
          >
            <div
              class="absolute -left-2 -top-1 w-7 h-7 box-content bg-contain bg-center bg-no-repeat mr-1"
              v-webp="require('@/assets/vcommon/CoinVToken.png?webp')"
            ></div>
            {{ item.rpText }}
          </div>
        </div>
      </section>
    </main>
  </VPlayEarnBlockUI>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { DEFAULT_GAME_AVATAR_URL } from '@/constants/DEFAULT_GAME_AVATAR_URL';
import { VPlayEarnWeekRankMixin } from './VPlayEarnRank.state';
import VPlayEarnBlockUI from './VPlayEarnBlockUI.vue';
import { stringShield } from '@/utils/string';
import { convertBgImageStyle } from '@/utils/styles';

const RANK_RP_BLOCK_STYLES = [
  {
    // img: '/online/topupRanking/block1.png',
    style: {
      '--tw-shadow-color': '#B01414',
      background: 'linear-gradient(302deg, #991E33 0%, #FF5260 100%)',
      border: '0.5px solid  #FFCECE',
    },
  },
  {
    style: {
      '--tw-shadow-color': '#2E5ACE',
      background: 'linear-gradient(276deg, #0B4ECF 0%, #58B3FF 100%)',
      border: '0.5px solid #D6E4FF',
    },
  },
  {
    style: {
      '--tw-shadow-color': '#BF4923',
      background: 'linear-gradient(302deg, #FF573C 0%, #FFC38C 100%)',
      border: '0.5px solid #FFE3E3',
    },
  },
  {
    style: {
      '--tw-shadow-color': '#FFCB96',
      background: 'linear-gradient(270deg, #FFE5B2 0%, #FFD989 100%)',
      border: '0.5px solid #FFCB96',
    },
  },
];
@Component({
  components: {
    VPlayEarnBlockUI,
  },
})
export default class VPlayToEarnWeekRankList extends mixins(
  VPlayEarnWeekRankMixin
) {
  get top3ListBase() {
    return [
      {
        no: 2,
        blockStyle: this.$ss.getters.convertBgImageStyle(
          '/online/playToEarn/rank2.png?webp',
          true,
          this.$ss.getters.designPxsObjToReal({
            width: 100,
            height: 159,
            zIndex: '0',
            paddingTop: 94,
          })
        ),
        avatarStyle: this.$ss.getters.designPxsObjToReal({
          width: 58,
          height: 58,
          top: 22,
        }),
      },
      {
        no: 1,
        wrapStyle: this.$ss.getters.designPxsObjToReal({
          marginLeft: -8,
          zIndex: '10',
        }),
        blockStyle: this.$ss.getters.convertBgImageStyle(
          '/online/playToEarn/rank1.png?webp',
          true,
          this.$ss.getters.designPxsObjToReal({
            width: 106,
            height: 193,
            zIndex: '0',
            paddingTop: 110,
          })
        ),
        avatarStyle: this.$ss.getters.designPxsObjToReal({
          width: 70,
          height: 70,
          top: 25,
        }),
      },
      {
        no: 3,
        wrapStyle: this.$ss.getters.designPxsObjToReal({
          marginLeft: -8,
        }),
        blockStyle: this.$ss.getters.convertBgImageStyle(
          '/online/playToEarn/rank3.png?webp',
          true,
          this.$ss.getters.designPxsObjToReal({
            width: 98,
            height: 154,
            paddingTop: 94,
          })
        ),
        avatarStyle: this.$ss.getters.designPxsObjToReal({
          width: 58,
          height: 58,
          top: 22,
        }),
      },
    ].map((item) => {
      const rpBlockConfig = RANK_RP_BLOCK_STYLES[item.no - 1];
      return {
        ...item,
        rpBlockStyle: this.$ss.getters.designPxsObjToReal({
          height: 22,
          width: 86,
          ...rpBlockConfig.style,
        }),
      };
    });
  }

  get top3List() {
    const rankList = this.PlayEarnWeekRank || [];
    return this.top3ListBase.map((item) => {
      const info = rankList[item.no - 1];
      const img = info?.avatar || DEFAULT_GAME_AVATAR_URL;
      return {
        ...item,
        nickName: stringShield(info?.nickName || info?.userId || ''),
        avatarStyle: convertBgImageStyle(img, false, item.avatarStyle),
        rpText: info
          ? this.$ss.getters.formatFloat(Number(info.totalAmount), {
              precision: 2,
            })
          : '',
      };
    });
  }

  get restRankList() {
    const rankList = this.PlayEarnWeekRank;
    const list = (rankList || []).slice(3);
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
            width: 20,
            height: 20,
          })
        ),

        rpBlockStyle: this.$ss.getters.designPxsObjToReal({
          height: 22,
          width: 86,
          ...rpBlockConfig.style,
        }),
        isLast: idx === listCount - 1,
        rpText: this.$ss.getters.formatFloat(Number(item.totalAmount), {
          precision: 2,
        }),
      };
    });
  }
}
</script>
