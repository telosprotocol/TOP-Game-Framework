<template>
  <transition name="tz-transwrap">
    <div
      class="tz-modal tz-transwrap-scale flex items-center justify-center"
      v-if="value"
      v-bind="$attrs"
    >
      <div class="tz-modal_mask" @click="onCloseClicked"></div>
      <div
        class="relative w-[336px] rounded-md pb-5 text-[#333] tz-transel-scaleInOut"
        :style="{
          background:
            'linear-gradient(180deg,#8153dd 0%,#fff 20%,#ffffff 100%)',
        }"
      >
        <button
          @click="onCloseClicked"
          class="absolute right-1 -top-2 -translate-y-full w-[30px] h-[30px] bg-contain bg-center bg-no-repeat active:scale-95"
          v-webp="require('@/assets/vcommon/close/btnSimpleClose.png?webp')"
        ></button>
        <main class="flex justify-center flex-col mx-3 pt-6">
          <div
            class="text-base font-robot-bold font-bold mb-2 mx-3 leading-tight"
          >
            {{ $t('VGW.youAreInOrderAtX') }}
          </div>
          <div class="text-center robot-regular mb-3">
            <span class="text-[#F9471A] text-[35px] font-bold">
              {{ sInfo.showQueueNum == null ? '-' : sInfo.showQueueNum }}
            </span>
            <!-- <span class="font-black text-[21px] text-[#333]">/1000</span> -->
          </div>

          <div
            class="rounded-full bg-[#F7F3FF] h-8 flex items-center justify-center w-full text-[#6F4CB4] text-sm mb-4"
          >
            <span class="mr-1"> {{ $t('VGW.CurWithdrawNum') }}</span>
            <span class="font-din-bold text-lg">
              {{ txtCurAmount || '-' }}</span
            >
          </div>
          <section
            v-if="WithdrawQueue && WithdrawQueue.moreRechargeCanWithdrawAmount"
            class="w-full px-1 bg-[#F6F6F6] rounded-[10px] flex flex-col items-center text-[#333] py-6 mb-16"
          >
            <div
              class="h-9 w-9 bg-center bg-contain bg-no-repeat mb-6"
              :style="
                $ss.getters.normalizeCss({}, '/online/common/iconGreenOK.svg')
              "
            ></div>
            <h3 class="text-[14px] mb-1.5">
              {{ $t('VGW.congraQueueToAudit') }}
            </h3>
            <i18n path="VGW.rechargeXToEndQueue" tag="div" class="text-xs mb-4">
              <span class="text-[#F9471A]">{{
                WithdrawQueue.moreRechargeCanWithdrawAmount
              }}</span>
            </i18n>
            <button
              @click="onGoToRecharge('withdraw_queue_audit')"
              class="shrink-0 h-6 flex items-center justify-center rounded-full bg-gradient-to-r from-[#FF832C] to-[#FFC658] text-white font-semibold text-xs min-w-[78px] px-3 active:scale-95"
            >
              {{ $t('V.UNDERWAY') }}
            </button>
          </section>
          <div v-else class="max-h-[45vh] overflow-y-auto">
            <section class="w-full px-1">
              <h3 class="text-left text-sm font-semibold mb-2 px-1">
                {{ $t('VGW.quickQueue') }}
              </h3>
              <div>
                <VWithdrawQueueInfoItemUI class="mb-2" :info="quickQueueInfo">
                </VWithdrawQueueInfoItemUI>
              </div>
            </section>
            <section class="w-full px-1" v-if="normalQueueInfo">
              <h3 class="text-left text-sm font-semibold mb-2 px-1">
                {{ $t('VGW.normalQueue') }}
              </h3>
              <div>
                <VWithdrawQueueInfoItemUI class="mb-2" :info="normalQueueInfo">
                </VWithdrawQueueInfoItemUI>
              </div>
            </section>
            <section class="w-full px-1">
              <h3 class="text-left text-sm font-semibold mb-2 px-1">
                {{ $t('VGW.helpQueue') }}
              </h3>

              <VWithdrawQueueInfoItemUI
                class="mb-2"
                v-for="item in taskList"
                :key="item.type"
                :info="item"
              >
              </VWithdrawQueueInfoItemUI>
              <!-- <div
              class="p-2 text-xs mb-3 -mt-2 flex w-full items-center active:scale-95 origin-left"
              @click="refreshQueue"
            >
              <i18n path="VGW.rankUpX" tag="div">
                <span class="text-[#F9471A]">{{
                  sInfo.improveQueueNum || '-'
                }}</span>
              </i18n>
              <div class="iconfont icon-refresh text-[#3D79F2] text-sm"></div>
            </div> -->
            </section>
          </div>
          <section class="w-full px-1">
            <button
              class="bg-gradient-to-r from-[#FFA588] to-[#FF6B6A] rounded-xl text-white text-base w-full font-semibold h-12 active:scale-95"
              @click="onCancelClick"
            >
              {{ $t('VGW.cancelQueue') }}
            </button>
          </section>
        </main>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Toast } from 'vant';
