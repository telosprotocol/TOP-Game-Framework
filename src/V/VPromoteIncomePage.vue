<template>
  <div>
    <HeaderTop
      left-icon="icon-back"
      :bar-background="statusBarColor"
      :style="{ color: 'white' }"
      :title="$t('VPI.title')"
    >
    </HeaderTop>
    <main
      :style="$ss.getters.convertBgImageStyle('/online/vpi/bg.png?webp', true)"
    >
      <div class="top_user">
        <div class="top_user_row">
          <img class="user_icon" :src="bgThumbnailStyle" alt="" />
        </div>
        <div class="top_user_row">
          <div class="banner_lvl" v-if="viewData">
            <img class="banner_lvl_icon" v-webp="curTeamLevel.icon" alt="" />
            <span>{{
              getVGameLevelConfigByTeamLevel2(viewData.currentLevel).title
            }}</span>
          </div>
        </div>
      </div>
      <div class="upgrade_cont">
        <div class="lvl_card_row">
          <div class="lvl_card rubik-bold">
            <p class="caption robot-regular">
              {{ $t('VPI.directCommission') }}
            </p>
            <p class="value">
              <span class="cur_rate rubik-bold"
                >{{
                  formatFloatG(
                    Number(viewData.currentLevelDirectIncomeRatio) * 100
                  )
                }}%</span
              >
              <img
                v-if="
                  viewData.currentLevelDirectIncomeRatio !==
                  viewData.nextLevelDirectIncomeRatio
                "
                v-webp="
                  require('@/assets/promptIncome/upgrade_raiseto.png?webp')
                "
                alt=""
              />
              <span
                v-if="
                  viewData.currentLevelDirectIncomeRatio !==
                  viewData.nextLevelDirectIncomeRatio
                "
                class="next_rate rubik-bold"
                >{{
                  formatFloatG(
                    Number(viewData.nextLevelDirectIncomeRatio) * 100
                  )
                }}%</span
              >
            </p>
          </div>
          <div class="lvl_card rubik-bold">
            <p class="caption robot-regular">
              {{ $t('VPI.indirectCommission') }}
            </p>
            <p class="value">
              <span class="cur_rate rubik-bold"
                >{{
                  formatFloatG(
                    Number(viewData.currentLevelInDirectIncomeRatio) * 100
                  )
                }}%</span
              >
              <img
                v-if="
                  viewData.currentLevelInDirectIncomeRatio !==
                  viewData.nextLevelInDirectIncomeRatio
                "
                v-webp="
                  require('@/assets/promptIncome/upgrade_raiseto.png?webp')
                "
                alt=""
              />
              <span
                v-if="
                  viewData.currentLevelInDirectIncomeRatio !==
                  viewData.nextLevelInDirectIncomeRatio
                "
                class="next_rate rubik-bold"
                >{{
                  formatFloatG(
                    Number(viewData.nextLevelInDirectIncomeRatio) * 100
                  )
                }}%</span
              >
            </p>
          </div>
        </div>
        <div
          class="processbar_desc rubik-bold vshadow-stroke shadow-[#916133]"
          v-if="
            viewData.currentLevel !== 'four' &&
            viewData.nextLevelNeedRechargeUser > viewData.directRechargeCount
          "
        >
          {{
            $t('VPI.InvitePayUsersUpgrade', {
              x:
                viewData.nextLevelNeedRechargeUser -
                viewData.directRechargeCount,
            })
          }}
          !!
        </div>
        <div
          class="processbar_desc rubik-bold vshadow-stroke shadow-[#916133]"
          v-else-if="
            viewData.currentLevel !== 'four' &&
            viewData.nextLevelNeedSameLevelUser > viewData.directSameLevelCount
          "
        >
          {{
            $t('VPI.trainingAgentForUpgrade', {
              x:
                viewData.nextLevelNeedSameLevelUser -
                viewData.directSameLevelCount,
            })
          }}
          !!
        </div>
        <div class="processbar" @click="showProcessBar">
          <VProgressBar :view-data="{ viewData }" need-trace-submit />
        </div>
      </div>
      <div class="main_cont">
        <div class="month_income">
          <div class="title font-robot">
            {{ $t('VPI.currentPromotionEarnings') }}
          </div>
          <div class="month_income_cont">
            <div class="assets_con">
              <div class="month_income_cont_row">
                <span class="caption robot-regular">
                  <span class="icon_caption">
                    <img v-webp="getCoinConfig(VCoinEnum.GOLD).icon" alt="" />
                  </span>
                  {{ $t('VPI.gameCoin') }}
                </span>
                <div class="value">
                  <p class="bold rubik-medium">
                    {{
                      formatFloatG(Number(viewData.theMonthGoldIncomeAmount))
                    }}
                  </p>
                  <p class="replenish rubik-medium">
                    Rp
                    {{
                      formatFloatG(
                        Number(viewData.theMonthGoldIncomeAmountToCurrency)
                      )
                    }}
                  </p>
                </div>
              </div>
              <div class="month_income_cont_row">
                <span class="caption robot-regular">
                  <span class="icon_caption">
                    <img v-webp="getCoinConfig(VCoinEnum.VTOKEN).icon" alt="" />
                  </span>
                  {{ $t('VPI.dstToken') }}
                </span>
                <div class="value">
                  <p class="bold rubik-medium">
                    {{
                      formatDstFloatPrecision6(
                        Number(viewData.theMonthDstIncomeAmount)
                      )
                    }}
                  </p>
                  <p class="replenish rubik-medium">
                    Rp
                    {{
                      formatFloatG(
                        Number(viewData.theMonthDstIncomeAmountToCurrency)
                      )
                    }}
                  </p>
                </div>
              </div>
              <div class="assets_total rubik-bold">
                <div class="half">{{ $t('VPI.totalRPEquivalent') }}</div>
                <div class="half">
                  Rp
                  {{
                    formatFloatG(
                      Number(viewData.theMonthGoldIncomeAmountToCurrency) +
                        Number(viewData.theMonthDstIncomeAmountToCurrency)
                    )
                  }}
                </div>
              </div>
            </div>
            <div class="assets_acts">
              <div
                class="mi_withdraw_btn rubik-bold"
                @click="onOpenWithdrawPage"
              >
                <span>
                  <img
                    v-webp="
                      require('@/assets/promptIncome/mi_withdraw.png?webp')
                    "
                    alt=""
                  />
                </span>
                <span>{{ $t('VPI.withdrawGoldCoins') }}</span>
              </div>
              <div
                class="mi_detail_btn rubik-bold"
                @click="onOpenVPromoteIncomeHistory"
              >
                <span>
                  <img
                    v-webp="require('@/assets/promptIncome/mi_detail.png?webp')"
                    alt=""
                  />
                </span>
                <span>{{ $t('VPI.earningsDetails') }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="team_members">
          <div class="title font-robot">
            {{ $t('VPI.teamMembers') }}
            <div class="van_con">
              <van-popover
                slot="right"
                theme="dark"
                :value="isShowTeamMemberTip"
                placement="top-start"
                trigger="click"
              >
                <div
                  class="p-2"
                  :style="$ss.getters.designPxsObjToReal({ width: 172 })"
                  @click.stop="onTeamMemberTipHide"
                >
                  {{ $t('VPI.directReferralCount') }}:
                  {{ $t('VPI.directReferrals') }}.
                  <br />
                  {{ $t('VPI.directSubordinateCount') }}:
                  {{ $t('VPI.subReferrals') }}.
                </div>
                <template #reference>
                  <div
                    class="tip_icon"
                    :style="
                      $ss.getters.convertBgImageStyle(
                        require('@/assets/promptIncome/tip.png?webp'),
                        true
                      )
                    "
                    @click.stop="onTeamMemberTipShow"
                  >
                    <div
                      class="absolute inset-0"
                      :style="$ss.getters.designPxsObjToReal({ right: -80 })"
                    ></div>
                  </div>
                </template>
              </van-popover>
            </div>
            <div class="tm_extend_btn robot-bold" @click="onOpenVPromoteShare">
              <span>
                <img
                  v-webp="require('@/assets/promptIncome/tm_extend.png?webp')"
                  alt=""
                />
              </span>
              <span>
                {{ $t('VPI.goPromotion') }}
              </span>
            </div>
          </div>
          <div class="month_income_cont">
            <div class="assets_con">
              <div class="month_income_cont_row">
                <div class="caption robot-regular">
                  <span class="icon_caption">
                    <img
                      v-webp="
                        require('@/assets/promptIncome/tm_recommend_direct.png?webp')
                      "
                      alt=""
                    />
                  </span>
                  {{ $t('VPI.directReferralCount') }}
                </div>
                <div class="value">
                  <p class="bold robot-bold">
                    {{ formatFloatG(Number(viewData.directCount)) }}
                  </p>
                  <p class="replenish">{{ $t('VPI.team') }}</p>
                </div>
              </div>
              <div class="month_income_cont_row">
                <span class="caption robot-regular">
                  <span class="icon_caption">
                    <img
                      v-webp="
                        require('@/assets/promptIncome/tm_recommend_indirect.png?webp')
                      "
                      alt=""
                    />
                  </span>
                  {{ $t('VPI.directSubordinateCount') }}
                </span>
                <div class="value">
                  <p class="bold robot-bold">
                    {{ formatFloatG(Number(viewData.directChildCount)) }}
                  </p>
                  <p class="replenish">{{ $t('VPI.team') }}</p>
                </div>
              </div>
              <div class="assets_total rubik-bold">
                <div class="half">{{ $t('VPI.totalPayCount') }}</div>
                <div class="half">
                  <p class="bold robot-bold">
                    {{ formatFloatG(Number(viewData.totalRechargeCount)) }}
                  </p>
                  <p class="replenish robot-medium">{{ $t('VPI.team') }}</p>
                </div>
              </div>
            </div>
            <div class="assets_acts">
              <div class="assets_act_big" @click="onOpenTeamMembers">
                <p>
                  <img
                    v-webp="
                      require('@/assets/promptIncome/tm_members.png?webp')
                    "
                    alt=""
                  />
                </p>
                <p class="text robot-bold">{{ $t('VPI.teamManagement') }}</p>
              </div>
              <div class="assets_act_big" @click="onOpenAcademyCenter">
                <p>
                  <img
                    v-webp="
                      require('@/assets/promptIncome/tm_v_college.png?webp')
                    "
                    alt=""
                  />
                </p>
                <p class="text robot-bold">{{ $t('VPI.academy') }}</p>
              </div>
              <div class="assets_act_big" @click="onOpenPromoteIncomeNewBie">
                <p>
                  <img
                    v-webp="require('@/assets/promptIncome/tm_detail.png?webp')"
                    alt=""
                  />
                </p>
                <p class="text robot-bold">{{ $t('VPI.commissionPlan') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import HeaderTop from '@/components/HeaderTop/index.vue';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import StatusBarMixin from '@/mixins/StatusBarMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';

import { tryMergeLocalesForVPrjPromoteIncome } from '@/locales/Page/VPrj/VPI/init';
import { hideDelayLoading } from '@/utils/loadingTool';
import { getVGameLevelConfigByTeamLevel2 } from '@/modules/VAssetInfo/VLevels.config';

import VProgressBar from '@/modules/VPromoteIncome/VProgressBar.vue';

import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
import ButtonLockController from '@/controller/ButtonLockController';
import VPromoteIncomeDesc from '@/modules/VPromoteIncome/VPromoteIncomeDesc.vue';
import { openAppH5LinkPreferLocal } from '@/utils/navigator';
import {
  ROUTEPATH_V_ACADEMY_CENTER,
  ROUTEPATH_V_PROMOTE_INCOME_HISTORY,
  ROUTEPATH_V_PROMOTE_INCOME_NEWBIE,
  ROUTEPATH_V_PROMOTE_TEAM_MEMBERS,
} from '@/constants/localRoutePath';
import { VUserAccountMixin } from '@/modules/VAssetInfo/VUserAccount.state';
import { formatFloatG } from '@/store/modules/universe/universe';
import { DEFAULT_GAME_AVATAR_URL } from '@/constants/DEFAULT_GAME_AVATAR_URL';
import { VCoinEnum } from '@/modules/VAssetInfo/VCoinEnum';
import { getInvitePageUrl, goToGoldWithdraw } from '@/modules/vRedirect';
// import { convertBgImageStyle } from '@/utils/styles';
import { Popover } from 'vant';
import { ROUTEPATH_V_PROMOTE_INCOME_RULE } from '@/constants/localRoutePath';
import { getFirstString } from '@/utils/string';
import { getCoinConfig } from '@/modules/VAssetInfo/VCoin.config';
import { getPromotionIncomeGameInviteController } from '@/vservices/client/GameInviteController';

tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjPromoteIncome();
@Component({
  components: {
    HeaderTop,
    VProgressBar,
    VPromoteIncomeDesc,
    'van-popover': Popover,
  },
})
export default class VPromoteIncomePage extends mixins(
  BindEventMixinDefault,
  StatusBarMixin,
  VUserAccountMixin
) {
  /**
   *   statusBar
   */
  statusBarColor = '#9363D1';

  // viewData
  viewData: API.PromotionIncomeVO = {
    theMonthDstIncomeAmount: '0',
    nextLevelNeedSameLevelUser: 0,
    directCount: 0,
    nextLevelDirectIncomeRatio: '0',
    nextLevelNeedRechargeUser: 0,
    nextLevel: 'one',
    theMonthDstIncomeAmountToCurrency: '0',
    totalRechargeCount: 0,
    directSameLevelCount: 0,
    currentLevelDirectIncomeRatio: '0',
    theMonthGoldIncomeAmount: '0',
    theMonthGoldIncomeAmountToCurrency: '0',
    directChildCount: 0,
    directRechargeCount: 0,
    levelRechargeUserList: [],
    currentLevel: 'zero',
    currentLevelInDirectIncomeRatio: '0',
    nextLevelInDirectIncomeRatio: '0',
  };
  // team member tip~
  isShowTeamMemberTip = false;

  useInited() {
    // console.log('i inited it~~~~~~~~~~~~~');

    hideDelayLoading();

    // viewData
    getPromotionIncomeGameInviteController().then((res) => {
      if (res.success && res.data) {
        this.viewData = res.data;
      }
    });

    //
    this.refreshVUserAccount(0);

    return () => {
      //    destroy
    };
  }

  onTeamMemberTipShow() {
    this.isShowTeamMemberTip = true;
  }
  onTeamMemberTipHide() {
    this.isShowTeamMemberTip = false;
  }

  //
  get bgThumbnailStyle() {
    const UserAccount = this.UserAccount;
    let avatar = UserAccount?.userInfo?.avatar || DEFAULT_GAME_AVATAR_URL;

    // return convertBgImageStyle(avatar, false);
    return avatar;
  }
  //
  DEFAULT_GAME_AVATAR_URL = DEFAULT_GAME_AVATAR_URL;

  //
  get curTeamLevel() {
    if (this.viewData) {
      return getVGameLevelConfigByTeamLevel2(this.viewData.currentLevel);
    } else {
      return null;
    }
  }
  //
  getVGameLevelConfigByTeamLevel2 = getVGameLevelConfigByTeamLevel2;

  //      ，  1
  formatFloatG = formatFloatG;

  //
  getCoinConfig = getCoinConfig;
  //
  VCoinEnum = VCoinEnum;

  // dst
  formatDstFloatPrecision6(num: number) {
    return formatFloatG(num, { precision: 6 });
  }

  /**           */
  showProcessBar() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    openAppH5LinkPreferLocal(ROUTEPATH_V_PROMOTE_INCOME_RULE, {});
  }
  //p1-
  onOpenWithdrawPage() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    this.$tracev('click_invite_withdrawal', {});
    goToGoldWithdraw('promote_income', true);
  }
  //p1-
  onOpenVPromoteIncomeHistory() {
    this.$tracev('click_invite_revenue_details', {});

    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    openAppH5LinkPreferLocal(ROUTEPATH_V_PROMOTE_INCOME_HISTORY, {});
  }
  //p2-
  onOpenVPromoteShare() {
    this.$tracev('click_go_team_promotion', {});

    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    openAppH5LinkPreferLocal(
      getInvitePageUrl(
        'promote_income',
        getFirstString(
          this.$route.query.from || this.$route.query.initialfrom || ''
        )
      ),
      {}
    );
  }
  //p2-
  onOpenTeamMembers() {
    this.$tracev('click_team_management', {});

    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    openAppH5LinkPreferLocal(ROUTEPATH_V_PROMOTE_TEAM_MEMBERS, {});
  }
  // p2-
  onOpenAcademyCenter() {
    this.$tracev('click_promotion_invite_school', {});
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    openAppH5LinkPreferLocal(ROUTEPATH_V_ACADEMY_CENTER, {});
  }
  // p2-
  onOpenPromoteIncomeNewBie() {
    this.$tracev('click_commission_programme', {});

    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    openAppH5LinkPreferLocal(
      ROUTEPATH_V_PROMOTE_INCOME_NEWBIE + '?from=income',
      {}
    );
  }
}
</script>

<style lang="less" scoped>
.top_user {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .top_user_row {
    text-align: center;
  }
  .top_user_row:last-child {
    margin-top: -12px;
  }
  .user_icon {
    width: 88px;
    height: 88px;
    border: 2px solid #ffffff;
    border-radius: 44px;
  }
  .banner_lvl {
    position: relative;
    display: inline-block;
    padding: 0px 5px 0px 16px;

    line-height: 19px;
    background: #ffffff;
    border: 1px solid #ebd2ff;
    border-radius: 51px 51px 51px 51px;
    opacity: 1;
  }
  .banner_lvl_icon {
    position: absolute;
    top: -8px;
    left: -20px;
    width: 36px;
    height: 36px;
  }
}
.upgrade_cont {
  padding: 8px 16px;

  .lvl_card_row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .lvl_card {
    display: flex;
    flex-direction: column;
    width: 158px;
    padding: 6px 0 6px 10px;
    color: #ffffff;
    line-height: 14px;
    background: #533789;
    border-radius: 10px 10px 10px 10px;
    box-shadow: inset 0px -1px 0px 0px rgba(255, 255, 255, 0.23);
  }
  .lvl_card .value {
    display: flex;
    flex-direction: row;
    align-content: center;
    padding-top: 5px;
  }
  .lvl_card .cur_rate {
    color: #ffea14;
    font-size: 16px;
    line-height: 19px;
  }
  .lvl_card img {
    width: 26px;
    height: 19px;
    margin: 0 8px 0 6px;
  }
  .lvl_card .next_rate {
    color: #14ff48;
    font-size: 16px;
    line-height: 19px;
  }
  .processbar_desc {
    // rubik-bold
    margin-top: 9px;

    color: #e9ea76;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
  }
  .processbar {
    margin-top: 18px;
    padding: 0 16px 23px 8px;
  }
}
.main_cont {
  background: #ffffff;
  border-radius: 25px 25px 0 0;
}
.month_income {
  padding: 16px 16px 21px 16px;

  .mi_withdraw_btn,
  .mi_detail_btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 156px;

    height: 40px;
    padding: 0 8px;
    color: #ffffff;
    font-size: 14px;
    line-height: 40px;
  }
  .mi_withdraw_btn img,
  .mi_detail_btn img {
    width: 35px;
    height: 35px;
  }
  .mi_withdraw_btn {
    background: linear-gradient(90deg, #f865fe 0%, #be8aff 100%);
    border-radius: 10px 10px 10px 10px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
  }
  .mi_detail_btn {
    background: linear-gradient(270deg, #9699ff 0%, #be8aff 100%, #945cf1 100%);
    border-radius: 10px 10px 10px 10px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
  }
}
.title {
  color: #343434;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
}
.title .van_con {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding-left: 5px;
}
.title .van-popover__wrapper/deep/ {
  width: 20px;
  height: 20px;
}
.title .tip_icon {
  width: 20px;
  height: 20px;
  background-size: 100% 100%;
}
.assets_con {
  margin-top: 12px;
  padding: 0 12px 8px 12px;

  background: linear-gradient(180deg, #f4efff 0%, #fdfcff 100%);
  border: 1px solid #faf4ff;
  border-radius: 15px 15px 15px 15px;
}
.month_income_cont_row {
  display: flex;
}
.assets_con .month_income_cont_row:nth-child(2) {
  border-top: 1px solid #edc3ff4c;
}
.assets_con .icon_caption {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 33px;
  height: 33px;
  margin-right: 10px;
  background: #eee0ff;
  border-radius: 17px;
  transform: translateY(10px);
}
.assets_con .caption,
.assets_con .value {
  display: flex;
}
.assets_con .caption {
  // robot-regular
  position: relative;

  color: #343434;
  font-size: 14px;
  line-height: 56px;
}
.assets_con .icon_caption img {
  max-width: 24px;
  max-height: 24px;
}
.assets_con .value {
  flex: 1;
  flex-direction: column;
  align-items: flex-end;
  justify-items: center;
  padding: 6px 0;
}
.assets_con .value p.bold {
  // robot-bold
  padding: 6px 0 0 0;

  color: #343434;
  font-size: 16px;
  line-height: 27px;
}
.assets_con .value p {
  // rubik-medium
  padding: 0 0 6px 0;

  color: #c0a0ff;
  font-size: 11px;
  line-height: 13px;
}
.assets_total {
  display: flex;
  flex-direction: row;
  padding: 0 10px;

  color: #9e6ffb;
  font-size: 14px;
  line-height: 16px;

  background: #f4ecff;
  border-radius: 10px 10px 10px 10px;
}
.assets_total .half {
  display: flex;
  flex: 1.2;
  flex-direction: column;
  justify-content: flex-start;
  line-height: 42px;
}
.assets_total .half:last-child {
  flex: 0.8;
  justify-content: flex-end;
  text-align: right;
}
.assets_acts {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.team_members {
  padding: 8px 16px 48px 16px;
  border-top: solid 8px #f6f2fc;
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    line-height: 40px;
  }
  .assets_con {
    background: linear-gradient(180deg, #f6f2ff 0%, #fbfbfb 57%);
    border: 1px solid #faf4ff;
  }
  .assets_con .caption {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    max-width: 60%;
    height: 56px;
    font-size: 12px;
    line-height: 14px;
  }
  .assets_con .caption .icon_caption {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 33px;
    min-width: 33px;
    height: 33px;
    transform: translate(0, 0);
  }
  .tm_extend_btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 156px;
    height: 40px;
    padding: 0 8px 0 8px;
    color: #ffffff;
    font-size: 14px;
    line-height: 16px;
    background: linear-gradient(270deg, #9699ff 0%, #be8aff 100%, #945cf1 100%);
    border-radius: 10px 10px 10px 10px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
  }
  .tm_btns {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 25px;
  }
  .tm_extend_btn img {
    max-width: 32px;
    max-height: 32px;
    margin-right: 9px;
  }
  .assets_acts img {
    width: 65px;
    height: auto;
  }
  .assets_act_big {
    width: 99px;
    text-align: center;
  }
  .assets_act_big .text {
    // robot-bold
    margin-top: 15px;

    color: #343434;
    font-size: 11px;
    line-height: 13px;
  }
  .assets_total .bold {
    // robot-bold
    display: block;
    padding: 6px 0 0 0;

    color: #343434;
    font-size: 16px;
    line-height: 21px;
  }
  .assets_total .replenish {
    // robot-medium
    display: block;
    padding: 0 0 6px 0;

    color: #c0a0ff;
    font-size: 11px;
    line-height: 13px;
  }
}
.mi_withdraw_btn span:first-child,
.mi_detail_btn span:first-child,
.tm_extend_btn span:first-child {
  display: flex;
  align-items: center;
  width: 35px;
}
.mi_withdraw_btn span:nth-child(2),
.mi_detail_btn span:nth-child(2),
.tm_extend_btn span:nth-child(2) {
  display: flex;
  flex: 1;
  justify-content: center;
}
/deep/.absolute.inset-0 {
  display: none;
}
</style>
