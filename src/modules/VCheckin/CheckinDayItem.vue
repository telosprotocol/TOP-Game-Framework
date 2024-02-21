<template>
  <div
    class="relative z-0 rounded-[8px] bg-contain bg-no-repeat bg-center flex flex-col items-center"
    :style="cardStyle"
  >
    <div
      class="rounded-t-[8px] w-full h-6 font-rubik font-bold italic text-base flex items-center justify-center"
      :style="headStyle"
    >
      {{ txtDay }}
    </div>
    <div
      :style="rewardIconStyle"
      class="bg-contain bg-center bg-no-repeat mb-1 mt-2"
      :class="{
        'vbounce animated animate-infinite': status === 'TO_BE_SIGNED',
      }"
    ></div>
    <div
      class="font-rubik font-bold text-base vstroke leading-none"
      :style="textAmountStyle"
    >
      {{ txtAmount }}
    </div>
    <div
      v-if="status === 'SIGNED'"
      class="absolute inset-0 rounded-[8px]"
      :style="{ background: 'rgba(87, 33, 0, 0.60)' }"
    >
      <div
        class="bg-contain bg-center bg-no-repeat absolute"
        :style="
          $ss.getters.convertBgImageStyle(
            require('@/assets/checkin/checkin_checked.png?webp'),
            true,
            $ss.getters.designPxsObjToReal({
              width: 55,
              height: 49,
              left: 8,
              top: 34,
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
export default class CheckinDayItem extends Vue {
  @Prop({
    type: Number,
    required: true,
  })
  day: number;
  @Prop({
    type: Object,
    required: false,
  })
  info?: API.CheckInDayVO;
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

  get status() {
    return this.info?.checkInStatus || 'NOT_SIGNED'; // checked,active,tomorrow
  }

  get rewardIconStyle() {
    return this.$ss.getters.convertBgImageStyle(
      this.info?.rewardPic,
      false,
      this.$ss.getters.designPxsObjToReal({
        width: 64,
        height: 48,
        '--animate-y-stop1': -12,
        '--animate-y-stop2': -6,
        '--animate-y-stop3': -1,
        '--animate-y-scale-stop1': '1.05',
        '--animate-y-scale-stop2': '1.02',
        '--animate-y-scale-stop3': '0.98',
      })
    );
  }

  get cardStyle() {
    const commonStyle = this.$ss.getters.designPxsObjToReal({
      width: 84,
      height: 104,
    });
    if (this.status === 'TO_BE_SIGNED') {
      //
      return {
        ...commonStyle,
        backgroundImage: 'linear-gradient(to bottom, #E4FB55,#89EE23)',
        border: '1px solid #54BF2A',
        boxShadow: '0px 2px 5px 0px hsla(103, 64%, 46%, 0.33)',
      };
    }
    return {
      ...commonStyle,
      backgroundImage: 'linear-gradient(to bottom, #FFF8E8,#FFD17C)',
      border: '1px solid #F19173',
      boxShadow: '0px 2px 5px 0px rgba(255,164,23,0.33)',
    };
  }

  get headStyle() {
    if (this.status === 'TO_BE_SIGNED') {
      //
      return {
        color: '#076501',
        borderBottom: '1px solid #5F8D0E',
        textShadow: '0px 2px 1px #AEEF6A',
        backgroundImage: 'linear-gradient(to bottom,#B7FA06,#31C401)',
        boxShadow:
          '0px 2px 5px 0px rgba(84, 191, 42, 0.55), 0px 1px 3px 0px #54BF2A',
      };
    }
    return {
      color: '#D13329',
      borderBottom: '1px solid #E28A19',
      textShadow: '0px 2px 1px #FFCE7E',
      backgroundImage: 'linear-gradient(to bottom, #FECF5C,#F19213)',
      boxShadow:
        '0px 2px 5px 0px rgba(255,164,23,0.53), 0px 1px 3px 0px #EFB373',
    };
  }

  get textAmountStyle() {
    if (this.status === 'TO_BE_SIGNED') {
      //
      return {
        color: 'white',
        '--tw-stroke-color': '#157006',
        '--tw-stroke-width': '1px',
        textShadow: '0px 2px 1px rgba(84, 191, 42, 0.55)',
      };
    }
    return {
      color: '#93369A',
    };
  }
}
</script>
