<template>
  <div
    class="min-h-screen relative bg-gradient-to-b from-[#861771] to-[#2E2D70]"
  >
    <div
      class="absolute z-0 top-0 left-0 right-0 bg-contain bg-center bg-no-repeat"
      :style="
        $ss.getters.normalizeCss(
          {
            height: 534 / 2,
          },
          '/online/topupRanking/v5/fireworks.png',
          false
        )
      "
    ></div>
    <HeaderTop
      left-icon="icon-back"
      skin="dark"
      class="z-10"
      :bar-background="'transparent'"
      left-icon-event="return_dstrank_activity"
      :left-icon-event-data="{ vgame: '1' }"
      dont-fixed
    >
      <div
        slot="default"
        class="bg-contain bg-top bg-no-repeat w-full"
        :style="logoStyle"
      ></div>
      <div slot="right" class="w-[30px] h-[30px]"></div>
    </HeaderTop>
    <main class="pb-5 relative z-0">
      <section class="mb-5 pt-3">
        <div
          class="bg-contain bg-center bg-no-repeat mx-auto mb-4"
          :style="
            $ss.getters.normalizeCss(
              { height: 188 / 2 },
              '/online/topupRanking/v5/title.png',
              false
            )
          "
        ></div>
        <div class="flex items-center">
          <div
            class="mx-auto mb-8 font-robot-bold font-bold text-[18px] text-white italic rounded-full px-6"
            :class="{ invisible: !txtDateDuration }"
            :style="
              $ss.getters.normalizeCss({
                height: 27,
                background:
                  'linear-gradient(90deg, rgba(44, 4, 42, 0.3) 0%, rgba(38, 5, 54, 0.3) 100%)',
                boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset',
              })
            "
          >
            {{ txtDateDuration }}
            <!-- 20 Desember - 18 Januari -->
          </div>
        </div>
        <div
          class="text-white mx-7 text-center font-rubik font-medium text-xs flex items-center justify-center mb-6"
        >
          Tahun 2023 Segera Berlalu, Terima Kasih kepada kalian yang sudah
          dukung selama ini ya! Di Momen Spesial ini, Kami Sudah Siapkan Event
          TopUp Termegah, Semoga Hadiah" Spesial ini bisa membuat akhir tahun
          Kamu tak terlupakan!
        </div>
        <div
          class="bg-contain bg-center bg-no-repeat mx-auto"
          @click="goToBonusTopup"
          :style="
            $ss.getters.normalizeCss(
              { width: 333, height: 100 },
              '/online/topupRanking/v5/banner.png?webp',
              true
            )
          "
        ></div>
      </section>
      <div
        v-for="item in imgList"
        :key="item.no"
        class="bg-center bg-contain bg-no-repeat mx-auto"
        :style="item.imgStyle"
      ></div>
      <div class="text-[#8380FF] px-4 font-robot-medium font-medium text-xs">
        *Gambar Barang hanya sebagai contoh, Mohon untuk warna atau bentuk tidak
        dijadikan patokan barang yang akan diterima
      </div>
    </main>
    <button
      class="fixed z-20 bg-contain bg-no-repeat bg-right animated infinite breathe"
      @click="goToRanking"
      :style="
        $ss.getters.convertBgImageStyle(
          '/online/topupRanking/btnRank.png?webp',
          true,
          $ss.getters.designPxsObjToReal({
            width: 149,
            height: 59,
            bottom: 29,
            right: 0,
            '--scale-anim-min': 1,
          })
        )
      "
    ></button>
  </div>
</template>

<script lang="ts">
import HeaderTop from '@/components/HeaderTop/index.vue';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import StatusBarMixin from '@/mixins/StatusBarMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
import { openAppH5LinkPreferLocal } from '@/utils/navigator';
import ButtonLockController from '@/controller/ButtonLockController';
// import { tryMergeLocalesForVPrjCheckin } from '@/locales/Page/VPrj/VC/init';
import {
  ROUTENAME_INAPP_V_TOPUP_RANKING,
  ROUTEPATH_V_TOPUP_RANKING_MIX2,
} from '../constants/localRoutePath';
import { webpFilter } from '../directives/webp';
import { RankActivityTimeMixin } from '@/modules/TopupRanking/TopupRank.state';
tryMergeLocalesForVPrjCommon();

// tryMergeLocalesForVPrjCheckin();//
@Component({
  components: { HeaderTop },
})
export default class TopupRankingIntroPage extends mixins(
  BindEventMixinDefault,
  StatusBarMixin,
  RankActivityTimeMixin
) {
  statusBarColor = '#861771';
  useInited() {
    this.$tracev('dstrank_activity_exposure');
    this.refreshRankActivityTime();
    return () => {
      //    destroy
    };
  }

  get txtDateDuration() {
    const info = this.RankActivityInfo;
    function renderDt(dt: Date) {
      return `${dt.getDate()}-${dt.getMonth() + 1}-${dt.getFullYear()}`;
    }
    if (info) {
      const startDt = new Date(info.validStartTime);
      const endDt = new Date(info.validEndTime);
      return `${renderDt(startDt)} s/d ${renderDt(endDt)}`;
    } else {
      return '';
    }
  }
  get logoStyle() {
    return this.$ss.getters.normalizeCss(
      { height: 36 },
      '/online/topupRanking/v5/vgame-logo.png'
    );
  }

  get imgList() {
    return [
      {
        no: 1,
        img: '/online/topupRanking/v5/p1.png?webp',
        styleObj: {
          height: 1020 / 2,
          marginBottom: 20,
        },
      },
      {
        no: 2,
        img: '/online/topupRanking/v5/p2.png?webp',
        styleObj: {
          height: 1020 / 2,
          marginBottom: 10,
          // marginTop: -40,
        },
      },
      {
        no: 3,
        img: webpFilter('/online/topupRanking/v5/p3.png?webp'),
        styleObj: {
          width: 341,
          height: 230,
          marginBottom: 10,
        },
      },
    ].map((item) => {
      return {
        no: item.no,
        imgStyle: this.$ss.getters.convertBgImageStyle(
          item.img,
          false,
          this.$ss.getters.designPxsObjToReal(item.styleObj)
        ),
      };
    });
  }

  goToRanking() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    this.$tracev('click_rank_activity_list');
    const rInfo = this.$router.match({
      name: ROUTENAME_INAPP_V_TOPUP_RANKING,
    });
    openAppH5LinkPreferLocal(rInfo?.path || ROUTEPATH_V_TOPUP_RANKING_MIX2, {});
  }
  goToBonusTopup() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    const rInfo = this.$router.match({
      name: ROUTENAME_INAPP_V_TOPUP_RANKING,
    });
    openAppH5LinkPreferLocal(
      (rInfo?.path || ROUTEPATH_V_TOPUP_RANKING_MIX2) + '?tab=bonus',
      {}
    );
  }
}
</script>
