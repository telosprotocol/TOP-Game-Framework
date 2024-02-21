<template>
  <button
    class="w-9 h-9 bg-contain bg-center bg-no-repeat active:scale-95 relative"
    :style="
      $ss.getters.normalizeCss(
        {},
        require('@/assets/gameHall/gameButtons/more3.png?webp'),
        true
      )
    "
    @click="onButtonClick"
  >
    <VDotStatus
      v-if="hasMoreDot"
      status="red"
      class="right-0.5"
      position="right"
    ></VDotStatus>
    <portal to="gameMain">
      <div
        class="absolute inset-0 z-30"
        :style="$ss.getters.normalizeCss({ top: 104 })"
        v-show="isOpen"
      >
        <div
          class="tz-modal_mask"
          style="opacity: 0"
          @click="isOpen = false"
        ></div>
        <div class="absolute right-1.5 -top-2">
          <div
            class="flex flex-col items-center justify-between"
            :style="moreDlgBgStyle"
          >
            <VSettingButton
              class="my-1.5"
              v-if="isGamePkg"
              @close="onCloseOpen"
            ></VSettingButton>
            <VHelpButton
              ref="help"
              v-if="!isGamePkg"
              class="my-1.5"
              @close="onCloseOpen"
            ></VHelpButton>
            <VMyBagButton
              v-if="!isGamePkg"
              class="my-1.5"
              @close="onCloseOpen"
            ></VMyBagButton>
            <VContactButton
              class="my-1.5"
              @close="onCloseOpen"
            ></VContactButton>
            <VWithdrawButton
              class="my-1.5"
              @close="onCloseOpen"
            ></VWithdrawButton>
            <VExchangeCodeButton
              ref="exchangeCode"
              class="my-1.5"
              @close="onCloseOpen"
            ></VExchangeCodeButton>
            <VGameMessageButton
              class="my-1.5"
              @close="onCloseOpen"
              ref="message"
            >
              <VDotStatus
                status="red"
                class="translate-x-1/2"
                position="right"
                v-if="dotInfo.message"
              >
              </VDotStatus>
            </VGameMessageButton>
          </div>
        </div>
      </div>
    </portal>
  </button>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { VUserAccountMixin } from '@/modules/VAssetInfo/VUserAccount.state';
import { Prop } from 'vue-property-decorator';
import VExchangeCodeButton from '@/modules/GameHall/VExchangeCode/VExchangeCodeButton.vue';
import VGameMessageButton from '@/modules/VGameMessage/VGameMessageButton.vue';
import { VMessageStatusMixin } from '@/modules/VGameMessage/message-status.state';
import VMyBagButton from './VMyBagButton.vue';
import VContactButton from './VContactButton.vue';
import VWithdrawButton from './VWithdrawButton.vue';
import VHelpButton from './VHelpButton.vue';
import VDotStatus from '../VDotStatus.vue';
import { convertUrlExpression } from '@/utils/styles';
import { webpFilter } from '@/directives/webp';
import ImagePreloader from '@/controller/ImagePreloader';
import VSettingButton from '../VGameSetting/VSettingButton.vue';
import { checkMinVersionName } from '@/store/modules/app/checkMinVersionName';
const moreDlgBg = require('@/assets/gameHall/more/moreDlgBg.png?webp');
@Component({
  components: {
    VHelpButton,
    VDotStatus,
    VContactButton,
    VWithdrawButton,
    VExchangeCodeButton,
    VGameMessageButton,
    VMyBagButton,
    VSettingButton,
  },
})
export default class VGameMoreButton extends mixins(
  VUserAccountMixin,
  VMessageStatusMixin
) {
  mounted() {
    ImagePreloader.Instance.preloadImage(webpFilter(moreDlgBg));
  }
  $refs: {
    help: VHelpButton;
    exchangeCode: VExchangeCodeButton;
    message: VGameMessageButton;
  };
  get moreDlgBgStyle() {
    return this.$ss.getters.normalizeCss({
      borderImageSource: convertUrlExpression(webpFilter(moreDlgBg)),
      backgroundClip: 'padding-box',
      webkitBackgroundClip: 'padding-box',
      borderImageRepeat: 'stretch',
      borderImageSlice: `32 32 32 32 fill`,
      borderWidth: 16,
      width: 86,
    });
  }
  get isGamePkg() {
    return true;
  }

  get hasSettingIcon() {
    return this.isGamePkg && checkMinVersionName('2.8.9.0');
  }
  /**
   * 2000         
   */
  @Prop({
    type: Boolean,
  })
  isButtonSlotEmpty: boolean;

  get hasMoreDot() {
    const dotInfo = this.dotInfo as any;
    const typeList = Object.getOwnPropertyNames(dotInfo);
    for (let i = 0; i < typeList.length; i++) {
      if (dotInfo[typeList[i]]) {
        return true;
      }
    }
    return false;
  }
  get dotInfo() {
    const VMessageStatus = this.VMessageStatus;
    return {
      message: VMessageStatus
        ? VMessageStatus.hasRead || VMessageStatus.hasReward
        : false,
    };
  }

  // onDotChange() {
  //   console.log('dotChange', this.dotInfo);
  // }

  /**
   *  
   */
  isOpen = false;

  async onButtonClick() {
    this.isOpen = !this.isOpen;
  }

  onCloseOpen() {
    this.isOpen = false;
  }
  get isLogined() {
    return this.$ss.getters['user/isRealLogined'];
  }
  // isChangeNickNameOpen = false;
  // onOpenChangeNickName() {
  //   this.isChangeNickNameOpen = true;
  //   this.onCloseOpen();
  // }

  closeAll() {
    this.isOpen = false;
    this.$refs.exchangeCode?.closeAll();
  }
}
</script>
