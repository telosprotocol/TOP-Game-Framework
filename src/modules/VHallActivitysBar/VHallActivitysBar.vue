<template>
  <div class="relative">
    <BounceScroll
      @offsetChange="onOffsetChange"
      ref="wrap"
      class="rounded-b-[10px] pb-3 relative overflow-x-auto"
      :style="{
        background:
          'linear-gradient(180deg, rgba(255, 223, 165, 0) 0%, #FFBC40 100%)',
        boxShadow:
          '0px 4px 4px 0px rgba(0, 0, 0, 0.2) ,0px -3px 10px 0px #FFF7B9 inset',
      }"
    >
      <div class="flex items-start justify-start flex-nowrap px-0.5 clear-both">
        <VHallActivityButton
          v-for="item in list"
          :key="item.type"
          :data-type="item.type"
          ref="btnList"
          @click="onActivityClick(item)"
          :info="item"
          from="gamehall"
          class="shrink-0"
          :client-end-time="countDownEndTimeMap[item.type]"
          @countdownEnd="onActivityCountDown"
        >
        </VHallActivityButton>
      </div>
    </BounceScroll>
    <VActivityLogicGlobal
      ref="logic"
      @updateActivity="onActivityToUpdate"
    ></VActivityLogicGlobal>
    <EntryLogicForTopup
      :has-entry="
        !!(VActivityMap.BANKRUPTCY_ACTIVITY || VActivityMap.SPECIAL_RECHARGE)
      "
      ref="entry_Topup"
      @forceUpdate="onForceUpdateForTopup"
    ></EntryLogicForTopup>
    <EntryLogicForTomorrowPack
      :has-entry="!!hasEntryMap.TOMORROW_GIFT"
      ref="entry_TOMORROW_GIFT"
      @forceUpdate="onForceUpdate"
    ></EntryLogicForTomorrowPack>
    <div
      class="absolute z-[2] bottom-1 w-6 h-1 rounded-full bg-[#A36C2F] left-1/2 -translate-x-1/2"
    >
      <div
        class="rounded-full absolute h-full bg-[#FFF0CE]"
        ref="scrollBar"
      ></div>
    </div>
  </div>
</template>
<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import VHallActivityButton from './VHallActivityButton.vue';
import type { IActivityType } from './activity-logic.config';
import VActivityLogicGlobal from './VActivityLogicGlobal.vue';

import {
  VActivityHallListMixin,
  VActivityHallReady,
} from '@/modules/VActivityList/activity-hall.state';
import { checkMinVersionName } from '@/store/modules/app/checkMinVersionName';
import EntryLogicForTopup from './EntryLogicForTopup.vue';
import EntryLogicForTomorrowPack from './EntryLogicForTomorrowPack.vue';
import BounceScroll from './BounceScroll.vue';

@Component({
  components: {
    VHallActivityButton,
    VActivityLogicGlobal,
    EntryLogicForTopup,
    EntryLogicForTomorrowPack,
    BounceScroll,
  },
})
export default class VHallActivitysBar extends mixins(VActivityHallListMixin) {
  $refs: {
    btnList: VHallActivityButton[];
    logic: VActivityLogicGlobal;
    entry_Topup: EntryLogicForTopup;
    entry_TOMORROW_GIFT: EntryLogicForTomorrowPack;
    wrap: BounceScroll;
    scrollBar: HTMLDivElement;
  };
  //#region
  @Prop({
    type: Boolean,
  })
  isHiggsClientShow: boolean;
  /**
   *
   */
  get hasEntryMap() {
    const res: Partial<{
      [key in IActivityType]: boolean;
    }> = {};
    this.list.forEach((item) => {
      res[item.type as IActivityType] = true;
    });
    return res;
  }
  activityReady = VActivityHallReady;

  get isTopupReady() {
    return this.activityReady.FIRST_CHARGE;
  }
  get firstChargeItem() {
    const firstChargeItem = this.baseList.map(
      (item) => item.type === 'FIRST_CHARGE'
    );
    return firstChargeItem;
  }
  @Watch('firstChargeItem')
  onVActivityMapChange(firstChargeItem: API.ActivitiesManagementVO) {
    if (firstChargeItem) {
      this.$refs.logic?.$refs.FIRST_CHARGE?.refreshVIsGameFirstRecharged?.();
    }
  }
  //#endregion

