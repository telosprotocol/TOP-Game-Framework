<template>
  <transition name="tz-transwrap">
    <div
      class="tz-modal tz-transwrap-scale flex items-center justify-center"
      v-show="value"
      v-bind="$attrs"
    >
      <div class="tz-modal_mask" @click="onCloseClicked"></div>
      <!-- Dlg Container: FullScreen -->
      <div
        class="relative w-[316px] bg-gradient-to-b from-[#8C33C1] to-[#FF9608] rounded-lg p-2 pt-5 tz-transel-scaleInOut mt-10"
      >
        <div
          :style="headerBarStyle"
          class="absolute left-1/2 -translate-x-1/2 bg-center bg-contain bg-no-repeat -translate-y-full"
        >
          <div
            class="absolute bottom-3 left-0 right-0 text-center font-rubik font-bold italic vshadow-stroke-2 shadow-[#337C12] text-white text-xl"
          >
            {{ $t('VG.CHECKIN') }}
          </div>
        </div>
        <main class="bg-[#FFF3D9] rounded-lg pt-10 px-3" @click="doCheckIn">
          <div class="flex flex-wrap justify-between">
            <component
              :is="item.comp"
              class="mb-4"
              v-for="item in dayList"
              :key="item.day"
              :day="item.day"
              :info="(VCheckinList || [])[item.idx]"
            ></component>
          </div>
          <div
            :class="{ invisible: !toCheckItem }"
            class="text-[#A16D25] -mt-2 pb-1 text-[13px] leading-4 text-center"
          >
            {{ $t('V.ClickToClaim') }}
          </div>
        </main>

        <!-- CloseButton -->
        <button
          @click="onCloseClicked"
          class="absolute right-0 -top-2 -translate-y-full w-[30px] h-[30px] bg-contain bg-center bg-no-repeat active:scale-95"
          v-webp="require('@/assets/vcommon/close/btnCloseWooden.png?webp')"
        ></button>
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
import CheckinDayItem from './CheckinDayItem.vue';
import CheckinDay7Item from './CheckinDay7Item.vue';
import { VCheckinListMixin } from './vcheckin-list.state';
import { Watch } from 'vue-property-decorator';
import { checkInCheckInRewardController } from '@/vservices/client/CheckInRewardController';
@Component({
  components: { CheckinDayItem, CheckinDay7Item },
})
export default class VCheckinDlg extends mixins(PopupMixin, VCheckinListMixin) {
  //#region Dlg Basic Setting

  // remove if not used
  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$tracev('gameuser_signin_exposure');
      this.refreshVCheckinList(0);
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$tracev('close_gameuser_signin');

    this.emitDlgVisible(false);
  }

  get headerBarStyle() {
    return this.$ss.getters.convertBgImageStyle(
      '/online/checkin/checkin_head.png',
      true,
      this.$ss.getters.designPxsObjToReal({
        width: 320,
        height: 155,
        top: 40,
      })
    );
  }
  //#endregion

  get dayList() {
    return Array.from({ length: 7 }).map((_, idx) => {
      const day = idx + 1;
      return {
        idx,
        day,
        comp: day === 7 ? CheckinDay7Item : CheckinDayItem,
      };
    });
  }

  get toCheckItem() {
    const VCheckinList = this.VCheckinList || [];
    const toCheckItem = VCheckinList.find(
      (item) => item.checkInStatus === 'TO_BE_SIGNED'
    );
    return toCheckItem;
  }
  async doCheckIn() {
    const toCheckItem = this.toCheckItem;
    if (!toCheckItem) {
      return;
    }
    if (!ButtonLockController.Instance.tryGetLock('checkin', 1)) {
      return;
    }
    this.$tracev('click_gameuser_signin_day', {
      signin_day: toCheckItem.checkInDays + '',
      signin_coins: toCheckItem.rewardAmount + '',
    });
    const res = await checkInCheckInRewardController();
    if (res.success) {
      this.$emit('checkinOk', toCheckItem);
      this.emitDlgVisible(false);
    } else {
      Toast(res.message);
    }
  }
}
</script>
