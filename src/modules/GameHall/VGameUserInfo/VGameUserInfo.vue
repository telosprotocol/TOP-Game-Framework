<template>
  <div class="flex items-center justify-between">
    <div
      class="shrink-0 relative flex items-center"
      :style="
        $ss.getters.normalizeCss({
          width: 157 + 23,
          height: 46,
          filter: 'drop-shadow(0px 4px 3px rgba(0, 0, 0,0.4))',
        })
      "
    >
      <div
        class="bg-contain absolute bg-no-repeat bg-center z-0"
        :style="
          $ss.getters.normalizeCss(
            {
              width: 157 + 23,
              height: 54,
              left: 13,
              top: -11,
            },
            require('@/assets/gameHall/userinfo/bgUserInfo.png?webp'),
            true
          )
        "
      ></div>
      <div
        @click="onProfileClick"
        class="bg-contain bg-center bg-no-repeat shrink-0 relative z-10 mr-1.5"
        :style="
          $ss.getters.normalizeCss(
            { width: 46, height: 46, padding: 3 },
            require('@/assets/gameHall/userinfo/iconThumbnail.png?webp'),
            true
          )
        "
      >
        <div
          class="rounded-full bg-center bg-cover bg-no-repeat w-full h-full"
          :style="bgThumbnailStyle"
        >
          <img :src="avatar" alt="" class="rounded-full" />
        </div>
      </div>
      <div class="flex-1 mt-[1px] flex flex-col items-start relative z-10">
        <div
          class="font-robot-medium text-xs font-medium shrink-0 truncate text-white"
          :style="
            $ss.getters.normalizeCss({
              height: 14,
              lineHeight: 14,
              textShadow: '0px 1px 0px rgba(0, 0, 0, 0.25)',
            })
          "
        >
          {{ txtUserName }}
        </div>
        <VGameAssetBlock
          :icon-asset-webp="require('@/assets/vcommon/CoinGold.png?webp')"
          :icon-right-webp="
            require('@/assets/gameHall/userinfo/btnPlus.png?webp')
          "
          @click.native="onCoinInfoClick"
          @clickRight="onRechargeClick"
        >
          <van-popover
            theme="dark van-popover--bordered"
            v-model="showCoinSplitPopover"
            placement="bottom"
            class="block underline py-1 text-[#FFF070]"
            trigger="click"
          >
            <div
              class="p-1 max-w-[160px] text-[#FFF070] text-xs leading-[14px] font-robot-medium font-medium"
            >
              <div>{{ $t('V.Bonus') }} : {{ goldDetail.bonusGold }}</div>
              <div>{{ $t('V.Cash') }} : {{ goldDetail.cashGold }}</div>
            </div>
            <template #reference>{{ coinNumText }}</template>
          </van-popover>
        </VGameAssetBlock>
      </div>
    </div>
    <!-- Bars -->

    <div class="flex-1 overflow-hidden flex items-center justify-start pt-2">
      <button
        class="w-12 h-12 bg-contain bg-center bg-no-repeat active:scale-95"
        :style="
          $ss.getters.normalizeCss(
            { marginRight: 12 },
            require('@/assets/gameHall/userinfo/btnWithdraw.png?webp'),
            true
          )
        "
        @click="onWithdrawClick"
      ></button>
      <button
        class="w-12 h-12 bg-contain bg-center bg-no-repeat active:scale-95"
        :style="
          $ss.getters.normalizeCss(
            {},
            require('@/assets/gameHall/userinfo/btnRecharge.png?webp'),
            true
          )
        "
        @click="onStoreClick"
      ></button>
      <portal to="modal">
        <VGameProfile
          ref="gameProfile"
          v-model="isGameProfileShow"
        ></VGameProfile>
      </portal>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/index';