import { Watch } from 'vue-property-decorator';
import { formatVRp } from '@/modules/vFormatter';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/openAppH5LinkPreferLocal';
import { APP_ROUTE_TAB_GAME, getVPayUrl } from '@/constants/APP_SCHEMA_URLS';
import { dealH5Command } from '@/utils/navigator/dealH5Command';
import { ROUTENAME_INAPP_V_GOLDWITHDRAW } from '@/constants/localRoutePath';
import { VWithdrawQueueMixin } from './controller/WithdrawQueue.state';
import { cancelWithdrawQueueController } from '@/vservices/client/WithdrawQueueController';
import VWithdrawQueueInfoItemUI from './VWithdrawQueueInfoItemUI.vue';
@Component({
  components: { VWithdrawQueueInfoItemUI },
})
export default class VWithdrawQueueDlg extends mixins(
  PopupMixin,
  VWithdrawQueueMixin
) {
  get sInfo() {
    return this.sWithdrawQueue;
  }

  get txtCurAmount() {
    const amount = this.sInfo.amount;
    if (amount == null) {
      return '-';
    } else {
      return formatVRp(Number(amount));
    }
  }
  get quickQueueInfo() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias

    return {
      type: 'quick',
      nameText: this.$t('VGW.queueRechargeName'),
      webpIcon: '/online/common/iconSpeedUp.png?webp',
      onClick: () => {
        this.onGoToRecharge('withdraw_limit');
      },
    };
  }

  onGoToRecharge(from: 'withdraw_limit' | 'withdraw_queue_audit') {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    openAppH5LinkPreferLocal(getVPayUrl(from), {});
    this.emitDlgVisible(false);
  }
  get normalQueueInfo() {
    const tomorrowQueueNum = this.WithdrawQueue?.tomorrowQueueNum;
    if (tomorrowQueueNum != null) {
      return {
        type: 'Normal',
        nameText: this.$t('VGW.normalQueueTip', [
          `<span class="text-[#F9471A]">${tomorrowQueueNum}</span>`,
        ]),
        webpIcon: '/online/common/iconQueue.png?webp',
      };
    } else {
      return null;
    }
  }

  get taskList() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    // const that = this;
    return [
      // {
      //   type: 'Recharge',
      //   nameText: this.$t('VGW.taskRecharge'),
      //   onClick() {
      //   },
      // },
      {
        type: 'Invite',
        nameText: this.$t('VGW.taskInvite'),
        webpIcon: '/online/common/iconTask.png?webp',
        onClick() {
          if (!ButtonLockController.Instance.tryGetNavLock()) {
            return;
          }
          dealH5Command('/h5command/share?template=game', {
            shareType: 'withdraw_limit',
            share_initialfrom: ROUTENAME_INAPP_V_GOLDWITHDRAW,
          });
        },
        hasOnGoingBtn: true,
      },
      {
        type: 'Game',
        webpIcon: '/online/common/iconTask.png?webp',
        nameText: this.$t(
          'VGW.taskGame'
          // , [
          //   this.sInfo.showGameImproveQueueNum ?? '-',
          // ]
        ),
        onClick() {
          if (!ButtonLockController.Instance.tryGetNavLock()) {
            return;
          }
          openAppH5LinkPreferLocal(APP_ROUTE_TAB_GAME, {});
        },
        hasOnGoingBtn: true,
      },
    ];
  }
  //#region Dlg Basic Setting

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$trace('line_up_withdrawal_exposure');
      this.refreshQueue();
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }

    this.emitDlgVisible(false);
  }
  //#endregion

  async refreshQueue() {
    if (!ButtonLockController.Instance.tryGetLock('refresh', 0.5)) {
      return;
    }
    this.$trace('click_ranking_line_up_withdrawal', {});
    this.refreshVWithdrawQueue(10);
  }

  async onCancelClick() {
    if (!ButtonLockController.Instance.tryGetLock('cancel', 0.5)) {
      return;
    }
    this.$trace('click_cancel_line_up_withdrawal');
    const res = await cancelWithdrawQueueController();
    if (res.success) {
      this.emitDlgVisible(false);
      //
      this.$emit('update');
    } else {
      Toast(res.message);
    }
  }
}
</script>
@/constants/APP_SCHEMA_URLS
