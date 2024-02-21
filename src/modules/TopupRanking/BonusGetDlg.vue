<template>
  <GameDlgUI :value="value" @input="emitDlgVisible">
    <div
      slot="beforeMain"
      class="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 mt-10"
    >
      <div
        class="animate-twSpin bg-contain bg-center bg-no-repeat animate-infinite animate-duration-[3s]"
        :style="
          $ss.getters.normalizeCss(
            { width: 301, height: 301 },
            require('@/assets/vcommon/light/light2.png?webp'),
            true
          )
        "
      ></div>
    </div>
    <div
      class="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="$ss.getters.normalizeCss({ top: -16 })"
      slot="titleWrap"
    >
      <OpenedEggUI :image="reward ? reward.imageUrl : null"></OpenedEggUI>
    </div>
    <div class="pt-20">
      <div class="flex flex-col items-center">
        <div class="text-center mb-3.5 text-xl font-robot-bold font-bold">
          <div class="text-[#99411A]">Selamat Anda Mendapatkan</div>
          <div class="text-[#E36500]">
            {{ reward ? reward.nameText : '' }}
          </div>
        </div>
        <button
          class="vbtn vbtn--green mx-auto relative z-20 active:scale-95 mb-3"
          :style="$ss.getters.normalizeCss({ width: 240 })"
          @click="emitDlgVisible(false)"
        >
          Klaim Hadiah
        </button>
      </div>
    </div>
  </GameDlgUI>
</template>

<script lang="ts">
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import GameDlgUI from '../UI/GameDlgUI.vue';
import OpenedEggUI from './OpenedEggUI.vue';
@Component({
  components: { GameDlgUI, OpenedEggUI },
})
export default class BonusGetDlg extends mixins(BaseDlgMixin) {
  @Prop({
    type: Object,
  })
  reward: {
    imageUrl: string;
    nameText: string;
  };
}
</script>
