<template>
  <div
    class="bg-gradient-to-b from-[#FFE7A3] to-[#FDFEEC] rounded-md px-2 py-1.5 text-[#881631] flex flex-col items-center relative"
  >
    <div
      class="absolute right-0 bottom-0 bg-contain bg-center bg-no-repeat"
      :style="
        $ss.getters.normalizeCss(
          {
            width: 63,
            height: 59,
          },
          require('@/assets/referMoney/rewardIcon.png?webp'),
          true
        )
      "
    ></div>
    <h5 class="font-robot-medium text-sm font-medium">
      {{ $t('VRM.claimableCash') }}
    </h5>
    <div class="font-rubik font-bold text-[#EE3360] text-[22px] mb-2">
      {{ txtMainCash }}
    </div>
    <button
      @click="onBtnClick"
      class="rounded-full text-white bg-gradient-to-b h-[30px] flex items-center justify-center px-2 text-sm font-robot-medium font-medium whitespace-nowrap"
      :class="{
        'from-[#33EC97] to-[#00A173] mb-1': status === 'toinvite',
        'from-[#D9D9D9] to-[#C5C5C5]': status === 'towait',
        'from-[#FFE173] to-[#FF9C0A]': status === 'available',
      }"
    >
      {{ btnText }}
    </button>
    <i18n
      v-if="status !== 'toinvite'"
      :class="{ invisible: status === 'towait' }"
      path="VRM.accClaim"
      class="text-[#AB5E44] text-xs font-robot-medium font-medium mb-1"
    >
      <span>{{
        $ss.getters.formatFloat(Number(InviteRewardInfoInfo.claimedReward))
      }}</span>
    </i18n>
    <div
      class="text-[#E19F7A] text-[10px] font-robot"
      v-if="status !== 'toinvite'"
    >
      {{ $t('VRM.remindTips') }}
    </div>
    <portal to="modal">
      <VReferMoneyRewardClaimOkDlg
        v-model="isClaimOKShow"
        v-bind="claimOkProps"
      ></VReferMoneyRewardClaimOkDlg>
    </portal>
  </div>
</template>

<script lang="ts">
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import Component, { mixins } from 'vue-class-component';
import { noop } from 'lodash-es';
import { InviteRewardInfoMixin } from './ReferMoneyReward.state';
import ButtonLockController from '@/controller/ButtonLockController';
import { manualClaimInviteRewardUserFissionController } from '@/vservices/client/UserFissionController';
import { Toast } from 'vant';
import { updateRewardsByPropTypes } from '../VAssetInfo/VAsset.utils';
import VReferMoneyRewardClaimOkDlg from './VReferMoneyRewardClaimOkDlg.vue';
import { VUserFissionStatMixin } from '../EarnCash/VUserFissionStat.state';

@Component({
  components: { VReferMoneyRewardClaimOkDlg },
})
export default class VReferMoneyRewardClaimBlock extends mixins(
  InviteRewardInfoMixin,
  BindEventMixinDefault,
  VUserFissionStatMixin
) {
  useInited() {
    this.refreshInviteRewardInfo();
    this.refreshVUserFissionStat();
    return noop;
  }

  get status() {
    const state = this.InviteRewardInfoInfo?.state || 'NO_SUCCESSFUL_INVITE';
    if (state === 'NO_SUCCESSFUL_INVITE') {
      return 'toinvite' as const;
    }
    const tobeClaimReward = this.InviteRewardInfoInfo.tobeClaimReward;
    if (tobeClaimReward && Number(tobeClaimReward) > 0) {
      return 'available' as const;
    }
    return 'towait' as const;
  }

  get txtMainCash() {
    const status = this.status;
    if (status === 'toinvite') {
      return '? ? ?';
    } else if (status === 'available') {
      return this.$t('Base.xRp', {
        n: this.$ss.getters.formatFloat(
          Number(this.InviteRewardInfoInfo.tobeClaimReward)
        ),
      });
    }
    return this.$t('Base.xRp', {
      n: this.$ss.getters.formatFloat(
        Number(this.InviteRewardInfoInfo.tobeIssueReward)
      ),
    });
  }
  // status = 'towait' as 'toinvite' | 'towait' | 'available';

  get btnText() {
    return this.status === 'toinvite'
      ? this.$t('VRM.inviteToUpdate')
      : this.$t('VRM.claimCashRewards');
  }

  isClaimOKShow = false;
  claimOkProps = {
    coinNum: 0,
    hasWithdraw: false,
    smallWithdrawTxt: '300',
  };
  async onBtnClick() {
    const status = this.status;
    if (status === 'towait') {
      return;
    }
    if (status === 'available') {
      if (!ButtonLockController.Instance.tryGetLock('claim-' + status)) {
        return;
      }
      const res = await manualClaimInviteRewardUserFissionController();
      if (res.success) {
        this.claimOkProps = {
          coinNum: res.data.rewards?.[0]?.propNum,
          hasWithdraw: !!this.VUserFissionStat?.hasSmallWithdraw,
          smallWithdrawTxt:
            (this.VUserFissionStat?.smallWithdrawAmountLimit ?? 300) + '',
        };
        this.isClaimOKShow = true;
        this.refreshInviteRewardInfo(0);
        updateRewardsByPropTypes('GOLD');
      } else {
        Toast(res.message);
      }
    } else {
      this.$emit('invite');
    }
  }
}
</script>