import { VRightStatMixin } from '@/modules/VAssetInfo/RightStat.state';
import { formatVGold2 } from '@/modules/vFormatter';
import { getVGameLevelConfigByGameLevel } from '@/modules/VAssetInfo/VLevels.config';
import { VUserAccountMixin } from '@/modules/VAssetInfo/VUserAccount.state';
import { getVPayUrl } from '@/constants/APP_SCHEMA_URLS';
import { DEFAULT_GAME_AVATAR_URL } from '@/constants/DEFAULT_GAME_AVATAR_URL';
import {
  waitUserIsLoginedAuth,
  waitUserIsLoginedOnly,
} from '@/store/modules/user.utils';
import { navigation_login_bridge } from '@/js_bridge/js_call_app_base';
import { getGoldWithdrawUrl } from '../../vRedirect';
import { Popover } from 'vant';
import VGameAssetBlock from './VGameAssetBlock.vue';
import { MS_SECOND } from '@/constants/time';
import type VGameProfile from '../VGameProfile/VGameProfile.vue';

@Component({
  components: {
    VGameProfile: () => {
      return import(
        /* webpackChunkName: "vgame-async" */ '../VGameProfile/VGameProfile.vue'
      );
    },
    'van-popover': Popover,
    VGameAssetBlock,
  },
})
export default class VGameUserInfo extends mixins(
  VRightStatMixin,
  VUserAccountMixin
) {
  $refs!: { gameProfile: VGameProfile };
  onRechargeClick() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    this.$tracev('click_gamehall_coins_recharge');
    openAppH5LinkPreferLocal(getVPayUrl('gamehall_goldbar'), {
      checkLogin: {
        traceEvent: 'gamehall_goldplus',
      },
    });
  }
  showCoinSplitPopover = false;

  async onCoinInfoClick() {
    const isLogined = await waitUserIsLoginedAuth();
    if (isLogined) {
      this.refreshVRightStat(MS_SECOND);
    }
  }
  onStoreClick() {
    this.$tracev('click_gamehall_userbar_store');
    openAppH5LinkPreferLocal(getVPayUrl('gamehall_topup2'), {
      checkLogin: {
        traceEvent: 'gamehall_topup2',
      },
      getNavLocker: true,
    });
  }

  isGameProfileShow = false;
  async onProfileClick() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    const isLogined = await waitUserIsLoginedOnly();
    if (!isLogined) {
      navigation_login_bridge('gamehall_profile');
      return;
    }
    this.$tracev('click_gamehall_headsculpture', {});
    this.isGameProfileShow = true;
  }

  //#region       
  get txtUserName() {
    const UserAccount = this.UserAccount;
    const nickName = UserAccount?.userInfo?.nickName;
    return (nickName || ' ').substring(0, 10);
  }
  get gameLevelInfo() {
    return getVGameLevelConfigByGameLevel(this.gameLevel);
  }

  get gameLevel() {
    const gameLevel = this.UserAccount?.gameLevel ?? 0;
    return gameLevel;
  }

  get avatar() {
    return this.UserAccount?.userInfo?.avatar || DEFAULT_GAME_AVATAR_URL;
  }

  get bgThumbnailStyle() {
    // const UserAccount = this.UserAccount;
    let avatar = DEFAULT_GAME_AVATAR_URL;

    return this.$ss.getters.normalizeCss(
      { backgroundColor: '#FFD061' },
      avatar,
      false
    );
  }
  //#endregion
  onWithdrawClick() {
    if (!ButtonLockController.Instance.tryGetLock('withdraw')) {
      return;
    }
    this.$tracev('click_gamehall_withdraw_icon');
    openAppH5LinkPreferLocal(getGoldWithdrawUrl('gamehall_withdrawicon'), {});
  }

  //#region  

  get coinNumText() {
    const goldTotalAmount = this.VRightStat?.goldTotalAmount;
    if (!goldTotalAmount) {
      return '-';
    }
    return formatVGold2(Number(goldTotalAmount));
  }

  get goldDetail() {
    const VRightStat = this.VRightStat;
    if (!VRightStat) {
      return {};
    }
    return {
      bonusGold: formatVGold2(Number(VRightStat.bonusGoldTotalAmount)),
      cashGold: formatVGold2(Number(VRightStat.cashGoldTotalAmount)),
    };
  }
  //#endregion

  closeAll() {
    this.$refs.gameProfile?.closeAll();
    this.isGameProfileShow = false;
  }
}
</script>
@/constants/APP_SCHEMA_URLS
