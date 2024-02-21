<template>
  <transition name="tz-transwrap" :duration="250">
    <div class="tz-modal" v-if="value" v-bind="$attrs">
      <div class="tz-modal_mask"></div>
      <!-- Dlg Container: FullScreen -->
      <div
        class="absolute left-0 right-0 bottom-0 max-h-[85vh] box-content flex flex-col tz-transel-slideBottomInOut"
      >
        <!-- DlgContent Include bg -->
        <div
          class="rounded-t-[20px] w-full bg-gradient-to-b from-[#F7D34A] to-[#FEF9DC] p-1 pb-0 relative"
        >
          <HiggsHeaderUI @close="onCloseClicked" :title="$t('V_HG.title')">
          </HiggsHeaderUI>
          <div class="w-full rounded-t-[20px] h-[500px] overflow-auto">
            <div
              class="rounded-t-[20px] bg-gradient-to-b from-[#60286D] to-[#232358] pt-10 pb-2 min-h-full"
            >
              <div class="mx-5">
                <HiggsCoinBlock
                  class="mb-2"
                  :btn-text="$t('V_HG.Redeem')"
                  @click="openRedeemDlg"
                ></HiggsCoinBlock>
                <AsyncStatus :status="status" @retry="onRetry"></AsyncStatus>
                <CardFlip
                  ref="cardFlip"
                  :card-list="clipList"
                  class="-mx-2"
                  v-if="status === 'ok'"
                ></CardFlip>
                <div class="pb-2 -mt-6">
                  <button
                    class="bg-contain bg-center bg-no-repeat p-1 rounded-full active:scale-95 mx-auto block relative z-10"
                    :style="
                      $ss.getters.convertBgImageStyle(
                        require('@/assets/higgs/btnFlip.png?webp'),
                        true,
                        $ss.getters.designPxsObjToReal({
                          width: 113,
                          height: 61,
                        })
                      )
                    "
                    @click="onFlotClick"
                  ></button>
                  <div
                    class="text-center text-white text-xs font-rubik font-medium"
                  >
                    {{
                      $tc(
                        'V_HG.flipTipX',
                        VHiggsDetail ? VHiggsDetail.currentFlopCount : 0,
                        {
                          n: VHiggsDetail ? VHiggsDetail.currentFlopCount : '-',
                        }
                      )
                    }}
                  </div>
                </div>
                <HiggsTasksBlock
                  :is-disabled="isFlotingAnimate"
                ></HiggsTasksBlock>
              </div>
            </div>
          </div>
        </div>
      </div>
      <portal to="modal">
        <HiggsReddemDlg
          :redeem-info="redeemInfo"
          v-model="isRedeemShow"
        ></HiggsReddemDlg>
        <VGettedRewardsDlg
          v-model="isRewardShow"
          :rewards="rewardList"
        ></VGettedRewardsDlg>
      </portal>
    </div>
  </transition>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Watch } from 'vue-property-decorator';
import CardFlip from './CardFlip.vue';
import { VHiggsDetailMixin } from './higgs-detail.state';
import AsyncStatus from '@/components/NoData/AsyncStatus.vue';
import { MS_SECOND_3, MS_SECOND_5 } from '@/constants/time';
import { Toast } from 'vant';
import HiggsReddemDlg from './HiggsRedeemDlg.vue';
import { tryMergeLocalesForVPrjHiggs } from '@/locales/Page/VPrj/V_HG/init';
import VGettedRewardsDlg, {
  IVGettedRewardDlgInfo,
} from '@/modules/VRewardProps/VGettedRewardsDlg.vue';
import HiggsTasksBlock from './HiggsTasksBlock.vue';
import HiggsCoinBlock from './HiggsCoinBlock.vue';
import HiggsHeaderUI from './HiggsHeaderUI.vue';
import { onGBus } from '@/utils/GBus';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
import { flopWashVolumeController } from '@/vservices/client/WashVolumeController';
tryMergeLocalesForVPrjHiggs();

