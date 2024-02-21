<template>
  <div class="px-2 pt-1 flex flex-col h-full">
    <h3 class="shrink-0 flex items-center font-robot-bold text-base mb-1">
      <div
        class="bg-contain bg-center bg-no-repeat mr-1 w-12 h-12"
        :style="
          $ss.getters.convertBgImageStyle(
            require('@/assets/referMoney/iconRecord.png?webp'),
            true
          )
        "
      ></div>
      <div class="flex-1 font-bold">
        {{ $t('VRM.recordTitle') }}
      </div>
      <div
        class="text-[#EB7048] text-xs font-robot-regular text-right"
        v-if="txtUpdatedTime"
      >
        <div>{{ $t('VRM.recordTip2') }}</div>
        <div>{{ txtUpdatedTime }}</div>
      </div>
    </h3>
    <div class="flex-1 px-1 overflow-auto">
      <List v-bind="listBinds" v-on="listListeners">
        <div
          v-for="(item, idx) in dataList"
          :key="idx"
          class="flex text-[#881631] text-xs text-center py-3"
        >
          <div
            class="rounded-full w-10 h-10 bg-cover bg-no-repeat bg-center mr-2 shrink-0"
            :style="$ss.getters.convertBgImageStyle(item.icon, false)"
          ></div>
          <div class="flex-1 text-left">
            <h3 class="text-[14px] mb-2">
              {{ item.nickName }}
            </h3>
            <div class="mb-1">
              {{ $t('VRM.contributedCoins') }}
              <span class="robot-medium text-[#FF9E2D] text-[14px]">{{
                item.txtRp
              }}</span>
            </div>
            <div class="text-[#DFB4A6]">{{ item.txtDate }}</div>
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
    </div>
    <div class="shrink-0 py-2 text-[#DFB4A6] text-xs text-center leading-4">
      <div>{{ $t('VRM.recordTip1') }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import AsyncStatus from '@/components/NoData/AsyncStatus.vue';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { noop } from 'lodash-es';
import Component, { mixins } from 'vue-class-component';
import VListMixin from '@/mixins/VListMixin';

import { stringShield } from '@/utils/string';
import { formatVRp } from '@/modules/vFormatter';
import { formatDateTime } from '@/utils/datetime';
import { DEFAULT_GAME_AVATAR_URL } from '@/constants/DEFAULT_GAME_AVATAR_URL';
import { withdrawalRecordUserInfoV2WithdrawalController } from '@/vservices/restful/WithdrawalController';
import { formatDate } from '../../utils/datetime';
@Component({
  components: {
    AsyncStatus,
  },
})
export default class VReferMoneyRecordTab extends mixins(
  BindEventMixinDefault,
  VListMixin<API.WidthdrawlUserInfoVO>
) {
  useInited() {
    this.onListLoad('init');
    return noop;
  }

  //#region

  get txtUpdatedTime() {
    const firstData = this.rawDataList?.[0];
    if (!firstData || !firstData.modifiedDate) {
      return '';
    }
    return formatDate(Number(firstData.modifiedDate));
  }

  async onListLoad(_from?: 'init' | 'error') {
    this.onReqStart(_from);
    const queryObj = {
      ...this.listQueryObj,
      amountOrder: true,
      count: 30,
    };
    withdrawalRecordUserInfoV2WithdrawalController(queryObj).then((res) => {
      this.onReqEnd(res, queryObj);
      // if (res.success) {
      //   this.listRawStates.finished = true;
      // }
    });
  }
  get dataList() {
    return this.rawDataList.map((item) => {
      return {
        ...item,
        nickName: stringShield(item.name),
        icon: item.portrait || DEFAULT_GAME_AVATAR_URL,
        txtRp: 'Rp' + formatVRp(Number(item.amount)),
        txtDate: formatDateTime(Number(item.createdDate)),
      };
    });
  }
  //#endregion
}
</script>
