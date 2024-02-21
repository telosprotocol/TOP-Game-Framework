<template>
  <div>
    <div class="robot-bold text-xs text-[#9161D0] mb-2 mx-4">
      {{ $t('VR.FAQTitle') }}
    </div>
    <Swipe
      @change="onChange"
      class="mx-auto"
      :style="{ width: bannerSize.width }"
    >
      <SwipeItem v-for="item in bannerList" :key="item.idx">
        <div
          class="bg-center bg-contain bg-no-repeat"
          :style="item.bannerStyle"
          @click="onBannerClick(item, 'click_right_page_banner')"
        ></div>
      </SwipeItem>
      <div slot="indicator">
        <template>
          <div v-if="bannerList.length <= 1"></div>
          <div v-else class="flex justify-center pt-2">
            <div
              v-for="tabItem in bannerList"
              :key="tabItem.idx"
              class="rounded-full h-3 w-3 mx-[3px] transition-all"
              :class="{
                'bg-[#C9EDC4] flex items-center justify-center before:w-2 before:h-2 before:rounded-full before:bg-gradient-to-b before:from-[#54CC46] before:to-[#2E8A08]':
                  tabItem.idx === curIdx,
                'bg-[#DEDEDE]': tabItem.idx !== curIdx,
              }"
            ></div>
          </div>
        </template>
      </div>
    </Swipe>
  </div>
</template>
<script lang="ts">
import { Swipe, SwipeItem } from 'vant';

import Component from 'vue-class-component';
import { convertBgImageStyle } from '@/utils/styles';
import { Mixins, Watch } from 'vue-property-decorator';
import { createOrGetVBannerListMixin } from '@/modules/VBannerBase/vbanner.factory';

@Component({
  components: {
    Swipe,
    SwipeItem,
  },
})
export default class VRightBottomBanner extends Mixins(
  createOrGetVBannerListMixin('FORTUNE_HOME')
) {
  get bannerSize() {
    return this.$ss.getters.designPxsObjToReal({
      width: 328,
      height: 108,
    });
  }

  get bannerList() {
    return (this.BannerList || []).map((item, idx) => {
      return {
        idx,
        ...item,
        bannerStyle: convertBgImageStyle(item.imageUrl, false, this.bannerSize),
      };
    });
  }

  // @Watch('bannerList')
  // onBannerListChange(bannerList) {
  //   console.log('[Debug]', 'bannerListChange', bannerList);
  // }
  curIdx = 0;
  onChange(index: number) {
    this.curIdx = index;
  }

  get curExposeStr() {
    const bannerList = this.bannerList;
    const bannerItem = bannerList[this.curIdx];
    if (!bannerItem) {
      return '';
    }
    return this.getBannerUniqueKey(bannerItem);
  }

  @Watch('curExposeStr', { immediate: true })
  onExposeChange() {
    const bannerList = this.bannerList;
    const bannerItem = bannerList[this.curIdx];
    if (bannerItem) {
      this.tryTraceBannerExpose(bannerItem, 'right_page_banner_exposure');
    }
  }
}
</script>
