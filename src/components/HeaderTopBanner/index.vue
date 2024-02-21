<template>
  <div class="w-full h-[288px] relative" :style="bannerStyle">
    <div class="absolute inset-0 z-0 overflow-hidden" :style="imgWrapStyle">
      <slot name="default">
        <img :src="bannerImage" class="w-full" />
      </slot>
    </div>

    <slot name="headerTop">
      <HeaderTop
        :skin="skin"
        :bar-background="barBackground"
        v-bind="restHeadTopAttrs"
        :left-icon="leftIcon"
        :left-icon-event="leftIconEvent"
        ref="refHeadTop"
      >
        <template #leftIcon>
          <slot name="leftIcon"></slot>
        </template>
        <template #default>
          <slot name="title"></slot>
        </template>
        <template #right>
          <slot name="right"></slot>
        </template>
      </HeaderTop>
    </slot>
    <slot name="main"></slot>
  </div>
</template>

<script lang="ts">
import HeaderTop from '@/components/HeaderTop/index.vue';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { HeaderTopBannerEvents, HeaderTopBannerStatus } from './model';

// banner

const HeaderTopBannerProps = Vue.extend({
  props: {
    /**
     * Banner Hidden   ，
     */
    titleAutoHidden: {
      type: Boolean,
      default: false,
    },
    /**
     * banner
     * headTop
     */
    bgLinner: {
      type: String,
      default: 'transparent',
    },
    skin: {
      type: String,
      default: 'dark',
    },
    /**
     * banner
     */
    bgNone: {
      type: String,
      default: 'transparent',
    },
    /**
     * banner  (    slot=default    )
     */
    bannerImage: {
      type: String,
      default: null,
    },

    /**
     * banner    （  px）
     *
     */
    bannerHeight: {
      type: Number,
      default: 0,
    },
    /**
     *
     * （   headerTop  /   ）81/288
     *   ，     ,banner    ，headerTop   bgLinner
     */
    bottomThreshold: {
      type: Number,
      default: 0.28,
      // default() {
      //   return 0.28
      // },
    },
    //
    startFadeThreshold: {
      type: Number,
      default: 0.9,
    },

    leftIcon: {
      //    slot:leftIcon
      type: String,
      default: undefined,
    },
    leftIconEvent: {
      //    slot:leftIcon
      type: String,
      default: undefined,
    },
  },
});
@Component({
  components: {
    HeaderTop,
  },
})
export default class HeaderTopBanner extends HeaderTopBannerProps {
  bannerOpacity = 1;
  bannerStatus = null as HeaderTopBannerStatus;

  get bannerStyle() {
    const bannerHeight = this.bannerHeight;
    return {
      background: this.bgLinner,
      height: bannerHeight ? bannerHeight + 'PX' : undefined,
    };
  }
  get imgWrapStyle() {
    return {
      opacity: this.bannerOpacity,
      transition: 'opacity 0.3s ease',
    };
  }

  get barBackground() {
    const toBg =
      this.bannerStatus === HeaderTopBannerStatus.Hidden
        ? this.bgLinner
        : this.bgNone;
    return toBg;
  }

  mounted() {
    if (typeof IntersectionObserver !== 'undefined') {
      this.$_initObserveIntersection();
    }
  }
  get restHeadTopAttrs() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { style, title, ...rest } = this.$attrs;
    delete rest['class'];
    let toTitle = title;
    if (
      this.titleAutoHidden &&
      this.bannerStatus !== HeaderTopBannerStatus.Hidden
    ) {
      toTitle = undefined;
    }
    return {
      ...rest,
      title: toTitle,
    };
  }

  $_initObserveIntersection() {
    const refBanner = this.$el as Element;
    const startFadePercent = this.startFadeThreshold;
    const hideImagePercent = this.bottomThreshold;
    const threshold = [];
    for (let i = 0; i < 10; i++) {
      const p = i / 10;
      if (p !== startFadePercent && p != this.bottomThreshold) {
        threshold.push(p);
      }
    }
    threshold.push(this.bottomThreshold);
    threshold.push(startFadePercent);
    threshold.push(1);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === refBanner) {
            // banner image
            const oldBannerStatus = this.bannerStatus;
            let toBannerStatus;
            if (entry.intersectionRatio <= startFadePercent) {
              if (entry.intersectionRatio <= hideImagePercent) {
                this.bannerOpacity = 0;
                toBannerStatus = HeaderTopBannerStatus.Hidden;
              } else {
                this.bannerOpacity = entry.intersectionRatio - hideImagePercent;
                toBannerStatus = HeaderTopBannerStatus.StartFade;
              }
            } else {
              this.bannerOpacity = 1;
              toBannerStatus = HeaderTopBannerStatus.All;
            }
            this.bannerStatus = toBannerStatus;
            if (oldBannerStatus !== toBannerStatus) {
              this.$emit(
                HeaderTopBannerEvents.bannerStatusChanged,
                toBannerStatus,
                oldBannerStatus
              );
            }
          }
        });
      },
      {
        threshold,
      }
    );
    observer.observe(refBanner);
  }

  @Ref()
  readonly refHeadTop: HeaderTop;
  getHeadTopBarHeight() {
    return this.refHeadTop.getHeadTopBarHeight();
  }
  goBack() {
    return this.refHeadTop.goBack();
  }
}
</script>
