<template>
  <div
    v-if="curDay <= 7 && VCheckinActivity"
    class="bg-[#FF5E48] rounded-xl p-1.5 pt-6"
  >
    <slot></slot>
    <header class="mb-2 robot-bold text-xs leading-none flex-1 mx-1 text-white">
      {{ $t('VEC.ContinuesCheckInsClaim') }}
    </header>
    <main class="bg-white rounded-[8px] pb-3 pt-2 p-4 px-3">
      <div class="flex items-center justify-between flex-wrap">
        <div
          v-for="item in dayList"
          :key="item.day"
          :style="item.wrapStyle"
          @click="onDayClick(item)"
          class="bg-[#FF5E48] bg-opacity-[0.08] text-center rounded-lg relative overflow-hidden cursor-pointer shrink-0 mb-3"
          :class="{
            'text-[#FF832C]': item.day < curDay,
            'text-[#666]': item.day > curDay,
          }"
        >
          <div
            class="text-xs flex items-center justify-center h-6 rounded-t-lg"
            :class="{
              'text-white bg-gradient-to-r from-[#FF832C] to-[#FF9D58]':
                item.day === curDay,
            }"
          >
            Day {{ item.day }}
          </div>

          <template v-if="item.day === 7 || item.day === 6">
            <div
              class="absolute left-0 right-0 bg-contain bg-center bg-no-repeat mx-auto mb-1"
              :style="
                $ss.getters.normalizeCss(
                  {
                    height: item.day === 6 ? 78 : 136 / 2,
                    marginTop: item.day === 6 ? -14 : -10,
                  },
                  item.day === 6
                    ? '/online/earnCash/gift6.png?webp'
                    : '/online/earnCash/gift7.png?webp',
                  true
                )
              "
            ></div>
          </template>
          <template v-else>
            <div
              class="bg-contain bg-center bg-no-repeat w-9 h-9 mx-auto"
              v-webp="require('@/assets/vcommon/CoinGold.png?webp')"
            ></div>

            <div class="text-[#FF832C] mb-1 text-xs font-semibold">
              {{ item.textRewardNum }}
            </div>
          </template>
          <div
            v-if="
              item.day < curDay ||
              (curDay === item.day && item.status === 'SIGNED')
            "
            class="absolute w-full bg-[rgba(0,0,0,0.3)] rounded-lg left-0 right-0 top-0 bottom-0 flex items-center justify-center"
          >
            <div
              class="bg-contain bg-center bg-no-repeat"
              :style="getStatusStyle(item)"
            ></div>
          </div>
        </div>
      </div>
      <button
        class="flex items-center justify-center mx-auto rounded-full px-1.5 py-0.5 font-bold text-white text-sm bg-[#FF2D5F] h-8 w-[202px]"
        @click="onCheckinClick"
      >
        {{ $t('VEC.CheckIn') }}
      </button>
    </main>
    <portal to="modal">
      <EarnCantCheckInDlg v-model="isCantCheckInDlgShow"></EarnCantCheckInDlg>
      <EarnCheckInOkDlg
        :has-withdraw="hasSmallWithdraw"
        v-model="isCheckInOKDlgShow"
        :small-withdraw-txt="smallWithdrawTxt"
        :coin-num="rewardNum"
      ></EarnCheckInOkDlg>
    </portal>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { VCheckinActivityMixin } from '@/modules/CheckinActivity/VCheckinActivity.state';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Toast } from 'vant';
