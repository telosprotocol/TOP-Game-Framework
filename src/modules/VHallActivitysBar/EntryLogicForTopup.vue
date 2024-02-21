<template><div></div></template>

<script lang="ts">
import { getClientTimestampByAsyncStateItemRef } from '@/controller/AsyncStateItem';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { waitUserIsLoginedAuth } from '@/store/modules/user.utils';
import { onGBus } from '@/utils/GBus';
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { VGamePayGiftMixin } from '../GameHall/VTopupFirstDiscount/VGamePayGift.state';
import { VActivityHallListMixin } from '../VActivityList/activity-hall.state';
import { updateVAssetInfo } from '../VAssetInfo/VAsset.utils';
@Component({
  components: {},
})
export default class EntryLogicForTopup extends mixins(
  VGamePayGiftMixin,
  VActivityHallListMixin,
  BindEventMixinDefault
) {
  useInited() {
    const cb1 = onGBus('onVUserRechargeGameGold', async () => {
      this.refreshVGamePayGift(5); //
    });
    const cb2 = onGBus('onGiftSpecialRechargeGetRewardSuccess', () => {
      this.refreshVGamePayGift(5);
      this.refreshVActivityList(5);
      updateVAssetInfo(0);
    });
    return () => {
      cb1();
      cb2();
    };
  }
  @Prop({
    type: Boolean,
  })
  hasEntry: boolean;

  get isLogined() {
    return this.$ss.getters['user/isRealLogined'];
  }
  @Watch('isLogined')
  onLogined() {
    this.tryUpdateEntryInfo();
  }
  @Watch('$ss.state.bridge.appTabName', {
    immediate: true,
  })
  async onAppTabNameChange(appTabName: string, _fromTabName: string) {
    if (appTabName !== 'bounds') {
      return;
    }
    this.tryUpdateEntryInfo();
  }
  @Watch('hasEntry')
  async onEntryChange(hasEntry: boolean) {
    if (hasEntry) {
      this.refreshVGamePayGift(0);
    }
  }
  async tryUpdateEntryInfo() {
    // update bankruptcyItem
    const isLogined = await waitUserIsLoginedAuth();
    if (isLogined) {
      await this.refreshVActivityList();
      if (this.hasEntry) {
        this.refreshVGamePayGift();
      }
    }
  }
  onEntryCountDownEnd() {
    if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
      console.log('[DEBUG] bankruptcy count end', this.hasEntry);
    }
    if (this.hasEntry) {
      this.refreshVActivityList(10);
      this.refreshVGamePayGift(10);
    }
  }

  get entryInfoMap() {
    const map: Partial<
      Record<
        API.PayGiftHallActivityVO['activitiesType'],
        API.PayGiftHallActivityVO & { clientEndTime?: number }
      >
    > = {};

    this.PayGiftInfo?.activityVos?.forEach((item) => {
      map[item.activitiesType] = {
        ...item,
        clientEndTime: Math.max(
          (item.activitiesType === 'SPECIAL_RECHARGE' &&
            item.status === 'CAN_RECEIVE_NOT_TIME') ||
            item.activitiesType === 'BANKRUPTCY_ACTIVITY'
            ? getClientTimestampByAsyncStateItemRef(
                item.endTime,
                this.stateItemVGamePayGiftRef,
                true
              )
            : 0,
          0
        ),
      };
    });
    return map;
  }

  @Watch('entryInfoMap', { immediate: true })
  forceParentUpdate() {
    if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
      console.log('[DEBUG] trigger forceUpdate', arguments[0]);
    }
    this.$emit('forceUpdate', this.entryInfoMap);
  }
  // get entryClientEndTime() {
  //   return getClientTimestampByAsyncStateItemRef(
  //     this.PayGiftInfo?.invalidTime,
  //     this.stateItemVGamePayGiftRef
  //   );
  // }
}
</script>
