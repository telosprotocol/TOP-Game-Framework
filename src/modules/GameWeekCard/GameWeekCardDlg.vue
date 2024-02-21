<template>
  <transition name="tz-transwrap">
    <div
      class="tz-modal tz-transwrap-scale flex items-center justify-center"
      v-if="value"
      v-bind="$attrs"
    >
      <div class="tz-modal_mask"></div>

      <!-- DlgContent Include bg -->
      <div
        class="relative rounded-md tz-transel-scaleInOut bg-contain bg-center bg-no-repeat flex flex-col"
        :style="
          $ss.getters.normalizeCss(
            {
              width: 652 / 2,
              height: 1044 / 2,
              padding: 10,
              paddingBottom: 14,
              paddingTop: 25,
            },
            require('@/assets/gameWeeklyCard/bg.png'),
            false
          )
        "
      >
        <h3
          class="bg-contain bg-center bg-no-repeat w-full shrink-0"
          :style="
            $ss.getters.normalizeCss(
              { height: 34, marginBottom: 22 },
              $ss.getters.translateImage({
                en: require('@/assets/gameWeeklyCard/weeklycard-en.png?webp'),
                id: require('@/assets/gameWeeklyCard/weeklycard-id.png?webp'),
              }),
              true
            )
          "
        ></h3>
        <button
          @click="onCloseClicked"
          class="absolute -translate-y-full bg-contain bg-center bg-no-repeat active:scale-95"
          v-webp="require('@/assets/gameWeeklyCard/X.png?webp')"
          :style="
            $ss.getters.normalizeCss(
              { height: 15, width: 15, right: 16, top: 45 },
              require('@/assets/gameWeeklyCard/X.png?webp'),
              true
            )
          "
        ></button>
        <div class="flex-1 px-3">
          <section class="flex justify-between flex-wrap px-0.5">
            <div
              v-for="item in day6List"
              :key="item.day"
              class="rounded-[10px] mb-2 flex flex-col relative"
              :style="
                $ss.getters.normalizeCss({
                  width: 84,
                  height: 100,
                  boxShadow:
                    '0px 2px 2px 0px rgba(0, 0, 0, 0.25),0px -1px 0px 0px #FFFFFF inset',
                })
              "
            >
              <h4
                class="h-7 text-center rounded-t-[10px] text-white flex items-center justify-center font-robot-medium font-medium text-base"
                :class="{
                  'bg-[#2FD8F5]': curDay === item.day,
                  'bg-[#4DC584]': curDay !== item.day,
                }"
                :style="{
                  boxShadow:
                    curDay === item.day
                      ? '0px -2px 0px 0px #299FE3 inset,0px 1px 0px 0px #ADF3F8 inset'
                      : '0px 1px 0px 0px #ADF8C7 inset,0px -2px 0px 0px #00000040 inset',
                }"
              >
                {{ item.title }}
              </h4>
              <div class="flex-1 bg-gradient-to-b from-[#FFEBD8] to-[#FDF6E4]">
                <div
                  class="bg-contain bg-center bg-no-repeat mx-auto relative"
                  :style="
                    $ss.getters.normalizeCss(
                      {
                        width: 49,
                        height: 49,
                      },
                      item.icon,
                      false
                    )
                  "
                ></div>
              </div>
              <div
                class="h-6 bg-white rounded-b-[10px] font-robot-bold font-bold text-[18px] flex items-center justify-center text-[#FFFD92] vshadow-stroke shadow-[#E26203] pt-0.5"
              >
                {{ item.txtNum }}
              </div>
              <div
                class="absolute inset-0 rounded-[10px] bg-black bg-opacity-50 flex items-center justify-center"
                v-if="item.isReved"
              >
                <div
                  class="w-12 h-12 bg-contain bg-no-repeat bg-center"
                  v-webp="require('@/assets/gameWeeklyCard/iconCheck.png?webp')"
                ></div>
              </div>
            </div>
          </section>
          <div
            class="bg-contain bg-center bg-no-repeat mx-auto mb-1.5"
            :style="
              $ss.getters.normalizeCss(
                {
                  width: 568 / 2,
                  height: 114,
                },
                day7Icon,
                true
              )
            "
          ></div>
          <i18n
            path="VG.weekCardTip"
            tag="div"
            class="text-[#99411A] font-robot-medium font-medium text-xs text-center mb-1.5"
          >
            <span class="text-[#FF4E00]">Rp{{ txtRechargeNum }}</span>
            <span class="text-[#FF4E00]">Rp{{ totalNum }}</span>
          </i18n>

          <button
            @click="onOkClicked"
            class="vbtn vbtn--lg mx-auto block active:scale-95"
            :class="btnInfo.className"
            :style="$ss.getters.normalizeCss({ width: 252 })"
          >
            {{ btnInfo.btnText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Watch } from 'vue-property-decorator';
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
import { webpFilter } from '@/directives/webp';
import stateItemWeekCardRecharge, {
  WeekCardRechargeMixin,
} from './WeekCardRecharge.state';
import { formatVGold } from '../vFormatter';
import { receiveRewardPayGiftController } from '@/vservices/client/PayGiftController';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/openAppH5LinkPreferLocal';
import { getActivityPayForMultiPrice } from '@/constants/APP_SCHEMA_URLS';
import { getGoldWithdrawUrl } from '../vRedirect';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { onGBus } from '@/utils/GBus';
import { updateVAssetInfo } from '../VAssetInfo/VAsset.utils';

@Component({
  components: {},
})
export default class GameWeekCardDlg extends mixins(
  BaseDlgMixin,
  WeekCardRechargeMixin,
  BindEventMixinDefault
) {
  useInited() {
    return onGBus('onVUserRechargeGameGold', async () => {
      if (this.value) {
        this.refreshWeekCardRecharge(5);
        this.needUpdate = true;
      } else {
        this.stateItemWeekCardRechargeRef.lastSetDt = 0;
      }
    });
  }
  //#region Dlg Basic Setting

  dlgSound = true;
  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.needUpdate = false;
      this.refreshWeekCardRecharge(10);
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    // closeDlg
    this.emitDlgVisible(false);
    this.$emit('close', !!this.needUpdate);
  }
  //#endregion
  get dayList() {
    const serverList = this.WeekCardDays;

    const GOLD_IMGLIST = [
      require('@/assets/gameWeeklyCard/goldList/gold2.png?webp'), //1
      require('@/assets/gameWeeklyCard/goldList/gold3.png?webp'), //2
      require('@/assets/gameWeeklyCard/goldList/gold4.png?webp'), //3
      require('@/assets/gameWeeklyCard/goldList/gold5.png?webp'), //4
      require('@/assets/gameWeeklyCard/goldList/gold6.png?webp'), //5
      require('@/assets/gameWeeklyCard/goldList/gold7.png?webp'), //6
    ];
    return Array.from({ length: 7 }).map((item, idx) => {
      const day = idx + 1;
      const serverItem = serverList[idx];
      const rewardAmount = serverItem?.rewardAmount;
      const amount = Number(rewardAmount);
      return {
        day,
        title: this.$t('VG.Dayx', [' ' + day]),
        isReved: serverItem?.rewardStatus === 'HAS_RECEIVED',
        rewardStatus: serverItem?.rewardStatus,
        amount: amount,
        txtNum: rewardAmount == null ? ' ' : formatVGold(amount),
        icon: webpFilter(day === 1 ? GOLD_IMGLIST[5] : GOLD_IMGLIST[day - 2]),
      };
    });
  }

  /**
   *
   */
  get curDay() {
    const serverList = this.WeekCardDays;
    let curDay = 0;
    serverList.forEach((item, idx) => {
      if (item.rewardStatus !== 'CAN_NOT_RECEIVE') {
        curDay = idx + 1;
      }
    });
    return curDay;
  }

  get day6List() {
    return this.dayList.slice(0, 6);
  }
  get day7Icon() {
    const isToday = this.curDay === 7;
    return this.$ss.getters.translateImage({
      id: isToday
        ? require('@/assets/gameWeeklyCard/day7a-id.png?webp')
        : require('@/assets/gameWeeklyCard/day7-id.png?webp'),
      en: isToday
        ? require('@/assets/gameWeeklyCard/day7a-en.png?webp')
        : require('@/assets/gameWeeklyCard/day7-en.png?webp'),
    });
  }
  get txtRechargeNum() {
    return this.dayList[0].txtNum;
  }

  get totalNum() {
    let total = 0;
    this.dayList.forEach((item) => {
      total += item.amount;
    });
    if (isNaN(total)) {
      return ' ';
    }
    return formatVGold(total);
  }

  get curDealableCardItem() {
    const WeekCardDays = this.WeekCardDays;

    for (let i = 0; i < WeekCardDays.length; i++) {
      const curItem = WeekCardDays[i];
      if (curItem.rewardStatus === 'CAN_BUY') {
        return curItem;
      }
      if (curItem.rewardStatus === 'CAN_RECEIVE') {
        return curItem;
      }
    }
    return null;
  }

  get btnInfo() {
    const curDealableCardItem = this.curDealableCardItem;
    const rewardStatus = curDealableCardItem?.rewardStatus;
    if (rewardStatus === 'CAN_BUY') {
      return {
        className: 'vbtn--yellow',
        btnText: 'Rp' + this.txtRechargeNum,
      };
    } else if (rewardStatus === 'CAN_RECEIVE') {
      return {
        className: 'vbtn--primary',
        btnText: this.$t('VG.Receive'),
      };
    }
    return {
      className: 'vbtn--disable',
      btnText: this.$t('VG.comeBackTomorrow'),
    };
  }

  /**
   *
   */
  needUpdate: boolean;
  async onOkClicked() {
    const curDealableCardItem = this.curDealableCardItem;
    const rewardStatus = curDealableCardItem?.rewardStatus;
    if (!ButtonLockController.Instance.tryGetLock('click_' + rewardStatus)) {
      return;
    }
    const WeekCardRecharge = this.WeekCardRecharge;
    if (rewardStatus === 'CAN_BUY') {
      openAppH5LinkPreferLocal(
        getActivityPayForMultiPrice(
          WeekCardRecharge.activityId,
          'gamehall_activity_week_recharge',
          WeekCardRecharge.price
        ),
        {}
      );
    } else if (rewardStatus === 'CAN_RECEIVE') {
      const res = await receiveRewardPayGiftController({
        activityId: WeekCardRecharge.activityId,
        rewardId: curDealableCardItem.rewardId as number,
      });
      if (res.success) {
        this.needUpdate = true;
        updateVAssetInfo(0);
        if (curDealableCardItem.day === 7) {
          openAppH5LinkPreferLocal(
            getGoldWithdrawUrl(
              'gamehall_weekcard',
              'WEEK_RECHARGE',
              WeekCardRecharge.activityId
            ),
            {}
          );
          stateItemWeekCardRecharge.clearResult();
          this.emitDlgVisible(false);
          this.$emit('close', !!this.needUpdate);
        } else {
          this.refreshWeekCardRecharge(5);
        }
      }
    } else {
      this.emitDlgVisible(false);
      this.$emit('close', !!this.needUpdate);
    }
  }
}
</script>
@/constants/APP_SCHEMA_URLS