import EarnCantCheckInDlg from './EarnCantCheckInDlg.vue';
import EarnCheckInOkDlg from './EarnCheckInOkDlg.vue';
import { checkInUserFissionController } from '@/vservices/client/UserFissionController';
import { waitUserIsLoginedAuth } from '../../store/modules/user.utils';
import { navigation_login_bridge } from '../../js_bridge/js_call_app_base';
import { BannerOpType } from '../../constants/BannerOpType';
import {
  ROUTEPATH_V_EARN_CASH,
  ROUTENAME_INAPP_V_EARN_CASH,
} from '../../constants/localRoutePath';
import { VUserFissionStatMixin } from './VUserFissionStat.state';
@Component({
  components: {
    EarnCantCheckInDlg,
    EarnCheckInOkDlg,
  },
})
export default class VEarnCheckIn extends mixins(
  VCheckinActivityMixin,
  VUserFissionStatMixin
) {
  get baseDayList() {
    return Array.from({ length: 7 }).map((item, idx) => {
      return {
        day: idx + 1,
      };
    });
  }

  get hasSmallWithdraw() {
    return this.VUserFissionStat?.hasSmallWithdraw;
  }

  get smallWithdrawTxt() {
    const num = this.VUserFissionStat?.smallWithdrawAmountLimit;
    if (num != null) {
      return `Rp` + num;
    }
    return '';
  }

  getStatusStyle(item: typeof VEarnCheckIn.prototype.dayList[0]) {
    const isSigned = item.status === 'SIGNED';
    return this.$ss.getters.convertBgImageStyle(
      isSigned
        ? require('@/assets/vcommon/status/icon_complete.png?webp')
        : require('@/assets/earncash/Miss.png?webp'),
      true,
      this.$ss.getters.designPxsObjToReal({
        height: 40,
        width: 80,
        marginLeft: isSigned ? -8 : 0,
      })
    );
  }

  get curDay() {
    return this.VCheckinActivity?.currentDays || 0;
  }

  get curDayItem() {
    return this.dayList.find((item) => item.isCurDay);
  }
  get dayList() {
    const curDay = this.curDay;
    // const isCurSignIn = this.VCheckinActivity?.signIn || false;
    const list = this.VCheckinActivity?.items || [];
    const commonStyle = this.$ss.getters.designPxsObjToReal({
      width: 65,
      height: 82,
    });
    return this.baseDayList.map((item, idx) => {
      const info = list[idx];
      let status: 'SIGNED' | 'TO_BE_SIGNED' | 'NOT_SIGNED' = 'NOT_SIGNED';
      if (info?.status === 'FINISHED') {
        status = 'SIGNED';
      } else {
        status = curDay === item.day ? 'TO_BE_SIGNED' : 'NOT_SIGNED';
      }
      const prop = info?.propRewards?.[0];
      let textRewardNum = '-';
      if (prop) {
        textRewardNum = `${prop.type === 'GOLD' ? 'Rp' : ''}${prop.propNum}`;
      }
      return {
        day: item.day,
        status: status,
        info,
        isCurDay: item.day === curDay,
        textRewardNum,
        rewardIcon: prop ? prop.imageUrl : '',
        rewardName: prop ? prop.nameText : '',
        wrapStyle:
          item.day === 7 || item.day === 6
            ? this.$ss.getters.designPxsObjToReal({
                width: 104,
                height: 82,
              })
            : commonStyle,
      };
    });
  }

  isCheckInOKDlgShow = false;
  rewardNum = 0;
  isCantCheckInDlgShow = false;

  async onCheckinClick() {
    if (!ButtonLockController.Instance.tryGetLock('checkin', 1)) {
      return;
    }
    this.$trace('click_earn_entrance_signin');
    const isLogined = await waitUserIsLoginedAuth();
    if (!isLogined) {
      navigation_login_bridge(ROUTENAME_INAPP_V_EARN_CASH, {
        opType: BannerOpType.AppLink,
        to: ROUTEPATH_V_EARN_CASH + '?from=' + (this.$route.query.from || ''),
      });
      return;
    }
    const curDay = this.curDayItem;
    if (!curDay) {
      return;
    }
    const taskStauts = curDay.info?.status;
    if (taskStauts === 'AVAILABLE') {
      //     
      const res = await checkInUserFissionController();
      if (res.success) {
        this.rewardNum = curDay.info.propRewards?.[0]?.propNum;
        this.isCheckInOKDlgShow = true;
      } else {
        Toast(res.message);
      }
      this.refreshVCheckinActivity(0);
    } else if (taskStauts === 'UNDERWAY') {
      //  
      this.isCantCheckInDlgShow = true;
    } else {
      return;
    }
  }
  async onDayClick(item: typeof VEarnCheckIn.prototype.dayList[0]) {
    if (!item.isCurDay || !item.info) {
      return;
    }
    this.onCheckinClick();
  }
}
</script>
