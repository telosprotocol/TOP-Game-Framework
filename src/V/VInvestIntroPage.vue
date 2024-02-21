<template>
  <div class="bg-[#EFEAF5] min-h-screen">
    <HeaderTop
      left-icon="icon-back"
      :design-height="50"
      class="text-[#9464D1]"
      :bar-background="statusBarColor"
    >
      <div slot="default" class="text-center">{{ $t('VII.title') }}</div>
    </HeaderTop>
    <main>
      <div
        :style="topBannerStyle"
        class="bg-center bg-contain bg-no-repeat mx-auto mb-5"
      ></div>
      <div
        :style="midBannerStyle"
        class="bg-center bg-contain bg-no-repeat mx-auto mb-5"
      ></div>
      <section
        class="rounded-t-[30px] p-4"
        :style="{
          background:
            'linear-gradient(180deg, #C1C5FF 0%, rgba(227,229,254,0.94) 6%, rgba(255,255,255,0) 100%)',
        }"
      >
        <h3 class="text-base leading-5 pt-2 pb-4 robot-bold mx-2">
          {{ $t('VII.introTitle') }}
        </h3>
        <div v-for="item in introList" class="mb-6" :key="item.type">
          <div
            class="flex items-center text-sm robot-medium mb-3 border-t border-t-[rgba(116, 116, 116, 0.1)] py-3"
          >
            <div
              class="shrink-0 w-6 h-6 box-content bg-contain bg-center bg-no-repeat mr-1"
              v-webp="item.icon"
            ></div>
            {{ item.title }}
          </div>
          <div
            v-for="(line, idx) in item.list"
            class="mb-3 text-[#333] text-xs pl-4 relative robot-medium"
            :key="idx"
          >
            <div
              class="absolute w-1 h-1 rounded-full bg-black top-1.5 left-1"
            ></div>
            {{ line }}
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import HeaderTop from '@/components/HeaderTop/index.vue';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import StatusBarMixin from '@/mixins/StatusBarMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
import { tryMergeLocalesForVPrjInvestIntro } from '@/locales/Page/VPrj/VII/init';
// import { tryMergeLocalesForVPrjCheckin } from '@/locales/Page/VPrj/VC/init';
import { convertBgImageStyle } from '@/utils/styles';
tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjInvestIntro();
// tryMergeLocalesForVPrjCheckin();//
@Component({
  components: { HeaderTop },
})
export default class VInvestIntroPage extends mixins(
  BindEventMixinDefault,
  StatusBarMixin
) {
  /**
   *   statusBar
   */
  statusBarColor = '#ffffff';
  useInited() {
    return () => {
      //    destroy
    };
  }

  get topBannerStyle() {
    return convertBgImageStyle(
      this.$ss.getters.translateImage({
        en: '/online/investIntro/investIntroTop-en.png?webp',
        id: '/online/investIntro/investIntroTop-id.png?webp',
      }),
      true,
      this.$ss.getters.designPxsObjToReal({
        height: 259,
        width: 360,
      })
    );
  }

  get midBannerStyle() {
    return convertBgImageStyle(
      this.$ss.getters.translateImage({
        en: '/online/investIntro/investIntroMiddle-en.png?webp',
        id: '/online/investIntro/investIntroMiddle-id.png?webp',
      }),
      true,
      this.$ss.getters.designPxsObjToReal({
        height: 156,
        width: 322,
      })
    );
  }

  get introList() {
    function convertTransToList(msgMap: Record<string, string>) {
      return Object.keys(msgMap).map((item) => {
        return msgMap[item];
      });
    }
    return [
      {
        type: 'game',
        icon: require('@/assets/investIntro/iconPlay.png?webp'),
        title: this.$t('VII.gameTitle'),
        list: convertTransToList(this.$t('VII.gameContent') as any),
      },
      {
        type: 'dst',
        icon: require('@/assets/vcommon/CoinVToken.png?webp'),
        title: this.$t('VII.dstTitle'),
        list: convertTransToList(this.$t('VII.dstContent') as any),
      },
    ];
  }
}
</script>
