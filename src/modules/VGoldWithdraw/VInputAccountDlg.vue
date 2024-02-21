<template>
  <transition name="tz-transwrap">
    <div class="tz-modal tz-transwrap-scale" v-show="value" v-bind="$attrs">
      <div class="tz-modal_mask"></div>
      <!-- Dlg Container: FullScreen -->
      <div
        class="absolute inset-0 flex items-center justify-center tz-transel-scaleInOut"
      >
        <!-- DlgContent Include bg -->
        <div
          class="relative w-80 p-2 pt-3 pb-6 bg-gradient-to-b from-[#AA76F1] to-[#8153DD] text-[#333333] rounded-xl"
        >
          <button
            class="absolute right-1 -top-2 -translate-y-full w-[30px] h-[30px] bg-contain bg-center bg-no-repeat active:scale-95"
            @click="onCloseClicked"
            v-webp="require('@/assets/vcommon/close/btnSimpleClose.png?webp')"
          ></button>
          <h3 class="robot-medium text-base mb-1 text-white flex items-center">
            <div
              class="bg-contain bg-left bg-no-repeat"
              v-if="info"
              :style="
                $ss.getters.convertBgImageStyle(
                  info.icon,
                  false,
                  $ss.getters.designPxsObjToReal({
                    width: 72,
                    height: 29,
                  })
                )
              "
            ></div>
            {{ $t('VGW.withdrawalInfo') }}
          </h3>
          <main class="rounded-xl bg-[#FFFFFF] p-3 pt-7 text-[14px]">
            <h4 class="robot-medium mb-2 text-[#666]">
              {{ accountConfig.inputTitle }}
            </h4>
            <div class="mx-1 mb-7 flex relative font-semibold">
              <input
                type="text"
                :value="txtAccount"
                @input="onAccountChange"
                @change="onAccountChange"
                class="flex-1 border border-solid border-[#9567D1] rounded-md bg-white h-10 flex items-center justify-center pr-3 text-[#333] text-base robot-medium leading-none"
                :class="{
                  'pl-12': !!accountConfig.prefix,
                  'pl-3': !accountConfig.prefix,
                }"
                :placeholder="accountConfig.inputTitle"
                :maxlength="maxLength"
              />
              <div
                class="absolute left-2 h-full flex items-center"
                v-if="accountConfig.prefix"
              >
                {{ accountConfig.prefix }}
              </div>
            </div>
            <button
              class="vbutton font-rubik w-full h-12 mb-3"
              :class="{ 'active:scale-95': isConfirmValid }"
              :disabled="!isConfirmValid"
              @click="onOkClicked"
            >
              {{ $t('Base.CONFIRM') }}
            </button>
          </main>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Toast } from 'vant';
import { Prop, Watch } from 'vue-property-decorator';

import { trim } from 'lodash-es';
import { checkAndForceUpdate } from '@/utils/dom/input';
import { saveWithdrawalController } from '@/vservices/client/WithdrawalController';
import { waitUserIsLoginedAuth } from '../../store/modules/user.utils';
import { saveWithdrawalAccountInfoForGuest } from '@/modules/VGoldWithdraw/controller/VGoldWithdraw.state';

@Component({
  components: {},
})
export default class VInputAccountDlg extends mixins(PopupMixin) {
  @Prop({
    type: Object,
    required: false,
  })
  info: API.WithdrawalForAccountViewVO;
  @Prop({
    type: String,
    required: false,
  })
  from: string;
  /**
   *
   */
  @Prop({
    type: String,
    required: false,
  })
  openSource: string;

  @Prop({
    type: String,
  })
  smallLimitAmount: BigDecimalString;
  //#region Dlg Basic Setting

  // remove if not used
  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.txtAccount = '';

      // this.$trace('address_book_writeauth_exposure', {
      //   open_type: from,
      // });
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    const info = this.info;
    this.$tracev('close_game_tarikdana_editdlg', {
      channel: info.type,
      verify_source: this.from,
      open_source: this.openSource,
      login_type: this.$ss.state.user.isLogined ? '1' : '0',
    });

    this.emitDlgVisible(false);
  }
  //#endregion

  get accountConfig() {
    if (this.info?.isBank) {
      return {
        isBank: true,
        inputTitle: this.$t('VGW.enterBankCardNumber'),
        prefix: '',
        countryCode: 0,
        minLength: 1,
        maxLength: 20,
        okTip: this.$t('VGW.changeCardNoOK'),
      };
    } else {
      return {
        isBank: false,
        inputTitle: this.$t('VGW.enterPhoneNumber'),
        prefix: '+62',
        countryCode: 62,
        minLength: 5,
        maxLength: 12,
        okTip: this.$t('VGW.changePhoneNumOK'),
      };
    }
  }
  txtAccount = '';

  onAccountChange(e: Event) {
    const inputValue = (e.target as HTMLInputElement).value || '';
    const preValue = this.txtAccount;
    let newValue = trim(inputValue).replace(/[^0-9]/gi, '');
    if (newValue.length > this.maxLength) {
      newValue = newValue.substring(0, this.maxLength);
    }
    this.txtAccount = newValue;
    checkAndForceUpdate(this, {
      preValue,
      newValue,
      inputValue,
    });
  }
  get maxLength() {
    return this.accountConfig.maxLength;
  }
  get isConfirmValid() {
    const txtAccountLength = this.txtAccount.length;
    return (
      txtAccountLength >= this.accountConfig.minLength &&
      txtAccountLength <= this.maxLength
    );
  }
  async onOkClicked() {
    if (!this.isConfirmValid) {
      return;
    }
    if (!ButtonLockController.Instance.tryGetLock('bindNum', 0.5)) {
      return;
    }
    const accountConfig = this.accountConfig;
    const info = this.info;
    const traceParam = {
      channel: info.type,
      channelNo: this.txtAccount,
      verify_source: this.from,
    };
    let invalidMsg = '';
    const channelNumber = this.txtAccount;
    if (!accountConfig.isBank) {
      if (channelNumber[0] !== '8') {
        invalidMsg = this.$t('VGW.invalidPhoneNum') as string;
      }
    }
    this.$tracev('click_game_tarikdana_editsubmit', {
      ...traceParam,
      is_valid: invalidMsg ? '0' : '1',
      invalid_msg: invalidMsg,
      open_source: this.openSource,
      login_type: this.$ss.state.user.isLogined ? '1' : '0',
    });
    if (invalidMsg) {
      Toast(invalidMsg);
      return;
    }
    const formData = {
      countryCode: this.accountConfig.countryCode,
      channelType: this.info
        ?.type as API.WithdrawalChannelBindAO['channelType'],
      channelNumber,
    };

    const isLogined = await waitUserIsLoginedAuth();

    const res = await (isLogined
      ? saveWithdrawalController(formData)
      : saveWithdrawalAccountInfoForGuest({
          ...formData,
          smallLimitAmount: this.smallLimitAmount,
        }));

    this.$tracev('click_game_tarikdana_editsubmit_result', {
      ...traceParam,
      Result: res.success ? '1' : '0',
    });
    if (res.success) {
      this.$emit('updated', {
        ...this.info,
        channelNumber: formData.channelNumber,
      });
      this.emitDlgVisible(false);
      Toast(accountConfig.okTip);
    } else {
      Toast(res.message);
    }
  }
}
</script>
