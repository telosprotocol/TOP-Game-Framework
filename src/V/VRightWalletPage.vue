<template>
  <div class="bg-[#F1EDF6] min-h-screen relative z-0">
    <div
      class="bg-[length:100%_auto] bg-top bg-no-repeat fixed top-0 left-0 right-0 -z-10"
      :style="bgPurpleHeadStyle"
    ></div>
    <HeaderTop
      left-icon="icon-left"
      :title="$t('VRW.myWallet')"
      :bar-background="statusBarColor"
      skin="dark"
    ></HeaderTop>
    <VWalletHead></VWalletHead>
    <main class="px-4 py-4 flex-1 overflow-y-auto">
      <VWalletDST class="mb-3"></VWalletDST>
      <VWalletGold class="mb-3"></VWalletGold>
      <VWalletBanner></VWalletBanner>
    </main>
  </div>
</template>

<script lang="ts">
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import StatusBarMixin from '@/mixins/StatusBarMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { tryMergeLocalesForVPrjCommon } from '@/locales/Page/VPrj/V/init';
import { tryMergeLocalesForVPrjMyWalletAndWithdraw } from '@/locales/Page/VPrj/VRW/init';
import VWalletDST from '@/modules/RightWallet/WalletIndex/VWalletDST.vue';
import VWalletGold from '@/modules/RightWallet/WalletIndex/VWalletGold.vue';
import VWalletHead from '@/modules/RightWallet/WalletIndex/VWalletHead.vue';
import HeaderTop from '@/components/HeaderTop/index.vue';
import { convertBgImageStyle } from '@/utils/styles';
import VWalletBanner from '@/modules/RightWallet/WalletIndex/VWalletBanner.vue';
import {
  onAssetInfoSyncForWalletInfo,
  VRightWalletInfoMixin,
} from '@/modules/RightWallet/RightWallet.state';

tryMergeLocalesForVPrjCommon();
tryMergeLocalesForVPrjMyWalletAndWithdraw();

onAssetInfoSyncForWalletInfo();
@Component({
  components: {
    HeaderTop,
    VWalletHead,
    VWalletGold,
    VWalletDST,
    VWalletBanner,
  },
})
export default class VRightWalletPage extends mixins(
  BindEventMixinDefault,
  StatusBarMixin,
  VRightWalletInfoMixin
) {
  get bgPurpleHeadStyle() {
    return convertBgImageStyle(
      require('@/assets/vcommon/head/purpleHeadBg.png?webp'),
      true,
      this.$ss.getters.designPxsObjToReal({
        width: 360,
        height: 294,
      })
    );
  }
  statusBarColor = '#9350CA';
  useInited() {
    this.$trace('me_wallet_exposure');
    this.refreshVRightWalletInfo();
    return () => {};
  }
}
</script>
