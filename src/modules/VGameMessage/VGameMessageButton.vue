<template>
  <button
    class="flex items-center flex-col justify-center active:scale-95 relative w-[64px]"
    @click="onButtonClick('click')"
  >
    <div
      class="w-8 h-8 bg-contain bg-center bg-no-repeat relative"
      :style="iconStyle"
    >
      <slot></slot>
    </div>
    <div
      class="pt-1 leading-none text-[#A6340C] font-rubik font-[600] text-xs"
      style="text-shadow: 0px 0.5px 0px #ffe1b2"
    >
      {{ $t('VG.message') }}
    </div>
    <portal to="modal">
      <VGameMessageDlg
        ref="msgDlg"
        v-model="isMessageDlgShow"
        @close="onMessageDlgClose"
      ></VGameMessageDlg>
    </portal>
  </button>
</template>

<script lang="ts">
import ButtonLockController from '@/controller/ButtonLockController';
import Component from 'vue-class-component';
import VGameMessageDlg from './VGameMessageDlg.vue';
import { waitUserIsLoginedOnly } from '@/store/modules/user.utils';
import { navigation_login_bridge } from '@/js_bridge/js_call_app_base';
import { ROUTENAME_INAPP_VGAME } from '@/constants/localRoutePath';
import { mixins } from 'vue-class-component';
import { VMessageStatusMixin } from './message-status.state';
import { pageMessageController } from '@/vservices/client/MessageController';
import {
  getLastAutoMsgDlgPushTime,
  setLastAutoMsgDlgPushTime,
} from '@/controller/PersistentLocalStorage';
import { convertBgImageStyle } from '@/utils/styles';
@Component({
  components: { VGameMessageDlg },
})
export default class VGameMessageButton extends mixins(VMessageStatusMixin) {
  $refs: {
    msgDlg: VGameMessageDlg;
  };
  get iconStyle() {
    return convertBgImageStyle(
      require('@/assets/gameHall/more/message.png'),
      false
    );
  }
  async onButtonClick(from?: string | 'click') {
    if (!ButtonLockController.Instance.tryGetLock('msg', 1)) {
      return;
    }
    this.$emit('close', {});
    const isLogined = await waitUserIsLoginedOnly();
    this.$tracev('click_app_in_message', {
      is_logined: isLogined,
      click_from: from,
    });
    if (!isLogined) {
      navigation_login_bridge(ROUTENAME_INAPP_VGAME);
      return;
    }
    this.isMessageDlgShow = true;
  }

  isMessageDlgShow = false;

  onMessageDlgClose(_payload: { needRefreshStatus: boolean }) {
    this.refreshVMessageStatus(0);
    // if (payload.needRefreshStatus) {
    // }
  }

  tryOpenMessageDlg(from: string) {
    //      from,  h5command,push
    this.onButtonClick(from);
  }

  closeAll() {
    this.$refs.msgDlg?.closeAll();
    this.isMessageDlgShow = false;
  }

  async tryOpenUnreadedMsg(from: 'hall_init' | 'game_settled') {
    const lastPushTime = getLastAutoMsgDlgPushTime() || 0;
    const res = await pageMessageController({
      pageIndex: 1,
      pageSize: 1,
    });
    if (res.success && res.data && res.data.length > 0 && this.$refs.msgDlg) {
      const detailItem = res.data[0];
      if (
        detailItem.pushDateTime > lastPushTime &&
        detailItem.readStatus === false
      ) {
        setLastAutoMsgDlgPushTime(detailItem.pushDateTime);
        this.$refs.msgDlg.onOpenDetail(res.data[0], from);
        return true;
      }
    }
    return false;
  }
}
</script>
