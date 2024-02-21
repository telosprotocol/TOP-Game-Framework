<template>
  <div class="h-full flex flex-col">
    <div class="flex-1 pt-4">
      <div class="text-sm font-semibold text-[#333] mb-8">
        {{ $t('VFAQ.csTip') }}
      </div>
      <AsyncStatus :status="status" @retry="onRetry"></AsyncStatus>
      <div v-for="item in csList" :key="item.name" class="mb-6">
        <div class="text-sm font-semibold text-[#333]">{{ item.name }}:</div>
        <button
          class="vbutton font-rubik w-full h-12 active:scale-95"
          @click="onContactClick(item)"
          :style="$ss.getters.normalizeCss({ fontSize: 18, paddingTop: 8 })"
        >
          <ib
            class="bg-contain bg-center bg-no-repeat mr-0.5"
            :style="
              $ss.getters.normalizeCss(
                { width: 26, height: 22 },
                require('@/assets/gameHall/telegram.png')
              )
            "
          ></ib>
          {{ $t('VFAQ.clickContact') }}
        </button>
      </div>
    </div>
    <div class="text-[13px] text-center text-[#9567D1] pb-4">
      {{ $t('VFAQ.csBottom') }}
    </div>
  </div>
</template>

<script lang="ts">
import AsyncStatus from '@/components/NoData/AsyncStatus.vue';
import { MS_SECOND } from '@/constants/time';
import ButtonLockController from '@/controller/ButtonLockController';
import { openNativeApp } from '@/js_bridge/js_call_app_base';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import Component, { mixins } from 'vue-class-component';
import { noop } from 'vue-class-component/lib/util';
import { CustomerTgsListMixin } from './CustomerTgs.state';
@Component({ components: { AsyncStatus } })
export default class OnlineCSPanel extends mixins(
  CustomerTgsListMixin,
  BindEventMixinDefault
) {
  useInited() {
    this.refreshCustomerTgsList();
    return noop;
  }
  get csList() {
    return this.CustomerTgsList;
  }
  get status() {
    return this.stateItemCustomerTgsListRef.status;
  }

  onRetry() {
    this.refreshCustomerTgsList(MS_SECOND);
  }
  onContactClick(item: typeof OnlineCSPanel.prototype.csList[0]) {
    if (!ButtonLockController.Instance.tryGetLock('contact')) {
      return;
    }
    openNativeApp({
      appNativeUri: item.telegram,
      appWebViewUri: item.telegram,
    });
  }
}
</script>
