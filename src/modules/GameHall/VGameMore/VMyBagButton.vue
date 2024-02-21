<template>
  <button
    class="flex items-center flex-col justify-center active:scale-95 relative w-[64px]"
    @click="onButtonClick"
  >
    <div
      class="w-8 h-8 bg-contain bg-center bg-no-repeat"
      :style="iconStyle"
    ></div>
    <div
      class="pt-1 leading-none text-[#A6340C] font-rubik font-[600] text-xs"
      style="text-shadow: 0px 0.5px 0px #ffe1b2"
    >
      {{ $t('VBG.myBackpack') }}
    </div>
    <slot></slot>
    <portal to="modal">
      <MyBagDlg
        ref="bagDlg"
        v-model="isMyBagOpen"
        @close="onMyBagDlgClose"
      ></MyBagDlg>
    </portal>
  </button>
</template>

<script lang="ts">
import ButtonLockController from '@/controller/ButtonLockController';
import Component from 'vue-class-component';
import { convertBgImageStyle } from '@/utils/styles';
import { waitUserIsLoginedOnly } from '@/store/modules/user.utils';
import { navigation_login_bridge } from '@/js_bridge/js_call_app_base';
import Vue from 'vue';
import MyBagDlg from '@/modules/VRewardProps/MyBagDlg.vue';
import { ROUTENAME_INAPP_VGAME } from '@/constants/localRoutePath';

@Component({
  components: { MyBagDlg },
})
export default class VMyBagButton extends Vue {
  $refs: {
    bagDlg: MyBagDlg;
  };
  get iconStyle() {
    return convertBgImageStyle(
      require('@/assets/gameHall/more/myBag.png'),
      false
    );
  }
  async onButtonClick() {
    if (!ButtonLockController.Instance.tryGetLock('msg', 1)) {
      return;
    }
    this.$emit('close', {});
    const isLogined = await waitUserIsLoginedOnly();
    this.$tracev('click_gamehall_mybag', {
      is_logined: isLogined,
    });
    if (!isLogined) {
      navigation_login_bridge(ROUTENAME_INAPP_VGAME);
      return;
    }
    this.isMyBagOpen = true;
    // openAppH5LinkPreferLocal(ROUTEPATH_V_FAQ + '?tab=faq', {});
  }

  isMyBagOpen = false;

  onMyBagDlgClose(payload: { needRefreshStatus: boolean }) {
    if (payload.needRefreshStatus) {
    }
  }

  closeAll() {
    this.$refs.bagDlg?.closeAll();
    this.isMyBagOpen = false;
  }
}
</script>
