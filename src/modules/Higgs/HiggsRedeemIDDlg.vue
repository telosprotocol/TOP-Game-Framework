<template>
  <transition name="tz-transwrap">
    <div class="tz-modal tz-transwrap-scale" v-if="value" v-bind="$attrs">
      <div class="tz-modal_mask"></div>
      <!-- Dlg Container: FullScreen -->
      <div
        class="absolute inset-0 flex items-center justify-center tz-transel-scaleInOut"
      >
        <!-- DlgContent Include bg -->
        <div
          class="relative rounded-[20px] w-[312px] bg-gradient-to-b from-[#F7D34A] to-[#FEF9DC] p-1"
        >
          <main
            class="rounded-[20px] bg-gradient-to-b from-[#60286D] to-[#232358] pt-10 pb-8 min-h-full px-5"
          >
            <HiggsHeaderSimpleUI
              :title="$t('V_HG.Redeem')"
              @close="onCloseClicked"
            ></HiggsHeaderSimpleUI>
            <h3 class="leading-4 mb-3 text-sm font-rubik font-extrabold">
              <span
                class="vgradient-text-outline"
                :date-text="$t('V_HG.inputTitle')"
              >
                {{ $t('V_HG.inputTitle') }}
                <button
                  class="text-[#FEEE66] italic"
                  :style="{ textDecoration: 'underline solid #FEEE66' }"
                  @click="onOpenRedeemGuide"
                >
                  {{ $t('V_HG.tipLink') }}
                </button>
              </span>
            </h3>
            <!-- higgsid -->
            <div
              class="p-[3px] rounded-full bg-gradient-to-b from-[#642700] to-[#E9B954] shadow-inner shadow-[#4B1D11] mb-3"
            >
              <div
                class="rounded-full h-9 bg-[#7D4A24] flex items-center px-3"
                :style="{
                  boxShadow: 'inset 0px 10px 4px 0px #4B1D11',
                }"
              >
                <input
                  type="text"
                  :value="txtHiggsID"
                  @input="onHiggsIDChange"
                  @change="onHiggsIDChange"
                  :placeholder="higgsIDConfig.inputTitle"
                  class="flex-1 block rounded-full h-9 bg-transparent vplaceholder text-xs text-white"
                  :style="{
                    '--tz-v-placeholder-color': 'rgba(255,255,255,0.5)',
                  }"
                />
                <button
                  @click="onPasteHiggsId"
                  class="h-5 min-w-[50px] rounded-full font-rubik font-semibold box-content border text-white border-[#C3711E] flex items-center justify-center active:scale-95 mx-auto text-xs px-2"
                  :style="{
                    background:
                      'linear-gradient(180deg, #FC7700 0%, #FB7400 26%, #FB6800 48%, #FB6B00 72%, #FFCCA5 100%)',
                  }"
                >
                  {{ $t('V_HG.paste') }}
                </button>
              </div>
            </div>
            <!-- nickName -->
            <div
              class="p-[3px] rounded-full bg-gradient-to-b from-[#642700] to-[#E9B954] shadow-inner shadow-[#4B1D11] mb-3"
            >
              <input
                type="text"
                :value="txtHiggsNickname"
                @input="onHiggsNameChange"
                @change="onHiggsNameChange"
                class="block rounded-full h-9 bg-[#7D4A24] w-full vplaceholder text-xs px-3 text-white"
                :placeholder="higgsNameConfig.inputTitle"
                :style="{
                  boxShadow: 'inset 0px 10px 4px 0px #4B1D11',
                  '--tz-v-placeholder-color': 'rgba(255,255,255,0.5)',
                }"
              />
            </div>
            <!-- phone -->
            <div
              class="p-[3px] rounded-full bg-gradient-to-b from-[#642700] to-[#E9B954] shadow-inner shadow-[#4B1D11] mb-3"
            >
              <div
                class="rounded-full h-9 bg-[#7D4A24] flex items-center px-3"
                :style="{
                  boxShadow: 'inset 0px 10px 4px 0px #4B1D11',
                }"
              >
                <div class="text-white pr-3 font-semibold">
                  {{ phoneConfig.prefix }}
                </div>
                <input
                  type="text"
                  :value="txtPhone"
                  @input="onPhoneChange"
                  @change="onPhoneChange"
                  class="flex-1 block rounded-full h-9 bg-transparent vplaceholder text-xs text-white"
                  :placeholder="phoneConfig.inputTitle"
                  :style="{
                    '--tz-v-placeholder-color': 'rgba(255,255,255,0.5)',
                  }"
                />
              </div>
            </div>
            <button
              @click="onConfirmClick"
              class="h-8 w-[100px] rounded-full font-rubik font-bold box-content border text-white border-[#C3711E] vshadow-stroke shadow-[#B14A01] flex items-center justify-center text-sm active:scale-95 mx-auto mt-4"
              :class="{
                'opacity-50': !isValid,
              }"
              :style="{
                background:
                  'linear-gradient(180deg, #FC7700 0%, #FB7400 26%, #FB6800 48%, #FB6B00 72%, #FFCCA5 100%)',
              }"
            >
              {{ $t('Base.CONFIRM') }}
            </button>
          </main>
        </div>
      </div>
      <portal to="modal">
        <HiggsRedeemGuideDlg
          v-model="isRedeemGuideShow"
          :from="redeemGuideFrom"
        ></HiggsRedeemGuideDlg>
        <HiggsRedeemNameConfirmDlg
          v-model="isNameConfirmShow"
          @close="onNameConfirmDlgClosed"
        ></HiggsRedeemNameConfirmDlg>
      </portal>
    </div>
  </transition>
