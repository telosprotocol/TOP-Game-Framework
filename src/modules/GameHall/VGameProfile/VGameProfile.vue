<template>
  <GameDlgUI
    :value="value"
    @input="emitDlgVisible"
    :img-title="
      $ss.getters.translateImage({
        en: require('@/assets/gameProfile/Profile.png'),
        id: require('@/assets/gameProfile/Profil.png'),
      })
    "
    @close="onCloseClicked"
  >
    <!-- HeadBlock -->
    <section
      class="bg-contain bg-center bg-no-repeat mx-auto flex flex-col items-center justify-center mb-4"
      :style="
        $ss.getters.normalizeCss(
          {
            width: 286,
            height: 166,
          },
          require('@/assets/gameProfile/bgHead.png?webp')
        )
      "
    >
      <!-- Thumbnail -->
      <div
        class="border-[3px] shrink-0 border-solid border-[#EBA055] bg-center bg-cover bg-no-repeat rounded-full mx-auto relative mb-3"
        :style="bgThumbnailStyle"
      ></div>
      <!-- NickName -->
      <div
        class="text-[#A66643] text-2xl robot-bold flex items-center justify-center relative max-w-full pl-6 pr-4"
      >
        <div class="whitespace-nowrap flex-1 text-ellipsis overflow-hidden">
          {{ accountInfo.userInfo.nickName || '' }}
        </div>
        <button
          @click="onEditNameOpen"
          class="bg-center bg-contain bg-no-repeat active:scale-95 shrink-0 ml-2"
          :style="
            $ss.getters.normalizeCss(
              {
                width: 16,
                height: 16,
              },
              require('@/assets/gameProfile/iconPencil.png?webp'),
              true
            )
          "
        ></button>
      </div>
    </section>
    <main class="px-2 text-base leading-none text-[#FFE1B6] font-robot-regular">
      <!-- ID -->
      <VGameProfileInfoBlockUI
        :icon-left-webp="require('@/assets/gameProfile/id.png?webp')"
        :icon-right-webp="
          accountInfo.userInfo.userId
            ? require('@/assets/gameProfile/iconCopy.png?webp')
            : null
        "
        @clickRight="onCopyUserIdClick"
      >
        {{ accountInfo.userInfo.userId || '' }}
      </VGameProfileInfoBlockUI>
      <!-- Gold -->
      <VGameProfileInfoBlockUI
        :is-large="true"
        :icon-left-webp="require('@/assets/vcommon/CoinGold.png?webp')"
        :icon-right-webp="require('@/assets/gameProfile/iconPlus.png?webp')"
        @clickRight="onRechargeClick"
      >
        {{ coinNumText }}
      </VGameProfileInfoBlockUI>
      <!-- PHONE -->

      <VGameProfileInfoBlockUI
        :icon-left-webp="require('@/assets/gameProfile/iconTel.png?webp')"
        :icon-right-webp="require('@/assets/gameProfile/iconEdit.png?webp')"
        @clickRight="onBindMobileClick"
      >
        <div class="ml-6 mr-1 pr-1 text-[#56F7EC]" slot="iconInner">+62|</div>
        {{ txtPhone }}
      </VGameProfileInfoBlockUI>
      <!-- Email -->
      <VGameProfileInfoBlockUI
        :icon-left-webp="require('@/assets/gameProfile/iconEmail.png?webp')"
        @clickRight="onBindMobileClick"
      >
        {{ txtEmail }}
      </VGameProfileInfoBlockUI>
    </main>

    <div
      class="flex justify-between items-center text-xs text-[#BB671C] underline leading-4 px-4 -mt-2"
    >
      <div class="active:scale-95" @click="goToTermsOfUser">
        {{ $t('VG.gameUserAgreement') }}
      </div>
      <div class="active:scale-95" @click="goToPrivacyPolicy">
        {{ $t('VG.privacyProtectionGuide') }}
      </div>
    </div>
    <portal to="modal">
      <VBindMobileDlg
        v-model="isBindPhoneDlgOpened"
        from="gameHall"
        :phone="txtPhone"
        @bindOK="onBindOK"
      />
      <VGameNickNameChangeDlg
        v-model="isEditNameDlgOpen"
        :inital-value="accountInfo.userInfo.nickName"
        @success="onNameChangedOK"
      ></VGameNickNameChangeDlg>
    </portal>
  </GameDlgUI>
</template>
<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { convertBgImageStyle } from '@/utils/styles';
import ButtonLockController from '@/controller/ButtonLockController';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/index';
import { VUserAccountMixin } from '@/modules/VAssetInfo/VUserAccount.state';
import { DEFAULT_GAME_AVATAR_URL } from '@/constants/DEFAULT_GAME_AVATAR_URL';
import { getVGameLevelConfigByGameLevel } from '@/modules/VAssetInfo/VLevels.config';
import type { IUserAccountVO } from '@/modules/VAssetInfo/VUserAccount.state';
import {
  dismissLoading_bridge,
  pasteStr,
  showLoading_bridge,
} from '@/js_bridge/js_call_app_base';
import { getVPayUrl } from '@/constants/APP_SCHEMA_URLS';
import { VRightStatMixin } from '@/modules/VAssetInfo/RightStat.state';
import { formatVGold2, formatVToken2 } from '@/modules/vFormatter';
import VBindMobileDlg from './VBindMobileDlg.vue';
import { bannerNavigation } from '@/utils/navigator';
import { BannerOpType } from '@/constants/BannerOpType';
import VGameNickNameChangeDlg from './VGameNickNameChangeDlg.vue';
import { getMobileInfoUserController } from '@/vservices/client/UserController';
import GameDlgUI from '@/modules/UI/GameDlgUI.vue';
import createGameToast from '@/modules/UI/createGameToast';
import VGameProfileInfoBlockUI from './VGameProfileInfoBlockUI.vue';
import { MS_SECOND } from '@/constants/time';
import { OFFISIAL_SITE_DOMAIN } from '@/constants/Domains';

