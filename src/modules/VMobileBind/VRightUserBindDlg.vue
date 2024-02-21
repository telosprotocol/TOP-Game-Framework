<template>
  <transition name="tz-transwrap" :duration="250">
    <div class="tz-modal" v-show="value" v-bind="$attrs">
      <div class="tz-modal_mask"></div>
      <!-- Dlg Container: FullScreen -->
      <div
        class="absolute inset-0 flex items-center justify-center tz-transel-scaleInOut"
      >
        <div
          class="mx-3 w-[336px] p-4 pb-6 bg-gradient-to-b from-[#AA76F1] to-[#8153DD] rounded-xl relative"
        >
          <button
            class="absolute -top-3 -right-2 -translate-y-full w-[30px] h-[30px] bg-contain bg-center bg-no-repeat active:scale-95"
            @click="onCloseClicked"
            v-webp="require('@/assets/vcommon/close/btnPurpleClose.png?webp')"
          ></button>
          <div
            class="robot-bold text-white text-base leading-none flex items-left pb-2"
          >
            {{ $t('VUBM.bindPhoneNumber') }}
          </div>

          <main class="relative p-3 rounded-md bg-white">
            <div class="text-[#666] text-sm mb-4">
              <div class="form-item mb-4">
                <label class="robot-medium">{{
                  $t('VUBM.enterYourPhoneNumber')
                }}</label>
                <div class="input-wrapper">
                  <div class="mr-2">0{{ countryCode }}</div>
                  <input
                    type="text"
                    :style="$ss.getters.designPxsObjToReal({ width: 220 })"
                    :placeholder="$t('VUBM.enterYourPhoneNumber')"
                    @input="mobileChange"
                    v-model="mobile"
                  />
                </div>
              </div>
              <div class="form-item mb-4">
                <label class="robot-medium">
                  {{ $t('VUBM.enterImageCode') }}
                </label>
                <div class="input-wrapper">
                  <input
                    class="flex-1"
                    :style="$ss.getters.designPxsObjToReal({ width: 180 })"
                    type="text"
                    :placeholder="$t('VUBM.enterImageCode')"
                    :maxlength="CAPTCHA_LENGTH"
                    v-model="txtCaptcha"
                  />
                  <VCaptchaBlock class="shrink-0" ref="captcha"></VCaptchaBlock>
                </div>
              </div>
              <div class="form-item mb-4">
                <label class="robot-medium">{{
                  $t('VUBM.enterVerificationCode')
                }}</label>
                <div class="input-wrapper">
                  <input
                    :style="$ss.getters.designPxsObjToReal({ width: 198 })"
                    type="text"
                    ref="txtVCode"
                    :placeholder="$t('VUBM.enterVerificationCode')"
                    @input="verifyCodeChange"
                    :disabled="!isSmsSended"
                    v-model="verifyCode"
                  />
                  <button
                    class="font-bold"
                    :class="{
                      'active:scale-95': !isSendBtnDisabled,
                    }"
                    @click="onSmsSend"
                    :disabled="isSendBtnDisabled"
                  >
                    {{ sendButtonText }}
                  </button>
                </div>
              </div>

              <div
                class="flex justify-between mt-3 text-xs leading-tight"
                v-if="lastBindTimeText"
              >
                <span class="text-[#EF545B]">
                  {{ $t('VUBM.lastSetTime') }}
                </span>
                <span class="font-medium text-right text-[#666]">
                  {{ lastBindTimeText }}
                </span>
              </div>

              <button
                class="vbutton font-rubik w-full h-12 active:scale-95 mt-4"
                @click="onBindMobile"
                :disabled="isBindMobileFormDisabled"
              >
                {{ $t('VUBM.bind') }}
              </button>

              <div class="text-xs text-[#999] mt-3">
                {{ $t('VUBM.ensureAccountSafety') }}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="less" scoped>
.form-item {
  position: relative;

  label {
    display: block;
    margin-bottom: 4px;
    color: #333;
    font-size: 14px;
    line-height: 20px;
  }
  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    padding: 10px 6px 10px 14px;
    border: 1px solid #9567d1;
    border-radius: 6px;
  }
  input {
    display: block;
    flex: 1 1 0%;
  }

  button {
    height: 22px;
    padding: 0 12px;
    color: #ffffff;
    background: linear-gradient(180deg, #ba89e9 0%, #9c68cc 100%);
    border: 2px solid #9852c6;
    border-radius: 15px 15px 15px 15px;

    &:disabled {
      background: #c9c9c9;
      border: 2px solid #c9c9c9;
    }
  }
}
</style>
<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Prop, Watch } from 'vue-property-decorator';
import { tryMergeLocalesForVPrjUserBindMobile } from '@/locales/Page/VPrj/VUBM/init';
import { Toast } from 'vant';
import { formatFullDateTime } from '@/utils/datetime';
import VCaptchaBlock from './VCaptchaBlock.vue';
import {
  mobileBindingUserController,
  sendSmsUserController,
} from '@/vservices/client/UserController';

