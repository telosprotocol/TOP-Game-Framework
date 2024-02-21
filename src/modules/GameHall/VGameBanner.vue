<template>
  <div class="w-full">
    <div
      class="mx-auto bg-contain bg-center bg-no-repeat"
      :style="
        $ss.getters.normalizeCss(
          { width: 344, height: 72, paddingTop: 3 },
          require('@/assets/gameHall/banner/bannerFrame.png'),
          false
        )
      "
    >
      <div
        :style="bannerSizeStyle"
        v-if="bannerList && bannerList.length > 0"
        class="mx-auto"
      >
        <Swipe
          :autoplay="15000"
          @change="onChange"
          class="w-full h-full"
          indicator-color="#fff"
          :style="{
            '--v-swipe-indicator-bottom': '0.2rem',
          }"
        >
          <SwipeItem v-for="item in bannerList" :key="item.key">
            <div
              class="bg-center bg-[length:100%_auto] bg-no-repeat"
              :style="item.bannerStyle"
              @click="onBannerClick(item, 'click_gamehall_banner', '1')"
            ></div>
          </SwipeItem>
        </Swipe>
      </div>
    </div>
    <div
      class="absolute left-0 right-0 -top-1 bg-contain bg-center bg-no-repeat pointer-events-none"
      :style="
        $ss.getters.normalizeCss(
          { width: 360, height: 72 },
          require('@/assets/gameHall/banner/bannerLines.png?webp'),
          true
        )
      "
    ></div>
  </div>
</template>

<script lang="ts">
import { Swipe, SwipeItem } from 'vant';
import Component from 'vue-class-component';
import { convertBgImageStyle } from '@/utils/styles';

import { Mixins, Watch } from 'vue-property-decorator';
import { noop, uniqueId } from 'lodash-es';
import { BannerMixinForGameHome } from '../VBannerBase/vbanner-gamehome.state';
@Component({
  components: { Swipe, SwipeItem },
})
export default class VGameBanner extends Mixins(BannerMixinForGameHome) {
  useInited() {
    return noop;
  }
  get bannerSizeStyle() {
    return this.$ss.getters.designPxsObjToReal({
      width: 330,
      height: 58,
    });
  }
  get bannerList() {
    return (this.BannerList || []).map((item, idx) => {
      return {
        idx: idx,
        key: uniqueId(),
        ...item,
        bannerStyle: item.imageUrl
          ? convertBgImageStyle(item.imageUrl, false, this.bannerSizeStyle)
          : {},
      };
    });
  }

  curIdx = 0;
  onChange(index: number) {
    this.curIdx = index;
  }

  get curExposeStr() {
    const bannerList = this.bannerList;
    const bannerItem = bannerList[this.curBannerIdx];
    if (!bannerItem) {
      return '';
    }
    return this.getBannerUniqueKey(bannerItem);
  }

  get curBannerIdx() {
    return this.curIdx;
  }

  @Watch('curExposeStr', { immediate: true })
  onExposeChange() {
    const bannerList = this.bannerList;
    const bannerItem = bannerList[this.curBannerIdx];
    if (bannerItem) {
      this.tryTraceBannerExpose(bannerItem, 'gamehall_banner_exposure', '1');
    }
  }
}
</script>
