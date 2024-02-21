<template>
  <div class="py-4">
    <section class="rounded-[4px] px-1 pt-5 pb-3 mb-3">
      <div class="flex mb-1.5 items-center">
        <div
          v-for="(item, idx) in teamInfoList"
          class="flex-1 text-center px-0.5 bg-white relative rounded-md h-[72px] mx-1.5"
          :key="idx"
        >
          <div
            class="bg-contain bg-center w-12 h-12 mx-auto -mt-6"
            v-webp="item.icon"
          ></div>
          <div class="font-din-bold text-lg" :class="item.className">
            {{ item.num }}
          </div>
          <div class="robot-medium text-xs text-[#8E4431] tz-ellipsis-break-2">
            {{ item.title }}
          </div>
          <div class="absolute top-1 right-1 text-[#FF8718]" v-if="idx === 2">
            <button
              class="iconfont icon-question-outline"
              @click="openInviteTipDlg"
            ></button>
          </div>
        </div>
      </div>
      <div class="px-2 text-[#DFB4A6] text-xs">
        {{ $t('VRM.teamBlockTip') }}
      </div>
    </section>
    <section class="px-3">
      <h3 class="flex items-center robot-bold text-base mb-1">
        <div
          class="bg-contain bg-center bg-no-repeat mr-1 w-12 h-12"
          :style="
            $ss.getters.convertBgImageStyle(
              require('@/assets/referMoney/iconTeam.png?webp'),
              true
            )
          "
        ></div>
        <div class="flex-1">
          {{ $t('VRM.friendList') }}
        </div>
        <div
          class="text-[13px] leading-loose underline robot-regular text-[#FF8718]"
          @click="onRuleClick"
        >
          {{ $t('VRM.rule') }}
        </div>
        <portal to="modal">
          <VReferTeamRuleDlg v-model="isRuleDlgShow"></VReferTeamRuleDlg>
        </portal>
      </h3>
      <List v-bind="listBinds" v-on="listListeners">
        <div
          v-for="(item, idx) in dataList"
          :key="idx"
          class="flex text-xs text-center py-3"
        >
          <div
            class="rounded-full w-10 h-10 bg-cover bg-no-repeat bg-center mr-2 shrink-0"
            :style="$ss.getters.convertBgImageStyle(item.avatar, false)"
          ></div>
          <div class="flex-1 text-left">
            <div class="flex mb-1">
              <div class="flex-1 overflow-hidden">
                <h3 class="text-[14px] tz-ellipsis-break-1 break-all">
                  {{ item.nickName }}
                </h3>
              </div>
              <div class="shrink-0 ml-2 text-[#DFB4A6]">
                {{
                  $tc('VRM.loggedInDays', item.loginDays, {
                    x: item.loginDays == null ? '-' : item.loginDays,
                  })
                }}
              </div>
            </div>
            <div class="flex items-center justify-between mb-1">
              <div class="text-[#AB5E44]">
                {{ $t('VRM.contributedCoins') }}
                <span class="robot-medium text-[14px] text-[#FF9E2D]">{{
                  item.coinNum
                }}</span>
              </div>
              <button
                class="shrink-0 h-[22px] flex items-center justify-center rounded-full text-white active:scale-95 px-2 ml-1 bg-gradient-to-br from-[#FF4A11] to-[#FFE073] text-[10px]"
                @click="onPushMsgClick(item)"
              >
                <div class="text-xs">{{ $t('VRM.push') }}</div>
              </button>
            </div>

            <div class="text-[#DFB4A6] leading-tight">{{ item.tip }}</div>
          </div>
        </div>
      </List>
      <AsyncStatus color="#997065" :status="asyncStatus">
        <button
          slot="retry-btn"
          class="vbutton vbutton--green font-rubik w-full h-10 active:scale-95 mb-3 mt-4"
          @click="onListLoad('error')"
        >
          {{ $t('Base.Refresh') }}
        </button>
      </AsyncStatus>
    </section>
  </div>
</template>
<i18n>
{
  "en":{
    "Success":"Success"
  },
  "id":{
    "Success":"Sukses"
  }
}
</i18n>
<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import { List } from 'vant';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { noop } from 'lodash-es';
import AsyncStatus from '@/components/NoData/AsyncStatus.vue';
import VReferTeamRuleDlg from './VReferTeamRuleDlg.vue';
// import { mock } from 'mockjs';
import VListMixin from '@/mixins/VListMixin';