  get baseList() {
    const isLogined = this.$ss.state.user.isLogined;
    let list = isLogined ? this.VActivityList : [];
    return list.filter((item) => {
      if (item.type === 'BANKRUPTCY_ACTIVITY') {
        if (!checkMinVersionName('2.8.8.0')) {
          return false; //
        }
      }
      if (item.type === 'PAY') {
        //            （    PAY_ENTRY   ）
        return false;
      }
      return true;
    });
  }
  get list() {
    return this.baseList.filter((item) => {
      if (item.type === 'HIGGS' && !this.isHiggsClientShow) {
        return false;
      }
      if (item.type === 'FIRST_CHARGE' && !this.isTopupReady) {
        return false;
      }
      return true;
    });
  }
  get VActivityMap() {
    const map: Partial<{
      [key in API.ActivitiesManagementVO['type']]: boolean;
    }> = {};
    (this.baseList || []).map((item) => {
      map[item.type] = true;
    });
    return map;
  }

  //#region
  payGiftInfoMap: Partial<
    Record<
      API.PayGiftHallActivityVO['activitiesType'],
      API.PayGiftHallActivityVO & { clientEndTime?: number }
    >
  > = {};
  onForceUpdateForTopup(
    payGiftInfoMap: Partial<
      Record<
        API.PayGiftHallActivityVO['activitiesType'],
        API.PayGiftHallActivityVO & { clientEndTime?: number }
      >
    >
  ) {
    if (process.env.VUE_APP_ENV_SERVER === 'development') {
      console.log(
        '[DEBUG] activity forceUpdate',
        'TOMORROW_GIFT',
        this.$refs.entry_TOMORROW_GIFT?.entryClientEndTime,
        this.payGiftInfoMap,
        'specialEndTime',
        this.payGiftInfoMap?.SPECIAL_RECHARGE?.clientEndTime,
        'BANKRUPTCY',
        this.payGiftInfoMap?.BANKRUPTCY_ACTIVITY?.clientEndTime
      );
    }
    this.payGiftInfoMap = payGiftInfoMap;
  }

  onForceUpdate() {
    this.$forceUpdate();
  }
  get countDownEndTimeMap() {
    const entry_TOMORROW_GIFT = this.$refs.entry_TOMORROW_GIFT;
    const payGiftInfoMap = this.payGiftInfoMap;
    return {
      TOMORROW_GIFT: entry_TOMORROW_GIFT?.entryClientEndTime,
      BANKRUPTCY_ACTIVITY: payGiftInfoMap?.BANKRUPTCY_ACTIVITY?.clientEndTime,
      SPECIAL_RECHARGE: payGiftInfoMap?.SPECIAL_RECHARGE?.clientEndTime,
    } as Record<string, number>;
  }

  onActivityCountDown(info: typeof VHallActivitysBar.prototype.list[0]) {
    const type = info.type;
    if (type === 'TOMORROW_GIFT') {
      const entry_TOMORROW_GIFT = this.$refs.entry_TOMORROW_GIFT;
      if (entry_TOMORROW_GIFT) {
        entry_TOMORROW_GIFT.onEntryCountDownEnd();
      }
    } else if (type === 'BANKRUPTCY_ACTIVITY' || type === 'SPECIAL_RECHARGE') {
      const entry_Topup = this.$refs.entry_Topup;
      if (entry_Topup) {
        entry_Topup.onEntryCountDownEnd();
      }
    }
  }
  onActivityToUpdate(_data: { type: IActivityType }) {
    //
    if (process.env.VUE_APP_ENV_SERVER === 'development') {
      console.log(
        '[DEBUG] activity has update ,to load activityList',
        _data.type
      );
    }
    this.refreshVActivityList(200);
  }
  //#endregion

  onActivityClick(item: typeof VHallActivitysBar.prototype.list[0]) {
    this.$refs.logic.onActivityClick(item.type as IActivityType, 'gamehall');
  }

  closeAll() {
    this.$refs.logic?.closeAll();
  }

  //#region
  @Watch('list', { immediate: true })
  onListChange() {
    this.$nextTick(() => {
      this.$refs.wrap.resizeInit();
      // console.log('[DEBUG] listChange', this.list?.length);
      this.onOffsetChange();
    });
  }
  onOffsetChange() {
    const bounce = this.$refs.wrap;
    const wrap = bounce?.$el;
    if (!wrap) {
      return;
    }
    // console.log(
    //   '[DEBUG] offsetXOrY Change',
    //   bounce.offsetXOrY,
    //   bounce.minXOrY,
    //   percent
    // );
    const scrollBar = this.$refs.scrollBar;
    if (scrollBar) {
      if (bounce.isDisabled) {
        scrollBar.style.width = '100%';
        scrollBar.style.left = '0';
        scrollBar.parentElement.style.visibility = 'hidden';
      } else {
        const percent = Math.max(
          Math.min(bounce.offsetXOrY / bounce.minXOrY, 1),
          0
        );
        const totalLeft = 13;
        const style = this.$ss.getters.normalizeCss({
          width: 11,
          left: totalLeft * percent,
        });
        scrollBar.style.width = style.width;
        scrollBar.style.left = style.left;
        scrollBar.parentElement.style.visibility = 'visible';
      }
    }
  }
  //#endregion
}
</script>