</template>

<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Watch } from 'vue-property-decorator';
import VListMixin from '@/mixins/VListMixin';
import HiggsHeaderSimpleUI from './HiggsHeaderSimpleUI.vue';
import { checkAndForceUpdate } from '@/utils/dom/input';
import { trim } from 'lodash-es';
import {
  getHiggsIDFormInfoLS,
  setHiggsIDFormInfoLS,
} from '@/controller/PersistentLocalStorage';
import { getClipboardStr } from '@/js_bridge/js_call_app_base';
import { Toast } from 'vant';
import HiggsRedeemGuideDlg from './HiggsRedeemGuideDlg.vue';
import {
  getHiggsGuideShowLS,
  setHiggsGuideShowLS,
} from '../../controller/PersistentLocalStorage';
import HiggsRedeemNameConfirmDlg from './HiggsRedeemNameConfirmDlg.vue';

@Component({
  components: {
    HiggsHeaderSimpleUI,
    HiggsRedeemGuideDlg,
    HiggsRedeemNameConfirmDlg,
  },
})
export default class HiggsRedeemIDDlg extends mixins(
  PopupMixin,
  VListMixin<API.PointsRedemptionLogVO>
) {
  //#region Dlg Basic Setting
  dlgSound = true;

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      const info = getHiggsIDFormInfoLS();
      if (info) {
        this.txtPhone = info.rawMobile;
        this.txtHiggsID = info.targetId;
        this.txtHiggsNickname = info.nickname;
      }
      const higgsGuideShow = getHiggsGuideShowLS();

      if (!higgsGuideShow || !higgsGuideShow.lastShow) {
        this.isRedeemGuideShow = true;
        this.redeemGuideFrom = 'first_new';
        setHiggsGuideShowLS({
          lastShow: new Date().getTime(),
        });
      }
      // this.isNameConfirmShowed = false;
      this.$tracev('higgs_coin_reedem_content_exposure', this.traceParam);
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$tracev('close_higgs_coin_reedem_content', this.traceParam);
    this.emitDlgVisible(false);
  }
  //#endregion

  get traceParam() {
    return {
      reedem_phone: this.txtPhone,
      reedem_content: this.txtHiggsID,
      higgs_name: this.txtHiggsNickname,
    };
  }

  txtPhone = '';
  txtHiggsID = '';
  txtHiggsNickname = '';

  get phoneConfig() {
    return {
      type: 'number',
      inputTitle: this.$t('V_HG.inputPhone'),
      prefix: '+62',
      countryCode: 62,
      minLength: 5,
      maxLength: 12,
    };
  }
  get higgsIDConfig() {
    return {
      type: 'number',
      inputTitle: this.$t('V_HG.inputHGUid'),
      prefix: '',
      minLength: 1,
      maxLength: 64,
    };
  }
  get higgsNameConfig() {
    return {
      type: 'string',
      inputTitle: this.$t('V_HG.inputHGName'),
      prefix: '',
      minLength: 0,
      maxLength: 64,
    };
  }
  onPhoneChange(e: Event) {
    this.onNumChange(e, 'txtPhone', this.phoneConfig);
  }
  onHiggsIDChange(e: Event) {
    this.onNumChange(e, 'txtHiggsID', this.higgsIDConfig);
  }
  onHiggsNameChange(e: Event) {
    this.onNumChange(e, 'txtHiggsNickname', this.higgsNameConfig);
  }

  onNumChange(
    e: Event,
    fieldName: 'txtHiggsID' | 'txtPhone' | 'txtHiggsNickname',
    config: typeof HiggsRedeemIDDlg.prototype.higgsIDConfig
  ) {
    const inputValue = (e.target as HTMLInputElement).value || '';
    this.normalizeInput(inputValue, fieldName, config);
  }

  normalizeInput(
    inputValue: string,
    fieldName: 'txtHiggsID' | 'txtPhone' | 'txtHiggsNickname',
    config: typeof HiggsRedeemIDDlg.prototype.higgsIDConfig
  ) {
    const preValue = this[fieldName];
    let newValue = inputValue;
    if (config.type === 'number') {
      newValue = trim(inputValue).replace(/[^0-9]/gi, '');
    }
    if (newValue.length > config.maxLength) {
      newValue = newValue.substring(0, config.maxLength);
    }
    this[fieldName] = newValue;
    checkAndForceUpdate(this, {
      preValue,
      newValue,
      inputValue,
    });
  }
  get formInfo() {
    return {
      targetId: this.txtHiggsID,
      mobile: this.phoneConfig.prefix + this.txtPhone,
      rawMobile: this.txtPhone,
      nickname: this.txtHiggsNickname,
    };
  }

  get isValid() {
    function checkValueValid(
      txt: string,
      config: { minLength: number; maxLength: number }
    ) {
      return txt.length >= config.minLength && txt.length <= config.maxLength;
    }
    return (
      checkValueValid(this.txtHiggsID, this.higgsIDConfig) &&
      checkValueValid(this.txtPhone, this.phoneConfig)
    );
  }

  onConfirmClick() {
    const formInfo = this.formInfo;
    if (!this.isValid) {
      return;
    }
    if (!ButtonLockController.Instance.tryGetLock('confirmRedeem')) {
      return;
    }
    this.$tracev('click_higgs_coin_reedem_content', this.traceParam);
    setHiggsIDFormInfoLS(formInfo);
    if (!formInfo.nickname) {
      // && !this.isNameConfirmShowed
      this.isNameConfirmShow = true;
      // this.isNameConfirmShowed = true;
    } else {
      this.$emit('confirm', {
        targetId: formInfo.targetId,
        mobile: formInfo.mobile,
        nickname: formInfo.nickname,
      });
    }
  }
  /**
   * nickNameConfirm Dlg
   */
  isNameConfirmShow = false;
  // /**
  //  * is nick name confirm dlg showed this time
  //  */
  // isNameConfirmShowed: boolean;

  onNameConfirmDlgClosed(info: { isContinue: boolean }) {
    if (!info.isContinue) {
      const formInfo = this.formInfo;
      this.$emit('confirm', {
        targetId: formInfo.targetId,
        mobile: formInfo.mobile,
        nickname: formInfo.nickname,
      });
      this.$tracev('click_higgs_coin_reedem_guide_write');
    } else {
      this.$tracev('return_higgs_coin_reedem_guide_write');
    }
  }

  isRedeemGuideShow = false;
  redeemGuideFrom: 'exchange' | 'first_new' = 'exchange';
  onOpenRedeemGuide() {
    this.$tracev('click_higgs_coin_reedem_help', this.traceParam);
    this.isRedeemGuideShow = true;
    this.redeemGuideFrom = 'exchange';
  }

  async onPasteHiggsId() {
    const res = await getClipboardStr();
    this.$tracev('click_higgs_coin_reedem_paste', {
      higgs_name: res.data || '',
    });
    if (res.Result === 1) {
      this.normalizeInput(res.data || '', 'txtHiggsID', this.higgsIDConfig);
    } else {
      Toast(res.Reason || this.$t('Base.NoData'));
    }
  }
}
</script>
