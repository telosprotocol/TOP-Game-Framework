<template>
  <button
    class="flex items-center flex-col justify-center active:scale-95 relative w-[64px]"
    @click="onButtonClick"
  >
    <div
      class="w-[30px] h-[30px] bg-contain bg-center bg-no-repeat"
      :style="iconStyle"
    ></div>
    <div
      class="pt-1 leading-none text-white font-rubik font-[600] text-xs vshadow-stroke shadow-[#52307E] break-words"
    >
      {{ $t('VG.bindMobile') }}
    </div>
    <portal to="modal">
      <VRightUserBindDlg
        v-model="isBindPhoneDlgOpened"
        from="gameHall"
        :last-bind-time="userBindInfo.lastBindTime"
        :up_data_mobile="userBindInfo.up_data_mobile"
        @bindOK="onBindOK"
      />
    </portal>
  </button>
</template>

<script lang="ts">
import ButtonLockController from '@/controller/ButtonLockController';
import Component from 'vue-class-component';
import { convertBgImageStyle } from '@/utils/styles';
import { Toast } from 'vant';
import VRightUserBindDlg from './VRightUserBindDlg.vue';
import { mixins } from 'vue-class-component';
import { VUserAccountMixin } from '@/modules/VAssetInfo/VUserAccount.state';
import { waitUserIsLoginedOnly } from '@/store/modules/user.utils';
import {
  dismissLoading_bridge,
  navigation_login_bridge,
  showLoading_bridge,
} from '@/js_bridge/js_call_app_base';
import { ROUTENAME_INAPP_VGAME } from '@/constants/localRoutePath';
import { getMobileInfoUserController } from '@/vservices/client/UserController';
@Component({
  components: { VRightUserBindDlg },
})
export default class VBindMobileButton extends mixins(VUserAccountMixin) {
  get iconStyle() {
    return convertBgImageStyle(
      require('@/assets/gameHall/gameButtons/PhoneNumber.png?webp'),
      true
    );
  }

  userBindInfo = {
    lastBindTime: undefined as number,
    up_data_mobile: true,
  };
  isBindPhoneDlgOpened = false;
  async onButtonClick() {
    if (!ButtonLockController.Instance.tryGetLock('bind', 1)) {
      return;
    }
    this.$trace('click_gamehall_bind');
    this.$emit('close', {});
    showLoading_bridge();
    const isLogined = await waitUserIsLoginedOnly();
    if (!isLogined) {
      navigation_login_bridge(ROUTENAME_INAPP_VGAME);
      dismissLoading_bridge();
      return;
    }
    const res = await getMobileInfoUserController();
    dismissLoading_bridge();
    if (!res.success) {
      Toast(res.message);
      return;
    }
    this.userBindInfo.lastBindTime = Number(res.data.lastBindingTime);
    this.userBindInfo.up_data_mobile = res.data.upDataMobile;
    this.isBindPhoneDlgOpened = true;
  }

  onBindOK() {}
}
</script>