@Component({
  components: {
    VBindMobileDlg,
    VGameNickNameChangeDlg,
    GameDlgUI,
    VGameProfileInfoBlockUI,
  },
})
export default class VGameProfile extends mixins(
  PopupMixin,
  VUserAccountMixin,
  VRightStatMixin
) {
  //#region Dlg Basic Setting
  dlgSound = true;

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.isUserBindInfoRefresed = false;
      this.refreshUserBindMobileInfo();
      this.refreshVRightStat(MS_SECOND);
      this.refreshVUserAccount(MS_SECOND);
    }
  }

  onCloseClicked() {
    this.$tracev('close_gamehall_headsculpture', {});
  }
  //#endregion

  get bgThumbnailStyle() {
    const avatar = this.accountInfo.userInfo.avatar || DEFAULT_GAME_AVATAR_URL;
    return convertBgImageStyle(
      avatar,
      false,
      this.$ss.getters.designPxsObjToReal({
        width: 72,
        height: 72,
      })
    );
  }

  get levelIconStyle() {
    const gameLevel = this.accountInfo.gameLevel;
    if (gameLevel === null) {
      return {};
    }
    const gameLevelConfig = getVGameLevelConfigByGameLevel(gameLevel);
    return {
      ...gameLevelConfig.iconStyle,
      ...this.$ss.getters.designPxsObjToReal({
        height: 40,
      }),
    };
  }

  get accountInfo() {
    return (
      this.UserAccount ||
      ({
        userInfo: {},
      } as Partial<IUserAccountVO>)
    );
  }

  //#region       

  get tokenText() {
    const dstTotalAmount = this.VRightStat?.dstTotalAmount;
    if (!dstTotalAmount) {
      return '-';
    }
    return formatVToken2(Number(dstTotalAmount));
  }

  get coinNumText() {
    const goldTotalAmount = this.VRightStat?.goldTotalAmount;
    if (!goldTotalAmount) {
      return '-';
    }
    return formatVGold2(Number(goldTotalAmount));
  }
  //#endregion
  goToTermsOfUser() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    this.$tracev('click_headsculpture_termofuser');

    bannerNavigation({
      url: OFFISIAL_SITE_DOMAIN + '/agreement',
      opType: BannerOpType.AppLink,
    });
  }

  goToPrivacyPolicy() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    this.$tracev('click_headsculpture_pravicypolicy');
    bannerNavigation({
      url: OFFISIAL_SITE_DOMAIN + '/PrivacyPolicy',
      opType: BannerOpType.AppLink,
    });
  }

  onCopyUserIdClick() {
    const userId = this.accountInfo.userInfo.userId;
    if (!userId) {
      return;
    }
    if (!ButtonLockController.Instance.tryGetLock('copy', 1)) {
      return;
    }
    this.$tracev('click_headsculpture_copyid', { nameid: userId });
    pasteStr({ content: userId });
    createGameToast(this.$t('Base.CopySucceeded'));
  }
  onRechargeClick() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    this.$tracev('click_headsculpture_topup', {
      initial_coins: this.coinNumText,
    });
    openAppH5LinkPreferLocal(getVPayUrl('gamehall_profile'), {
      checkLogin: {
        traceEvent: 'gamehall_profile_recharge',
      },
    });
  }

  get txtEmail() {
    return this.UserAccount?.userInfo?.email ?? '';
  }

  //#region  

  get txtPhone() {
    return this.userBindInfo?.lastBindingMobile;
  }

  userBindInfo = {
    lastBindTime: undefined as number,
    up_data_mobile: true,
    lastBindingMobile: '' as string,
  };

  isBindPhoneDlgOpened = false;

  isUserBindInfoRefresed = false;
  async refreshUserBindMobileInfo() {
    const res = await getMobileInfoUserController();
    if (!res.success) {
      createGameToast(res.message);
      return false;
    }
    this.isUserBindInfoRefresed = true;
    this.userBindInfo.lastBindingMobile = res.data.lastBindingMobile;
    this.userBindInfo.lastBindTime = Number(res.data.lastBindingTime);
    this.userBindInfo.up_data_mobile = res.data.upDataMobile;
    return true;
  }

  async onBindMobileClick() {
    if (!ButtonLockController.Instance.tryGetLock('bind', 1)) {
      return;
    }
    this.$tracev('click__headsculpture_modifynumber', {
      oldnumber: this.userBindInfo?.lastBindingMobile,
    });
    if (!this.isUserBindInfoRefresed) {
      showLoading_bridge();
      const isOK = await this.refreshUserBindMobileInfo();
      dismissLoading_bridge();
      if (!isOK) {
        return;
      }
    }
    this.isBindPhoneDlgOpened = true;
  }
  onBindOK() {
    this.refreshUserBindMobileInfo();
  }
  //#endregion

  isEditNameDlgOpen = false;
  onEditNameOpen() {
    if (!ButtonLockController.Instance.tryGetLock('edit', 1)) {
      return;
    }
    this.isEditNameDlgOpen = true;
  }

  onNameChangedOK(nickName: string) {
    if (this.accountInfo && this.accountInfo.userInfo) {
      this.accountInfo.userInfo.nickName = nickName;
    }
  }

  closeAll() {
    this.isEditNameDlgOpen = false;
    this.isBindPhoneDlgOpened = false;
  }
}
</script>
@/constants/APP_SCHEMA_URLS
