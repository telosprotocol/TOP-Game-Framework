<template>
  <div
    class="relative z-0 rounded-[8px] bg-contain bg-no-repeat bg-center"
    :style="cardStyle"
  >
    <div
      class="rounded-t-[8px] font-rubik font-bold italic text-base flex items-center justify-center"
      :style="headStyle"
    >
      {{ txtDay }}
    </div>
    <main
      class="overflow-hidden absolute rounded-b-[8px]"
      :style="
        $ss.getters.designPxsObjToReal({
          left: 3,
          right: 3,
          top: 35,
          bottom: 3,
        })
      "
    >
      <!-- Light -->
      <div
        class="absolute left-1/2 top-full mt-3 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          class="bg-contain bg-center bg-no-repeat"
          :class="{
            'animate-twSpin animate-infinite animate-duration-[5s]':
              status === 'TO_BE_SIGNED',
          }"
          :style="
            $ss.getters.convertBgImageStyle(
              require('@/assets/vcommon/light/light2.png?webp'),
              true,
              $ss.getters.designPxsObjToReal({
                width: 300,
                height: 300,
              })
            )
          "
        ></div>
      </div>
      <div
        :style="rewardIconStyle"
        class="bg-contain bg-center bg-no-repeat mb-1 mt-2 absolute left-4 -top-3"
      >
        <div
          class="absolute top-6 ml-2 left-full font-rubik font-bold italic text-2xl text-[#FFDA5C] vshadow-stroke shadow-[#922F1C]"
        >
          {{ txtAmount }}
        </div>
      </div>
      <!-- Golds Deco -->
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          class="bg-contain bg-center bg-no-repeat"
          :class="{
            ' vpulse animate-duration-500  animate-infinite':
              status === 'TO_BE_SIGNED',
          }"
          :style="
            $ss.getters.convertBgImageStyle(
              '/online/common/dlgDecoration/goldDeco.png?web',
              true,
              $ss.getters.designPxsObjToReal({
                width: 252,
                height: 67,
                '--animate-scale': '1.1',
              })
            )
          "
        ></div>
      </div>
    </main>
    <!-- mask -->
    <div
      v-if="status === 'SIGNED'"
      class="absolute inset-0 rounded-[8px]"
      :style="{ background: 'rgba(87, 33, 0, 0.60)' }"
    >
      <div
        class="bg-contain bg-center bg-no-repeat absolute -translate-x-1/2 -translate-y-1/2"
        :style="
          $ss.getters.convertBgImageStyle(
            require('@/assets/checkin/checkin_checked.png?webp'),
            true,
            $ss.getters.designPxsObjToReal({
              width: 55,
              height: 49,
              marginTop: 20,
              left: '50%',
              top: '50%',
            })
          )
        "
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { getCoinConfig } from '@/modules/VAssetInfo/VCoin.config';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class CheckinDay7Item extends Vue {
  @Prop({
    type: Number,
    default: 7,
  })
  day: number;
  @Prop({
    type: Object,
    required: false,
  })
  info?: API.CheckInDayVO;

  get cardStyle() {
    if (this.status === 'TO_BE_SIGNED') {
      return this.$ss.getters.convertBgImageStyle(
        require('@/assets/checkin/checkBlock7Active.png?webp'),
        true,
        this.$ss.getters.designPxsObjToReal({
          width: 280,
          height: 107,
          // boxShadow:
          //   '0px 2px 5px 0px rgba(191,116,0,0.65), inset 0px -2px 3px 0px rgba(255,149,25,0.51)',
        })
      );
    } else {
      return this.$ss.getters.convertBgImageStyle(
        require('@/assets/checkin/checkBlock7.png?webp'),
        true,
        this.$ss.getters.designPxsObjToReal({
          width: 280,
          height: 107,
          // boxShadow:
          //   '0px 2px 5px 0px rgba(191,116,0,0.65), inset 0px -2px 3px 0px rgba(255,149,25,0.51)',
        })
      );
    }
  }
  get txtDay() {
    return this.$t('VG.DAYX', { X: this.day });
  }
  get txtAmount() {
    const info = this.info;
    if (!info) {
      return '';
    }
    const config = getCoinConfig(info.rewardType);
    return config.format(Number(info.rewardAmount));
  }
  get rewardIconStyle() {
    return this.$ss.getters.convertBgImageStyle(
      this.info?.rewardPic,
      false,
      this.$ss.getters.designPxsObjToReal({
        width: 107,
        height: 84,
      })
    );
  }

  get status() {
    return this.info?.checkInStatus || 'NOT_SIGNED'; // checked,active,tomorrow
  }

  get hasAnimate() {
    return true;
  }

  get headStyle() {
    return this.$ss.getters.designPxsObjToReal({
      height: 36,
      color: '#FFC72D',
      textShadow:
        '0px -1px 0 #C45C3C,-1px 0px 0 #C45C3C,1px 0px 0 #C45C3C,  0px 1px 0px #922F1C, 0px 2px 2px #922F1C',
    });
  }
}
</script>
