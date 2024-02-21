<template>
  <section
    class="rounded-xl bg-gradient-to-b from-[#FFD59B] to-[#FFAC41] px-2 py-1 text-black flex items-center justify-between"
  >
    <div
      class="bg-contain bg-no-repeat bg-center flex items-center shrink-0"
      :style="
        $ss.getters.convertBgImageStyle(
          require('@/assets/higgs/higgsInfoBar.png?webp'),
          true,
          $ss.getters.designPxsObjToReal({
            width: 194,
            height: 44,
          })
        )
      "
    >
      <div
        class="bg-contain bg-center bg-no-repeat mr-3"
        :style="
          $ss.getters.convertBgImageStyle(
            require('@/assets/higgs/iconHiggs.png?webp'),
            true,
            $ss.getters.designPxsObjToReal({
              width: 38,
              height: 44,
            })
          )
        "
      ></div>
      <div class="text-white font-semibold flex-1">
        {{ $t('V_HG.HGCOIN') }}
      </div>
      <div
        class="vgradient-text text-right mr-4 text-sm font-rubik font-black vstroke"
        :style="{ '--tw-stroke-color': 'black', '--tw-stroke-width': '1px' }"
      >
        {{ txtHiggsCoin }}
      </div>
    </div>
    <button
      @click="$emit('click')"
      class="w-20 h-[30px] shadow-md rounded-full bg-gradient-to-b from-[#D3E672] via-[#ADC944] to-[#669A18] border border-[#928F1D] text-sm text-white flex items-center justify-center active:scale-95"
    >
      <div class="vshadow-stroke shadow-[#727F3B] leading-none">
        {{ btnText }}
      </div>
    </button>
  </section>
</template>

<script lang="ts">
import { formatNumberInAbbreviationWithoutId } from '@/store/modules/universe/universe';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator/lib/decorators/Prop';
import { VHiggsDetailMixin } from './higgs-detail.state';
@Component({
  components: {},
})
export default class HiggsCoinBlock extends mixins(VHiggsDetailMixin) {
  get txtHiggsCoin() {
    const higgsBalance = this.VHiggsDetail?.higgsBalance;
    if (higgsBalance == null) {
      return '';
    }
    return formatNumberInAbbreviationWithoutId(higgsBalance, 6, 0);
  }

  @Prop({
    type: String,
  })
  btnText: string;
}
</script>