tryMergeLocalesForVPrjUserBindMobile();

@Component({
  components: {
    VCaptchaBlock,
  },
})
export default class VRightUserBindDlg extends mixins(PopupMixin) {
  $refs: {
    captcha: VCaptchaBlock;
    txtVCode: HTMLInputElement;
  };
  /**
   *   ,
   */
  @Prop({
    type: String,
    required: true,
  })
  from:
    | 'rightExchange'
    | 'rightPassCard'
    | 'withdraw'
    | 'gameTask'
    | 'gameHall';

  /**
   *
   */
  @Prop({
    type: Number,
    required: false,
  })
  lastBindTime?: number;

  /**
   *
   */
  @Prop({
    type: Boolean,
    required: false,
    default: true,
  })
  up_data_mobile?: boolean;

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.isSmsSended = false;
      this.verifyCode = '';
      this.$nextTick(() => {
        this.$refs.captcha?.initCaptcha();
      });

      // this.$trace('address_book_writeauth_exposure', {
      //   open_type: from,
      // });
    }
  }

  get lastBindTimeText() {
    const num = this.lastBindTime;
    if (num) {
      return formatFullDateTime(num);
    }
    return null;
  }

  mobile = '';
  /**
   *
   */
  verifyCode = '';

  /**
   *
   */
  txtCaptcha = '';
  isSending = false;
  sendButtonText = this.$t('VUBM.send');

  get CAPTCHA_LENGTH() {
    return 5;
  }
  get isSendBtnDisabled() {
    if (
      this.isSending ||
      this.up_data_mobile === false ||
      this.mobile.length < 8 ||
      this.txtCaptcha.length != this.CAPTCHA_LENGTH
    ) {
      return true;
    }
    return false;
  }

  //
  sendVerificationCode() {
    this.sendButtonText = '60s';
    let timeLeft = 59;
    const timer = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timer);
        this.isSending = false;
        this.sendButtonText = this.$t('VUBM.send');
      } else {
        this.sendButtonText = `${timeLeft--}s`;
      }
    }, 1000);
  }

  get countryCode() {
    return process.env.VUE_APP_ENV_LOCAL_DEBUG ? 86 : 62;
  }

  isSmsSended = false;
  //
  onSmsSend() {
    const traceParams = {
      phone: this.mobile,
      open_source: this.from,
      last_time: this.lastBindTime,
      exchange_code: this.txtCaptcha,
    };
    //
    this.$trace('click_exchange_bindphone_send', traceParams);

    this.isSending = true;
    sendSmsUserController({
      mobile: this.mobile,
      countryCode: this.countryCode,
      captcha: this.txtCaptcha,
    }).then((res) => {
      this.$trace('exchange_bindphone_send_result', {
        ...traceParams,
        verify_result: res.success ? '1' : '0',
      });
      if (res.success) {
        this.$refs.captcha?.onRefreshCaptcha('refresh');
        this.sendVerificationCode();
        this.isSmsSended = true;
        this.$refs.txtVCode.focus();
      } else {
        this.isSending = false;
        Toast(res.message);
      }
    });
  }

  get isBindMobileFormDisabled() {
    return (
      !this.mobile ||
      !this.verifyCode ||
      this.up_data_mobile === false ||
      !this.isSmsSended
    );
  }

  //
  onBindMobile() {
    if (!ButtonLockController.Instance.tryGetNormalLock()) {
      return;
    }
    const traceParam = {
      phone: this.mobile,
      open_source: this.from,
      last_time: this.lastBindTime,
    };
    //
    this.$trace('click_exchange_bindphone', traceParam);
    mobileBindingUserController({
      mobile: this.mobile,
      countryCode: this.countryCode,
      verifyCode: this.verifyCode,
    }).then((res) => {
      if (res.success) {
        this.emitDlgVisible(false);
        this.$emit('bindOK');
      } else {
        Toast(res.message);
      }
    });
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$trace('close_exchange_bindphone', {
      open_source: this.from,
    });

    this.emitDlgVisible(false);
  }

  mobileChange(e: InputEvent) {
    const length = 15;
    const target = e.target as HTMLInputElement;
    let value = target.value;
    value = value.replace(/[^0-9]/g, '');
    value = value.slice(0, length);
    this.mobile = value;
  }

  verifyCodeChange(e: InputEvent) {
    const length = 6;
    const target = e.target as HTMLInputElement;
    let value = target.value;
    value = value.replace(/[^0-9]/g, '');
    value = value.slice(0, length);
    this.verifyCode = value;
  }
}
</script>