@Component({
  components: {
    CardFlip,
    AsyncStatus,
    HiggsReddemDlg,
    VGettedRewardsDlg,
    HiggsTasksBlock,
    HiggsCoinBlock,
    HiggsHeaderUI,
  },
})
export default class HiggsDlg extends mixins(
  BaseDlgMixin,
  BindEventMixinDefault,
  VHiggsDetailMixin
) {
  declare $refs: {
    cardFlip: CardFlip;
    dlgWrap?: HTMLDivElement;
  };
  useInited() {
    return onGBus('onVTaskUpdate', (payload) => {
      if (
        this.value &&
        ((payload.type === 'single' &&
          payload.taskModuleType === 'HIGGS_DAY') ||
          payload.type === 'behavior')
      ) {
        if (!this.isFlotingAnimate) {
          this.refreshVHiggsDetail(10);
        }
      }
    });
  }

  //#region Dlg Basic Setting
  dlgSound = true;
  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.needUpdate = false;
      this.isFlotingLoading = false;
      this.isFlotingAnimate = false;
      this.$refs.cardFlip?.reset();
      this.refreshVHiggsDetail(0);

      this.$tracev('gamehall_higgs_coin_exposure');
    }
  }

  onCloseClicked() {
    if (this.isFlotingAnimate) {
      //
      return;
    }
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$tracev('close_gamehall_higgs_coin');

    this.emitDlgVisible(false);
    this.$emit('close', this.needUpdate);
  }

  /**
   *      ，
   */
  needUpdate: boolean;
  //#endregion

  //#region

  get clipList() {
    return this.VHiggsDetail?.flopRewards || [];
  }

  get taskList() {
    return this.VHiggsDetail?.tasks || [];
  }

  get status() {
    if (this.isFlotingLoading) {
      return 'ok';
    }
    return this.stateItemVHiggsDetailRef.status;
  }

  onRetry() {
    this.refreshVHiggsDetail(MS_SECOND_3);
  }
  //#endregion

  isRedeemShow = false;
  redeemInfo: {
    share?: boolean;
    shareTaskId?: string;
  } = {};
  openRedeemDlg() {
    if (this.isFlotingAnimate) {
      return;
    }
    this.$tracev('click_higgs_coin_reedem');
    const VHiggsDetail = this.VHiggsDetail;
    this.redeemInfo = {
      share: VHiggsDetail?.share,
      shareTaskId: VHiggsDetail?.shareTaskId,
    };
    this.isRedeemShow = true;
  }

  isRewardShow = false;
  rewardList: IVGettedRewardDlgInfo[] = [];

  isFlotingAnimate = false;
  isFlotingLoading = false;
  async onFlotClick() {
    if (!this.VHiggsDetail) {
      return false;
    }

    if (this.isFlotingAnimate) {
      return;
    }
    this.$tracev('click_higgs_coin_flop');
    const VHiggsDetail = this.VHiggsDetail;
    this.isFlotingAnimate = true;
    const res = await flopWashVolumeController(
      {
        propId: VHiggsDetail.prop.id,
      },
      {
        timeout: MS_SECOND_5,
      }
    );
    this.needUpdate = true;
    if (!res.success) {
      this.$tracev('higgs_coin_flop_numberlow_exposure', {
        flop_content: res.message,
      });
      Toast(res.message);
      this.isFlotingAnimate = false;
    } else {
      await this.$refs.cardFlip.startPlay(res.data);
      this.isFlotingAnimate = false;
      this.isFlotingLoading = true;
      const item = this.VHiggsDetail.flopRewards.find(
        (item) => item.rewardId === res.data
      );
      this.rewardList = [
        {
          icon: item.imageUrl,
          num: Number(item.rewardAmount),
        },
      ];
      this.isRewardShow = true;
      this.$tracev('higgs_coin_flop_result_exposure', {
        flop_coin: item.rewardAmount,
      });
      this.refreshVHiggsDetail(0);
    }
  }
}
</script>
