<template>
  <div class="rounded-2xl">
    <header
      class="rounded-t-2xl bg-[#035F57] pl-5 py-3 text-white text-[14px] leading-4"
    >
      {{ $t('VPIN.chatTitle') }}
    </header>
    <div
      class="rounded-b-2xl bg-[#EDE5DC] py-3 pl-2 pr-1 relative"
      ref="container"
    >
      <div
        class="w-full h-full overflow-y-scroll bg-[#EDE5DC]"
        :style="$ss.getters.designPxsObjToReal({ height: 280 })"
      >
        <div
          v-for="item in chatList"
          :key="item.no"
          class="flex items-end mb-4"
          :class="{ ' flex-row-reverse': item.type === 'right' }"
          :style="$ss.getters.designPxsObjToReal(item.styleConfig.wrapStyle)"
        >
          <div
            class="bg-contain bg-no-repeat bg-center mx-2.5"
            :style="
              $ss.getters.convertBgImageStyle(
                item.user.icon,
                true,
                $ss.getters.designPxsObjToReal({
                  width: 34,
                  height: 34,
                })
              )
            "
          ></div>
          <div
            class="rounded-lg py-1 flex-1 px-3 relative"
            :style="{ background: item.styleConfig.bgColor }"
          >
            <div
              class="bg-contain bg-center bg-no-repeat absolute bottom-1"
              :style="
                $ss.getters.convertBgImageStyle(
                  item.styleConfig.arrowIcon,
                  false,
                  $ss.getters.designPxsObjToReal(
                    item.type === 'left'
                      ? {
                          width: 25,
                          height: 13,
                          left: -14,
                        }
                      : {
                          width: 26,
                          height: 13,
                          right: -14,
                        }
                  )
                )
              "
            ></div>
            <div
              class="robot-medium flex items-center"
              :style="{ color: item.styleConfig.userColor }"
            >
              <div
                class="bg-contain bg-no-repeat"
                :style="
                  $ss.getters.convertBgImageStyle(
                    item.userLevelConfig.icon,
                    true,
                    $ss.getters.designPxsObjToReal({
                      width: 20,
                      height: 20,
                    })
                  )
                "
              ></div>
              {{ item.user.userName }}:
            </div>
            <div class="text-[#333]">{{ item.content }}</div>
          </div>
        </div>
        <div class="h-[1px] w-full relative -mt-4" ref="bottom"></div>
      </div>
      <div
        v-if="isShowScrollTip"
        class="absolute bottom-0 rounded-b-2xl h-8 left-0 right-0 bg-[rgba(0,0,0,0.2)] text-white flex items-center justify-center"
      >
        <div
          class="iconfont icon-down animated infinite arrowMove"
          :style="{
            '--animate-x-from': '0px',
            '--animate-x-to': '0px',
            '--animate-y-from': '-2px',
            '--animate-y-to': '2px',
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { getVGameLevelConfigByGameLevel } from '@/modules/VAssetInfo/VLevels.config';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { noop } from 'lodash-es';
const D_TYPE_CONIFG = {
  left: {
    userColor: '#9E6FFB',
    bgColor: '#FFFFFF',
    wrapStyle: {
      paddingRight: 53,
    },
    arrowIcon: '/online/playIncomeN/user/leftDlgArrow.png',
  },
  right: {
    userColor: '#3DEC3C',
    bgColor: '#E2FFC8',
    wrapStyle: {
      paddingLeft: 63 - 12,
    },
    arrowIcon: '/online/playIncomeN/user/rightDlgArrow.png',
  },
};
@Component({
  components: {},
})
export default class VPromoteIncomeChatBlock extends mixins(
  BindEventMixinDefault
) {
  $refs!: { bottom: HTMLDivElement; container: HTMLDivElement };

  useInited() {
    const bottomEl = this.$refs.bottom;
    if (typeof IntersectionObserver !== 'undefined') {
      let observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            this.isShowScrollTip = entry.intersectionRatio <= 0.002;
            // console.log(
            //   '[DEBUG]intersection',
            //   entry.intersectionRatio,
            //   entry.intersectionRatio <= 0.002
            // );
          });
        },
        {
          threshold: [0, 1],
          root: this.$refs.container,
        }
      );
      observer.observe(bottomEl);
      // console.log('[DEBUG] startWatch', bottomEl);
      return () => {
        if (observer) {
          observer.unobserve(bottomEl);
        }
      };
    }
    return noop;
  }

  isShowScrollTip = true;

  get userList() {
    return [
      {
        id: 1,
        userName: 'Anggriani',
        level: 0,
        icon: '/online/playIncomeN/user/1.png?webp',
      },
      {
        id: 2,
        userName: 'Natasha',
        level: 2,
        icon: '/online/playIncomeN/user/2.png?webp',
      },
      {
        id: 3,
        userName: 'Susanto',
        level: 1,
        icon: '/online/playIncomeN/user/3.png?webp',
      },
      {
        id: 4,
        userName: 'Bagas',
        level: 4,
        icon: '/online/playIncomeN/user/4.png?webp',
      },
    ];
  }

  get cList() {
    return [
      {
        no: 1,
        userId: 1,
        content: this.$t('VPIN.chat1'),
        type: 'left',
      },
      {
        no: 2,
        userId: 2,
        content: this.$t('VPIN.chat2'),
        type: 'right',
      },
      {
        no: 3,
        userId: 3,
        content: this.$t('VPIN.chat3'),
        type: 'left',
      },
      {
        no: 4,
        userId: 2,
        content: this.$t('VPIN.chat4'),
        type: 'right',
      },
      {
        no: 5,
        userId: 4,
        content: this.$t('VPIN.chat5'),
        type: 'left',
      },
      {
        no: 6,
        userId: 2,
        content: this.$t('VPIN.chat6'),
        type: 'right',
      },
      {
        no: 7,
        userId: 1,
        content: this.$t('VPIN.chat7'),
        type: 'left',
      },
    ] as {
      no: number;
      userId: number;
      content: string;
      type: 'left' | 'right';
    }[];
  }

  get chatList() {
    return this.cList.map((item) => {
      const userInfo = this.userList[item.userId - 1];
      const gameLevelConfig = getVGameLevelConfigByGameLevel(userInfo.level);
      return {
        ...item,
        user: userInfo,
        userLevelConfig: gameLevelConfig,
        styleConfig: D_TYPE_CONIFG[item.type],
      };
    });
  }
}
</script>
