<template>
  <transition name="tz-transwrap">
    <div class="tz-modal tz-transwrap-scale" v-if="value" v-bind="$attrs">
      <div class="tz-modal_mask"></div>
      <!-- Dlg Container: FullScreen -->
      <div
        class="absolute inset-0 flex items-center justify-center tz-transel-scaleInOut"
      >
        <!-- DlgContent Include bg -->
        <div
          class="relative w-80 rounded-xl bg-gradient-to-b from-[#AA76F1] to-[#8153DD] text-[#9D5C37] pt-8 pb-6"
        >
          <!-- Title   -->
          <div
            class="absolute z-0 left-1/2 -translate-x-1/2 bg-contain bg-center bg-no-repeat font-rubik font-bold text-2xl text-center"
            :style="
              $ss.getters.convertBgImageStyle(
                require('@/assets/vcommon/ribbon-bg/redRibbon.png?webp'),
                true,
                $ss.getters.designPxsObjToReal({
                  height: 81,
                  width: 360,
                  top: -46,
                  paddingTop: 11,
                })
              )
            "
          >
            <div
              class="vgradient-text-outline vgradient-text-outline--yellow"
              :data-text="dlgTitle"
            >
              {{ dlgTitle }}
            </div>
          </div>
          <!-- CloseButton -->
          <button
            @click="onCloseClicked"
            v-webp="require('@/assets/vcommon/close/btnPurpleClose.png?webp')"
            class="absolute right-0 -top-5 -translate-y-full w-[30px] h-[30px] bg-contain bg-center bg-no-repeat active:scale-95 z-20"
          ></button>
          <main class="bg-[#FFF4DA] rounded-xl mx-2 pt-6 pb-4 px-2 mt-0.5">
            <div class="px-2 text-[#333]">
              <input
                class="h-10 w-full mb-7 border border-solid border-[#E2B959] rounded-md text-xl font-medium text-center px-2 vplaceholder flex items-center justify-center"
                :style="
                  $ss.getters.designPxsObjToReal({
                    '--tz-v-placeholder-color': '#666',
                    '--tz-v-placeholder-size': 14,
                    '--tz-v-placeholder-weight': '400',
                    '--tz-v-placeholder-y': -4,
                  })
                "
                :maxlength="32"
                v-model="txtCode"
                :placeholder="$t('VG.enterExchangeCode')"
              />
            </div>
            <button
              class="vbutton font-rubik w-full h-12 active:scale-95"
              :disabled="!isSubmitable"
              @click="onSubmitClick"
            >
              {{ $t('Base.CONFIRM') }}
            </button>
          </main>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import { Toast } from 'vant';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import ButtonLockController from '@/controller/ButtonLockController';
import type { IVGettedRewardDlgInfo } from '@/modules/VRewardProps/VGettedRewardsDlg.vue';
import { activateRedeemCodeActivateController } from '@/vservices/client/RedeemCodeActivateController';
import { updateRewardsByPropTypes } from '@/modules/VAssetInfo/VAsset.utils';

@Component({
  components: {},
})
export default class VExchangeCodeDlg extends mixins(PopupMixin) {
  //#region Dlg Basic Setting

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.txtCode = '';
      this.$tracev('redemption_code_exposure');
    }
  }

  onCloseClicked() {
    //   
    this.$tracev('close_redemption_code');

    this.emitDlgVisible(false);
  }
  //#endregion

  get dlgTitle() {
    return this.$t('VG.exchangeCode');
  }

  txtCode = '';

  get isSubmitable() {
    return this.txtCode.length >= 4;
  }

  async onSubmitClick() {
    if (!this.isSubmitable) {
      return;
    }
    if (!ButtonLockController.Instance.tryGetLock('submit')) {
      return;
    }
    const res = await activateRedeemCodeActivateController({
      redeemSymbol: this.txtCode,
    });
    this.$tracev('click_redemption_code_handin', {
      redemption_code: this.txtCode,
      exchange_result: res.success ? 'success' : 'fail',
    });
    if (res.success) {
      this.$emit('openGettedReward', {
        num: Number(res.data.rewardAmount),
        coin: res.data.rewardType,
      } as IVGettedRewardDlgInfo);
      //  
      updateRewardsByPropTypes('GOLD');
      this.emitDlgVisible(false);
    } else {
      Toast(res.message);
    }
  }
}
</script>
