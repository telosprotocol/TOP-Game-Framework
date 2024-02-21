<template>
  <div>
    <transition name="tz-transwrap">
      <div
        class="tz-modal tz-transwrap-scale"
        ref="dlgWrap"
        v-if="value"
        v-bind="$attrs"
      >
        <div class="tz-modal_mask"></div>
        <!-- Dlg Container: FullScreen -->
        <div
          class="absolute inset-0 flex items-center justify-center tz-transel-scaleInOut"
        >
          <!-- DlgContent Include bg -->
          <div class="relative w-full flex">
            <div
              class="p-[3px] rounded-md bg-gradient-to-b from-[#C492E0] to-[#AF93C8] mx-auto"
            >
              <button
                @click="onCloseClicked"
                class="absolute right-4 -top-2 -translate-y-full w-[30px] h-[30px] bg-contain bg-center bg-no-repeat active:scale-95"
                v-webp="
                  require('@/assets/vcommon/close/btnPurpleClose2.png?webp')
                "
              ></button>
              <header
                class="rounded-t-md bg-gradient-to-b from-[#7A4FC2] to-[#996BD7] h-12 py-0.5 flex items-center justify-center"
              >
                <div
                  class="font-black font-rubik text-xl vgradient-text vstroke"
                  :style="{
                    '--v-color-from': '#FFFFFF',
                    '--v-color-to': '#EAD1FF',
                    '--tw-stroke-width': '2px',
                    '--tw-stroke-color': '#4E2A7A',
                  }"
                >
                  {{ $t('VBG.propDetail') }}
                </div>
              </header>
              <main
                class="w-[316px] rounded-md bg-gradient-to-b from-[#FBF6FF] to-[#F3E6FF] px-4 py-5"
              >
                <section class="flex mb-2">
                  <!-- Icon -->
                  <div
                    class="bg-gradient-to-b from-[#EECFF6] to-[#CDABDF] p-[1px] rounded-md w-[90px] h-[90px] mb-1"
                  >
                    <div
                      class="w-full h-full bg-gradient-to-b from-[#F3E7FF] to-[#E0CEF8] rounded-md p-1 flex items-center justify-center"
                    >
                      <div
                        class="bg-contain bg-center bg-no-repeat mx-auto my-1"
                        :style="iconStyle"
                      ></div>
                    </div>
                  </div>
                  <div class="flex-1 shrink-0 overflow-hidden ml-2">
                    <div
                      class="tz-ellipsis-break-2 mb-2 text-sm text-[#333] font-medium font-rubik"
                    >
                      {{ propInfo.nameText }}
                    </div>
                    <div class="text-xs font-rubik">
                      {{ $t('VBG.quantity') }}:
                      <span
                        class="font-medium text-sm text-[#8315C9] vshadow-stroke shadow-white"
                      >
                        {{ sInfo.stackNum }}
                      </span>
                    </div>
                  </div>
                </section>
                <div class="text-xs text-[#666] tz-ellipsis-break-3">
                  {{ propInfo.descriptionText || '' }}
                </div>
                <div v-if="isUsable">
                  <!-- Input -->
                  <VStepNumber
                    v-if="sInfo.stackNum > 1"
                    :max-value="sInfo.stackNum"
                    v-model="curUseNum"
                  >
                  </VStepNumber>
                  <button
                    class="vbutton vbutton--green font-rubik w-full h-12 active:scale-95 my-3 mt-6"
                    @click="onUseClick"
                  >
                    {{ $t('V.use') }}
                  </button>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <portal to="modal">
      <VPropPhoneTicketUseDlg
        ref="useTicketDlg"
        v-model="isPhoneTicketShow"
        :use-num="curUseNum"
        :info="propInfo"
        @used="onUseTicketSuccess"
      ></VPropPhoneTicketUseDlg>
      <VGettedRewardsDlg
        v-model="isGettedRewardDlgShow"
        :rewards="gettedRewards"
      ></VGettedRewardsDlg>
    </portal>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
import { Prop, Watch } from 'vue-property-decorator';
import { tryMergeLocalesForVPrjMyBag } from '@/locales/Page/VPrj/VBG/init';
import type { IUserPropItem } from './controller/prop.model';
import VStepNumber from './VStepNumber.vue';

