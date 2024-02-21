<template>
  <div class="shrink-0 w-[90px]">
    <div
      class="bg-gradient-to-b from-[#EECFF6] to-[#CDABDF] p-[1px] rounded-md w-full h-[90px] mb-1"
    >
      <div
        class="w-full h-full bg-gradient-to-b from-[#F3E7FF] to-[#E0CEF8] rounded-md p-1"
      >
        <div
          class="flex items-center justify-end font-rubik font-medium text-[#8F4309] vshadow-stroke shadow-white text-xs"
        >
          <div
            v-if="txtLeftTime"
            class="iconfont icon-timer scale-90 text-[#C98912]"
          ></div>
          {{ txtLeftTime || '&nbsp;' }}
        </div>
        <div
          class="mx-auto my-1"
          :style="
            $ss.getters.designPxsObjToReal({
              width: 57,
              height: 44,
            })
          "
        >
          <van-image :src="icon" fit="contain" :show-loading="false">
            <template slot="error">
              <img
                :src="require('@/assets/bag_props/propFallback.png')"
                class="object-contain"
              />
            </template>
          </van-image>
        </div>
        <div
          class="text-[#8315C9] text-[14px] leading-none text-right font-rubik font-medium vshadow-stroke shadow-white"
        >
          {{ txtNum }}
        </div>
      </div>
    </div>
    <div class="text-center tz-ellipsis-break-1 text-[#5E3998] text-[11px]">
      {{ nameText }}
    </div>
  </div>
</template>

<script lang="ts">
import { convertMsSecond2TimeInfo, TimeUnit } from '@/utils/datetime';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import type { IUserPropItem } from './controller/prop.model';
import { Image } from 'vant';
@Component({
  components: {
    'van-image': Image,
  },
})
export default class BagItem extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  info: IUserPropItem;

  get nameText() {
    return this.info?.propProductVo?.nameText;
  }

  get txtNum() {
    const num = this.info.stackNum;
    if (num > 1) {
      return `x${num}`;
    } else {
      return '';
    }
  }

  get txtLeftTime() {
    const _leftMs = this.info?._leftMs;
    if (!_leftMs) {
      return ''; //   
    }
    const info = convertMsSecond2TimeInfo(_leftMs, {
      maxUnit: TimeUnit.day,
    });
    if (info.day >= 1) {
      return `${this.$t('Base.xD', [info.day])}${this.$t('Base.xH', [
        info.hour,
      ])}`;
    } else if (info.hour >= 1) {
      return `${this.$t('Base.xH', [info.hour])}:${this.$t('Base.xM', [
        info.minute,
      ])}`;
    } else if (info.minute >= 1) {
      return `${this.$t('Base.xM', [info.minute])}${this.$t('Base.xS', [
        info.second,
      ])}`;
    } else {
      return this.$t('Base.xS', [info.second]);
    }
  }

  get icon() {
    return this.info.propProductVo?.imageUrl || this.defaultIcon; //this.defaultIcon;
  }

  get defaultIcon() {
    return require('@/assets/bag_props/propFallback.png');
  }
}
</script>
