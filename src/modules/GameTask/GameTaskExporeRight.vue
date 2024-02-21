<template>
  <div
    class="bg-top bg-contain bg-no-repeat w-full"
    @click="onTaskClick"
    :style="bgGetMoreCoinStyle"
  ></div>
</template>

<script lang="ts">
import { APP_ROUTE_TAB_WALLET } from '@/constants/APP_SCHEMA_URLS';
import { closeWebviewDialog } from '@/js_bridge/js_call_app_base';
import { convertBgImageStyle } from '@/utils/styles';
import Vue from 'vue';
import Component from 'vue-class-component';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/index';
import ButtonLockController from '@/controller/ButtonLockController';
@Component({
  components: {},
})
export default class GameTaskExporeRight extends Vue {
  async onTaskClick() {
    if (!ButtonLockController.Instance.tryGetNormalLock()) {
      return;
    }
    openAppH5LinkPreferLocal(APP_ROUTE_TAB_WALLET, {});
    setTimeout(() => {
      closeWebviewDialog(null);
    }, 200);
  }
  get bgGetMoreCoinStyle() {
    return convertBgImageStyle(
      this.$ss.getters.translateImage({
        en: require('@/assets/gametask2/banner-en.png?webp'),
        id: require('@/assets/gametask2/banner-id.png?webp'),
      }),
      true,
      this.$ss.getters.designPxsObjToReal({
        height: 73,
      })
    );
  }
}
</script>
@/constants/APP_SCHEMA_URLS
