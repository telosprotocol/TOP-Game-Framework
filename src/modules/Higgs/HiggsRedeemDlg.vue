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
          class="relative rounded-[20px] w-[312px] bg-gradient-to-b from-[#F7D34A] to-[#FEF9DC] p-1"
        >
          <main
            class="rounded-[20px] bg-gradient-to-b from-[#60286D] to-[#232358] pt-10 pb-8 min-h-full"
          >
            <HiggsHeaderUI
              :title="$t('V_HG.Redeem')"
              @close="onCloseClicked"
            ></HiggsHeaderUI>
            <HiggsCoinBlock
              class="mx-2 mb-2"
              :btn-text="$t('V_HG.redeemRecord')"
              @click="onRecordClick"
            ></HiggsCoinBlock>
            <div class="flex items-center justify-center flex-col mx-4 pt-6">
              <AsyncStatus
                :status="status"
                color="white"
                @retry="onRetry"
              ></AsyncStatus>

              <section
                v-if="status === 'ok'"
                class="flex items-center justify-center w-full"
              >
                <div
                  v-for="item in visibleList"
                  :key="item.id"
                  class="flex flex-col items-center mx-3"
                >
                  <div
                    class="bg-contain bg-center bg-no-repeat flex items-center justify-center relative mb-2.5 flex-col"
                    :style="
                      $ss.getters.convertBgImageStyle(
                        require('@/assets/higgs/redeemBlockBg.png?webp'),
                        true,
                        $ss.getters.designPxsObjToReal({
                          width: 104,
                          height: 104,
                        })
                      )
                    "
                  >
                    <div
                      class="w-20 h-20 bg-contain bg-center bg-no-repeat"
                      :style="
                        $ss.getters.convertBgImageStyle(
                          item.redemptionItemImageUrl,
                          false
                        )
                      "
                    ></div>
                    <div
                      class="text-white -mt-4 font-rubik text-lg leading-none font-black vgradient-text-outline"
                      :data-text="item.txtRedemptionItemAmount"
                    >
                      {{ item.txtRedemptionItemAmount }}
                    </div>
                    <div
                      class="absolute left-2 top-2 rounded-full text-white px-1.5 py-[1px] text-xs bg-[#9B6C4F]"
                    >
                      {{
                        $tc(
                          'V_HG.nTimes',
                          item.label === '1' || item.label === '0' ? 1 : 3,
                          {
                            n: item.label === '-1' ? '∞' : item.label,
                          }
                        )
                      }}
                    </div>
                  </div>
                  <button
                    @click="onRedeemButtonClick(item)"
                    class="h-8 w-28 rounded-full font-rubik font-black box-border italic border text-white text-sm border-[#C3711E] vshadow-stroke shadow-[#B14A01] flex items-center justify-center active:scale-95"
                    :style="{
                      background:
                        'linear-gradient(180deg, #FC7700 0%, #FB7400 26%, #FB6800 48%, #FB6B00 72%, #FFCCA5 100%)',
                    }"
                  >
                    <div
                      class="bg-contain bg-center bg-no-repeat -ml-3 -mr-1.5 shrink-0"
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
                    <div>{{ item.txtAmount }}</div>
                  </button>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
      <portal to="modal">
        <HiggsReddemRecordDlg v-model="isRecordShow"></HiggsReddemRecordDlg>
        <HiggsRedeemIDDlg
          v-model="isRedeemConfirmShow"
          @confirm="onRedeemConfirmed"
        ></HiggsRedeemIDDlg>
        <VGettedRewardsDlg
          v-model="isRewardDlgShow"
          :rewards="rewardList"
        ></VGettedRewardsDlg>
        <HiggsRedeemToShareDlg
          v-model="isShareDlgShow"
          :task-id="redeemInfo ? redeemInfo.shareTaskId : ''"
        ></HiggsRedeemToShareDlg>
        <HiggsRedeemOppsDlg v-model="isRedeemOppsShow"></HiggsRedeemOppsDlg>
        <HiggsTipDlg v-model="isTipShow" :msg="tipMsg"></HiggsTipDlg>
      </portal>
    </div>
  </transition>
</template>

<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Watch, Prop } from 'vue-property-decorator';
import AsyncStatus from '@/components/NoData/AsyncStatus.vue';
import { MS_SECOND_3 } from '@/constants/time';

import { VHiggsRedeemMixin } from './higgs-redeem.state';

