<template>
  <GameDlgUI
    :value="value"
    @input="emitDlgVisible"
    :img-title="
      $ss.getters.translateImage({
        en: require('@/assets/benefit/benefit.png?webp'),
        id: require('@/assets/benefit/dana-bantuan.png?webp'),
      })
    "
  >
    <div class="pt-1">
      <div class="flex flex-col items-center">
        <div class="text-center mb-3.5 text-xl font-robot-bold font-bold">
          <div class="text-[#99411A] mb-2">{{ $t('VBF.notHeart') }}</div>
          <div
            class="bg-contain bg-no-repeat bg-center z-0"
            :style="
              $ss.getters.normalizeCss(
                {
                  width: 112,
                  height: 101,
                },
                require('@/assets/benefit/jinbi.png?webp'),
                true
              )
            "
          >
            <div
              class="text-white font-robot-bold font-[700] text-lg vshadow-stroke shadow-[#C65133]"
              style="padding-top: 60px"
            >
              500
            </div>
          </div>
        </div>
        <button
          class="vbtn vbtn--primary mx-auto relative z-20 active:scale-95 mb-3"
          :style="$ss.getters.normalizeCss({ width: 240 })"
          @click="receiveBlessing"
        >
          {{ $t('VBF.receiveBlessing') }}
        </button>
      </div>
    </div>
  </GameDlgUI>
</template>

<script lang="ts">
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
import { emitGBus } from '@/utils/GBus';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import GameDlgUI from '../UI/GameDlgUI.vue';
import { stateItemVActivityHallList } from '../VActivityList/activity-hall.state';
import { updateVAssetInfo } from '../VAssetInfo/VAsset.utils';
import type { IUserPropRewardItemBase } from '../VRewardProps/controller/prop.model';
@Component({
  components: { GameDlgUI },
})
export default class BenefitDlg extends mixins(BaseDlgMixin) {
  @Prop({
    type: Object,
  })
  reward: {
    imageUrl: string;
    nameText: string;
  };

  async receiveBlessing() {
    emitGBus('openGameHallGetPropDlg', {
      propList: [
        { type: 'BONUS_GOLD', propNum: 500 },
      ] as IUserPropRewardItemBase[],
    });
    updateVAssetInfo(0);
    stateItemVActivityHallList.tryUpdate(0);
    this.$emit('updateActivity');
    this.emitDlgVisible(false);

    // const res = await vGameClaimTomorrowGiftTaskController({
    //   taskId: '',
    // });
    // if (res.success) {
    //   emitGBus('openGameHallGetPropDlg', {
    //     propList: res.data[0].rewards as IUserPropRewardItemBase[],
    //   });
    //   updateVAssetInfo(0);
    //   stateItemVActivityHallList.tryUpdate(0)
    //   this.$emit('updateActivity');
    //   this.emitDlgVisible(false);
    // } else {
    //   Toast(res.message);
    // }
  }
}
</script>
