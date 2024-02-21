<template>
  <div :style="{ background: statusBarColor }">
    <HeaderTopBanner
      left-icon="icon-back"
      :style="{ height: topBannerHeight }"
      :bottom-threshold="bottomThreshold"
      :start-fade-threshold="startFadeThreshold"
      :bg-linner="statusBarColor"
      bg-none="transparent"
      skin="dark"
    >
      <div class="w-full bg-cover" :style="bgStyle"></div>
    </HeaderTopBanner>

    <section class="mx-3 flex flex-wrap mb-2 -mt-5 relative z-10">
      <div
        v-for="groupItem in groupList"
        class="bg-contain bg-center bg-no-repeat flex items-center justify-center shrink-0 pb-1"
        :style="
          $ss.getters.normalizeCss(
            { width: 111, height: 56 },
            groupItem.groupName === curGroupName
              ? require('@/assets/topupTutorial/blockActive.png?webp')
              : require('@/assets/topupTutorial/blockUnActive.png?webp'),
            true
          )
        "
        @click="curGroupName = groupItem.groupName"
        :key="groupItem.groupName"
      >
        <div
          class="bg-contain bg-center bg-no-repeat"
          :style="
            $ss.getters.normalizeCss(
              {
                width: 80,
                height: 25,
              },
              groupItem.icon
            )
          "
        ></div>
      </div>
    </section>
    <div
      v-if="curGroupItem && curGroupItem.list.length > 1"
      class="flex items-center mx-4 mb-10"
    >
      <button
        v-for="subItem in curGroupItem.list"
        :key="subItem.subType"
        class="rounded-full p-[2px] mr-2.5"
        @click="curSubGroupName = subItem.subType"
        :class="{
          'bg-gradient-to-b from-[#D877FF] to-[#AF42FD]':
            subItem.subType === curSubGroupName,
          'bg-white opacity-50': subItem.subType !== curSubGroupName,
        }"
      >
        <div class="bg-white rounded-full h-7 w-[100px] relative">
          <div
            class="absolute -top-[1px] -bottom-[1px] w-[88px] bg-contain bg-center bg-no-repeat left-1/2 -translate-x-1/2"
            v-webp="subItem.icon"
          ></div>
        </div>
      </button>
    </div>

    <main
      class="bg-[#1F093E] rounded-md mx-2 px-3 py-4 text-xl font-rubik font-bold leading-6 text-[#FFEDCD]"
    >
      <div v-if="curGuideItem">
        <section
          class="mb-8"
          v-for="(item, idx) in curGuideItem.stepList"
          :key="idx"
        >
          <h3 class="mb-3">{{ item.title }}</h3>

          <div
            class="relative left-1/2 -translate-x-1/2"
            :style="
              $ss.getters.normalizeCss({
                width: item.width || 320,
              })
            "
          >
            <img
              v-for="(picItem, picIdx) in item.img"
              :src="picItem"
              :key="picIdx"
              class="w-full"
              alt=""
            />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import StatusBarMixin from '@/mixins/StatusBarMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
import { tryMergeLocalesForVPrjTopupTutorial } from '@/locales/Page/VPrj/VTT/init';
import HeaderTopBanner from '@/components/HeaderTopBanner/index.vue';
import { convertBgImageStyle } from '@/utils/styles';
import { floor } from 'lodash-es';
import { getFirstString } from '@/utils/string';
import { TOPUP_TUTORIAL_DATA } from './VTopupTutorialData';

tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjTopupTutorial();
function getGroupItem(curGroupName: string) {
  return TOPUP_TUTORIAL_DATA.find((item) => {
    return item.groupName === curGroupName;
  });
}
// tryMergeLocalesForVPrjCheckin();//
@Component({
  components: { HeaderTopBanner },
})
export default class VTopupTutorialPage extends mixins(
  BindEventMixinDefault,
  StatusBarMixin
) {
  /**
   *   statusBar
   */
  statusBarColor = '#2B0D55';
  useInited() {
    const queryTab = this.queryTab;
    if (queryTab) {
      if (getGroupItem(queryTab)) {
        this.curGroupName = queryTab;
      }
    }
    return () => {
      //    destroy
    };
  }

  get queryTab() {
    return getFirstString(this.$route.query.tab);
  }
  get topBannerHeight() {
    return this.$ss.getters.designPxToReal(288) + 'px';
  }
  get startFadeThreshold() {
    return Math.max(0.5, this.bottomThreshold);
  }

  get bottomThreshold() {
    const res = floor(56 / 288, 2);
    return res;
  }
  get bgStyle() {
    return convertBgImageStyle(
      this.$ss.getters.translateImage({
        en: '/online/topupTutorial/tutorial-bg-en.png?webp',
        id: '/online/topupTutorial/tutorial-bg-id.png?webp',
      }),
      true,
      {
        height: this.topBannerHeight,
      }
    );
  }

  get groupList() {
    return TOPUP_TUTORIAL_DATA;
  }

  curGroupName = 'DANA';
  curSubGroupName = 'BCA';

  get curGroupItem() {
    return getGroupItem(this.curGroupName);
  }

  /**
   *
   */
  get curGuideItem() {
    const curGroupItem = this.curGroupItem;
    const list = curGroupItem.list;
    let curGuideName = curGroupItem.groupName;
    let listItem = list[0];
    if (list.length > 1) {
      const curSubGroupName = this.curSubGroupName;
      listItem =
        list.find((item) => {
          return item.subType === curSubGroupName;
        }) || list[0];
      curGuideName = listItem.subType;
    }

    return {
      stepList: listItem.stepList.map((stepItem, idx) => {
        const stepNo = idx + 1;
        return {
          ...stepItem,
          title: stepNo + '.' + this.$t(`VTT.${curGuideName}_STEP${stepNo}`),
        };
      }),
    };
  }
}
</script>
