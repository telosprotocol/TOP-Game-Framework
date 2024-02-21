<template>
  <div>
    <transition name="tz-transwrap">
      <div
        class="tz-modal tz-transwrap-scale"
        ref="dlgWrap"
        v-if="value"
        v-bind="$attrs"
      >
        <div class="tz-modal_mask"></div>
        <!-- Dlg Container: FullScreen -->
        <div
          class="absolute inset-0 flex items-center justify-center tz-transel-scaleInOut"
        >
          <!-- DlgContent Include bg -->

          <div
            class="relative w-80 p-2 pt-2 pb-6 bg-gradient-to-b from-[#AA76F1] to-[#8153DD] text-[#333333] rounded-xl"
          >
            <h3
              class="font-rubik pr-2 flex items-center font-bold text-base mb-2 text-white overflow-hidden"
            >
              <div class="whitespace-nowrap">{{ $t('VBG.usingNow') }}</div>
              <div class="tz-ellipsis-break-1">
                {{ info.nameText }}
              </div>
              <div>*{{ useNum }}</div>
            </h3>
            <main
              class="rounded-xl bg-[#FFFFFF] px-3 py-3 text-[14px] text-[#A874F0]"
            >
              <div class="text-[#333] text-sm">
                <div class="font-semibold mb-2">
                  {{ $t('VBG.enterRechargePhoneNumber') }}
                </div>
                <div class="mx-1 mb-7 flex relative font-semibold">
                  <input
                    type="text"
                    :value="txtAccount"
                    @input="onAccountChange"
                    @change="onAccountChange"
                    class="flex-1 border border-solid border-[#9567D1] rounded-md bg-white h-10 flex items-center justify-center pr-3 text-[#333] robot-medium leading-none"
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
              </div>

              <div class="flex items-center justify-between">
                <button
                  @click="onToConfirmClick"
                  class="vbutton font-rubik w-full h-12 active:scale-95 mb-3"
                  :class="{ 'active:scale-95': isConfirmValid }"
                  :disabled="!isConfirmValid"
                >
                  {{ $t('Base.CONFIRM') }}
                </button>
              </div>
              <div class="text-[#333] text-sm">
                <p v-for="i in 3" :key="i">
                  {{ $t('VBG.useTip' + i) }}
                </p>
              </div>
              <button
                @click="onCloseClicked"
                class="absolute right-1 -top-2 -translate-y-full w-[30px] h-[30px] bg-contain bg-center bg-no-repeat active:scale-95"
                v-webp="
                  require('@/assets/vcommon/close/btnSimpleClose.png?webp')
                "
              ></button>
            </main>
          </div>
        </div>
      </div>
    </transition>
    <portal to="modal">
      <VPropPhoneTicketConfirmDlg
        v-model="isConfirmShow"
        @cancel="onCancelCb"
        @ok="onConfirmCb"
      ></VPropPhoneTicketConfirmDlg>
      <VGettedRewardsDlg
        v-model="isGettedRewardDlgShow"
        :rewards="gettedRewards"
      ></VGettedRewardsDlg>
    </portal>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Toast } from 'vant';
import { Watch, Prop } from 'vue-property-decorator';

import VPropPhoneTicketConfirmDlg from './VPropPhoneTicketConfirmDlg.vue';
import { checkAndForceUpdate } from '@/utils/dom/input';
import { trim } from 'lodash-es';
import { updateRewardsByPropTypes } from '@/modules/VAssetInfo/VAsset.utils';
import type { IVGettedRewardDlgInfo } from '@/modules/VRewardProps/VGettedRewardsDlg.vue';
import VGettedRewardsDlg from '@/modules/VRewardProps/VGettedRewardsDlg.vue';
import { getRewardDlgInfoByPropReward } from './controller/prop.utils';
import type { IUserPropRewardItemBase } from './controller/prop.model';
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
import { propUseUserPropController } from '@/vservices/client/UserPropController';
@Component({
  components: { VPropPhoneTicketConfirmDlg, VGettedRewardsDlg },
})
export default class VPropPhoneTicketUseDlg extends mixins(BaseDlgMixin) {
  @Prop({
    type: Object,
  })
  info?: IUserPropRewardItemBase; //IUserPropItem;

  @Prop({
    type: Number,
    required: false,
  })
  useNum: number;

  get sInfo() {
    return this.info || ({} as Partial<IUserPropRewardItemBase>);
  }
  //#region Dlg Basic Setting
  dlgSound = true;

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$tracev('prop_call_voucher_exposure', this.commonTrace);
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$tracev('close_prop_call_voucher', this.commonTrace);

    this.emitDlgVisible(false);
  }
  //#endregion

  //#region
  get accountConfig() {
    return {
      inputTitle: this.$t('VBG.enterPhoneNumber'),
      prefix: '+62',
      countryCode: 62,
      minLength: 5,
      maxLength: 12,
    };
  }
  txtAccount = '';
  get isConfirmValid() {
    const txtAccountLength = this.txtAccount.length;
    return (
      txtAccountLength >= this.accountConfig.minLength &&
      txtAccountLength <= this.maxLength
    );
  }

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
  //#endregion
  onCancelCb() {
    const target = this.accountConfig.prefix + this.txtAccount;
    this.$tracev('click_prop_call_voucher_disagree_exchange', {
      ...this.commonTrace,
      phone_number: target,
    });
  }
  onToConfirmClick() {
    if (!this.isConfirmValid) {
      return;
    }
    this.isConfirmShow = true;
    const target = this.accountConfig.prefix + this.txtAccount;
    this.$tracev('click_prop_call_voucher_exchange', {
      ...this.commonTrace,
      phone_number: target,
    });
    // this.emitDlgVisible(false);
  }

  get commonTrace() {
    const info = this.info;
    if (!info) {
      return {};
    }
    return {
      prop_id: info.propId,
      prop_name: info.nameText,
      prop_number: this.useNum + '',
    };
  }
  async onConfirmCb() {
    const sInfo = this.sInfo;

    const target = this.accountConfig.prefix + this.txtAccount;
    this.$tracev('click_prop_call_voucher_agree_exchange', {
      ...this.commonTrace,
      phone_number: target,
    });
    const res = await propUseUserPropController({
      id: sInfo.propBagId,
      useNum: this.useNum,
      target: target,
    });
    if (res.success) {
      this.emitDlgVisible(false);
      updateRewardsByPropTypes(sInfo.type);
      this.gettedRewards = [
        getRewardDlgInfoByPropReward(
          sInfo as IUserPropRewardItemBase,
          this.useNum
        ),
      ];
      this.isGettedRewardDlgShow = true;
      this.$emit('used');
    } else {
      Toast(res.message);
    }
  }
  isGettedRewardDlgShow = false;
  gettedRewards: IVGettedRewardDlgInfo[] = [];

  isConfirmShow = false;
  closeAll() {
    this.isConfirmShow = false;
    this.isGettedRewardDlgShow = false;
  }
}
</script>