import { formatVGold, formatVRp } from '@/modules/vFormatter';
import { formatFloatG } from '@/store/modules/universe/universe';
import { DEFAULT_GAME_AVATAR_URL } from '@/constants/DEFAULT_GAME_AVATAR_URL';
import ButtonLockController from '../../controller/ButtonLockController';
import {
  teamListUserFissionController,
  teamStatUserFissionController,
} from '@/vservices/client/UserFissionController';
import { recallFriendUserInviteController } from '@/vservices/client/UserInviteController';
import { Toast } from 'vant';
@Component({
  components: {
    List,
    AsyncStatus,
    VReferTeamRuleDlg,
  },
})
export default class VReferMoneyTeamTab extends mixins(
  BindEventMixinDefault,
  VListMixin<API.UserFissionTeamMemberPageVO>
) {
  useInited() {
    this.onListLoad('init');
    this.refreshStInfo();
    return noop;
  }

  async refreshStInfo() {
    const res = await teamStatUserFissionController();
    if (res.success) {
      this.teamStInfo = res.data;
    }
  }
  teamStInfo: API.UserFissionTeamStatVO = null;
  get teamInfoList() {
    const teamStInfo = this.teamStInfo;
    return [
      {
        icon: require('@/assets/referMoney/teamIcon1.png?webp'),
        title: this.$t('VRM.teamCount'),
        num: teamStInfo ? formatFloatG(Number(teamStInfo.teamCount)) : '-',
        className: 'text-[#881631 ]',
      },
      {
        icon: require('@/assets/referMoney/teamIcon2.png?webp'),
        title: this.$t('VRM.receivedMoney'),
        num: teamStInfo
          ? 'Rp ' + formatVRp(Number(teamStInfo.taskTotalReward))
          : '-',
        className: 'text-[#FFA800]',
      },
      {
        icon: require('@/assets/referMoney/teamIcon3.png?webp'),
        title: this.$t('VRM.pendingMoney'),
        num: teamStInfo
          ? 'Rp ' + formatVRp(Number(teamStInfo.unCliamedTotalReward))
          : '-',
        className: 'text-[#33EE7E]',
      },
    ];
  }
  //#region

  async onListLoad(_from?: 'init' | 'error') {
    this.onReqStart(_from);
    const queryObj = {
      ...this.listQueryObj,
    };
    teamListUserFissionController(queryObj).then((res) => {
      this.onReqEnd(res, queryObj);
    });
  }
  get dataList() {
    return this.rawDataList.map((item) => {
      //       VRM.inviteUserEnd
      // VRM.inviteUserExceeded
      // VRM.inviteUserNotice
      //    ：                ，       “              ”，             30  ，      “           ”，       “               ”；
      const loginDays = item.loginDays != null ? Number(item.loginDays) : null;

      return {
        ...item,
        coinNum: formatVGold(Number(item.taskTotalReward)),
        loginDays,
        avatar: item.avatar || DEFAULT_GAME_AVATAR_URL,
        tip:
          item.userTaskStatus === 'EXPIRED'
            ? this.$t('VRM.inviteUserExceeded')
            : item.userTaskStatus === 'COMPLETED'
            ? this.$t('VRM.inviteUserEnd')
            : this.$t('VRM.inviteUserNotice'),
      };
    });
  }
  //#endregion
  isRuleDlgShow = false;
  onRuleClick() {
    this.isRuleDlgShow = true;
    this.$trace('click_earn_entrance_invite_landingpage_rule');
  }

  async onPushMsgClick(item: typeof VReferMoneyTeamTab.prototype.dataList[0]) {
    if (!ButtonLockController.Instance.tryGetLock('push', 1)) {
      return;
    }

    const res = await recallFriendUserInviteController({ userId: item.userId });
    if (!res.success) {
      Toast(res.message);
    } else {
      Toast(this.$t('Success'));
    }
  }

  openInviteTipDlg() {
    this.$emit('openInviteTipDlg');
  }
}
</script>