import type { IVGettedRewardDlgInfo } from '@/modules/VRewardProps/VGettedRewardsDlg.vue';
import { updateRewardsByPropTypes } from '@/modules/VAssetInfo/VAsset.utils';
import { Toast } from 'vant';
import VPropPhoneTicketUseDlg from './VPropPhoneTicketUseDlg.vue';
import VGettedRewardsDlg from '@/modules/VRewardProps/VGettedRewardsDlg.vue';
import { convertPropBagItemToPropReward } from './controller/prop.utils';
import {
  getIsPropUsableForCommonUse,
  getRewardDlgInfoByPropReward,
} from './controller/prop.utils';
import { propUseUserPropController } from '@/vservices/client/UserPropController';
@Component({
  components: { VStepNumber, VPropPhoneTicketUseDlg, VGettedRewardsDlg },
})
export default class PropDetailDlg extends mixins(BaseDlgMixin) {
  mounted() {
    tryMergeLocalesForVPrjMyBag();
  }
  declare $refs: {
    useTicketDlg: VPropPhoneTicketUseDlg;
    dlgWrap: HTMLDivElement;
  };
  dlgSound = true;
  @Prop({
    type: Object,
    required: false,
  })
  info?: IUserPropItem;

  get propInfo() {
    return convertPropBagItemToPropReward(this.info) || {};
  }

  get sInfo() {
    return this.info || ({} as Partial<IUserPropItem>);
  }
  get iconStyle() {
    return this.$ss.getters.convertBgImageStyle(
      this.propInfo?.imageUrl,
      false,
      this.$ss.getters.designPxsObjToReal({
        width: 57,
        height: 44,
      })
    );
  }

  curUseNum = 0;

  //
  //       +
  //    1   -
  //

  //#region Dlg Basic Setting

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.curUseNum = this.info.stackNum || 0;
      this.$tracev('gamehall_mybag_prop_exposure', this.commonTrace);
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$tracev('close_gamehall_mybag_prop', this.commonTrace);

    this.emitDlgVisible(false);
  }
  //#endregion

  get commonTrace() {
    return {
      prop_id: this.info?.propId,
      prop_name: this.info?.propProductVo?.nameText,
    };
  }

  /**
   *         ，    true，       ，
   */
  @Prop({
    type: Function,
    required: false,
  })
  onPropUseClick: (info: API.UserPropUseAO, propInfo: IUserPropItem) => boolean;
  isGettedRewardDlgShow = false;
  gettedRewards: IVGettedRewardDlgInfo[] = [];
  isPhoneTicketShow = false;

  get isUsable() {
    return getIsPropUsableForCommonUse(this.info);
  }

  async onUseClick() {
    if (!ButtonLockController.Instance.tryGetLock('use', 0.5)) {
      return;
    }
    const curItem = this.info;
    const propInfo = this.propInfo;
    this.$tracev('click_gamehall_mybag_prop_use', {
      ...this.commonTrace,
      prop_number: this.curUseNum,
    });
    if (
      propInfo.type === 'PHONE_CHARGE_TICKET' ||
      propInfo.type === 'FLOW_CARD'
    ) {
      this.isPhoneTicketShow = true;
      this.emitDlgVisible(false);
    } else {
      //    VTOKEN
      const curUseNum = this.curUseNum;
      const res = await propUseUserPropController({
        id: curItem.id,
        useNum: curUseNum,
      });
      if (res.success) {
        this.emitDlgVisible(false);
        updateRewardsByPropTypes(propInfo?.type);
        this.gettedRewards = [
          getRewardDlgInfoByPropReward(propInfo, curUseNum),
          // {
          //   icon: propInfo.imageUrl,
          //   text: `${propInfo.nameText}x${curItem.stackNum}`,
          // },
        ];
        this.isGettedRewardDlgShow = true;
        this.$emit('used');
      } else {
        Toast(res.message);
      }
    }
  }

  onUseTicketSuccess() {
    this.$emit('used');
  }
  closeAll() {
    this.isPhoneTicketShow = false;
    this.isGettedRewardDlgShow = false;
    this.$refs?.useTicketDlg?.closeAll();
  }
}
</script>