import HiggsReddemRecordDlg from './HiggsRedeemRecordDlg.vue';
import HiggsHeaderUI from './HiggsHeaderUI.vue';
import HiggsCoinBlock from './HiggsCoinBlock.vue';
import HiggsRedeemIDDlg from './HiggsRedeemIDDlg.vue';
import { Toast } from 'vant';
import VGettedRewardsDlg from '@/modules/VRewardProps/VGettedRewardsDlg.vue';
import type { IVGettedRewardDlgInfo } from '@/modules/VRewardProps/VGettedRewardsDlg.vue';
import HiggsRedeemToShareDlg from './HiggsRedeemToShareDlg.vue';
import HiggsRedeemOppsDlg from './HiggsRedeemOppsDlg.vue';
import { VHiggsDetailMixin } from './higgs-detail.state';
import HiggsTipDlg from './HiggsTipDlg.vue';
import { formatNumberInAbbreviationWithoutId } from '@/store/modules/universe/universe';
import { redemptionPointController } from '@/vservices/client/PointController';

@Component({
  components: {
    AsyncStatus,
    HiggsReddemRecordDlg,
    HiggsHeaderUI,
    HiggsCoinBlock,
    VGettedRewardsDlg,
    HiggsRedeemIDDlg,
    HiggsRedeemToShareDlg,
    HiggsRedeemOppsDlg,
    HiggsTipDlg,
  },
})
export default class HiggsReddemDlg extends mixins(
  PopupMixin,
  VHiggsRedeemMixin,
  VHiggsDetailMixin
) {
  @Prop({
    type: Object,
  })
  redeemInfo?: { share?: boolean; shareTaskId?: string };

  //#region Dlg Basic Setting
  dlgSound = true;
  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.refreshVHiggsRedeem(0);
      this.$tracev('higgs_coin_reedem_exposure');
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$tracev('close_higgs_coin_reedem');
    this.emitDlgVisible(false);
  }
  //#endregion

  isRecordShow = false;
  onRecordClick() {
    this.$tracev('click_higgs_coin_reedem_records');
    this.isRecordShow = true;
  }

  //#region
  get status() {
    return this.stateItemVHiggsRedeemRef.status;
  }

  onRetry() {
    this.refreshVHiggsRedeem(MS_SECOND_3);
  }

  get visibleList() {
    return (this.VHiggsRedeem || []).slice(0, 2).map((item) => {
      return {
        ...item,
        txtAmount: formatNumberInAbbreviationWithoutId(
          Number(item.amount),
          6,
          6
        ),
        txtRedemptionItemAmount: formatNumberInAbbreviationWithoutId(
          Number(item.redemptionItemAmount),
          6,
          6
        ),
      };
    });
  }
  //#endregion

  isRedeemConfirmShow = false;
  isRewardDlgShow = false;
  rewardList: IVGettedRewardDlgInfo[] = [];
  isShareDlgShow = false;
  isRedeemOppsShow = false;
  isTipShow = false;
  tipMsg = '';
  async onRedeemConfirmed(info: {
    targetId?: string;
    mobile?: string;
    nickname?: string;
  }) {
    const item = this.redeemItem;
    const res = await redemptionPointController({
      id: item.id,
      targetId: info.targetId,
      mobile: info.mobile,
      nickname: info.nickname,
    });
    if (res.success) {
      this.$tracev('higgs_coin_reedem_exchange_result', {
        higgs_coin: item.amount + '',
        article_id: item.redemptionItemId,
        article_name: item.propType,
      });
      if (item.propType === 'HIGGS_EXCHANGE_TICKET') {
        this.tipMsg = this.$t('V_HG.redeemOK') as string;
        this.isTipShow = true;
        this.isRedeemConfirmShow = false;
      } else {
        this.rewardList = [
          {
            icon: item.redemptionItemImageUrl,
            num: item.redemptionItemAmount,
          },
        ];
        this.isRewardDlgShow = true;
      }
      this.refreshVHiggsRedeem(0);
      this.refreshVHiggsDetail(0);
    } else {
      if (res.code === 21036) {
        //
        this.isShareDlgShow = true;
      } else if (res.code === 21038) {
        this.isRedeemOppsShow = true;
      } else {
        this.$tracev('higgs_coin_reedem_lack_exposure', {
          err_msg: res.message,
        });
        Toast(res.message);
      }
    }
  }
  redeemItem: API.PointsRedemptionConfigVO;
  async onRedeemButtonClick(item: API.PointsRedemptionConfigVO) {
    this.$tracev('click_higgs_coin_reedem_exchange', {
      higgs_coin: item.amount + '',
      article_id: item.redemptionItemId,
      article_name: item.propType,
    });
    this.redeemItem = item;
    if (item.propType === 'HIGGS_EXCHANGE_TICKET') {
      //      higgs
      this.isRedeemConfirmShow = true;
    } else {
      this.onRedeemConfirmed({});
    }
  }
}
</script>
