<template>
  <GameDlgUI
    :value="value"
    @input="emitDlgVisible"
    :img-title="
      $ss.getters.translateImage({
        en: require('@/assets/gameProfile/Set-phone-number.png'),
        id: require('@/assets/gameProfile/Atur-nomor-telepon.png'),
      })
    "
  >
    <main class="px-3 pt-4 pb-2">
      <h4 class="robot-medium mb-2 mx-2 text-lg">
        {{ accountConfig.inputTitle }}
      </h4>
      <div class="mb-7 flex relative">
        <input
          type="text"
          :value="txtAccount"
          @input="onAccountChange"
          @change="onAccountChange"
          class="flex-1 border border-solid bg-[#A58464] border-[#D2AE82] rounded-full h-8 w-full flex items-center justify-center px-2 text-[#FFE1B6] text-lg leading-none vplaceholder"
          :class="{
            'pl-12': !!accountConfig.prefix,
            'pl-3': !accountConfig.prefix,
          }"
          :style="{
            '--tz-v-placeholder-color': '#D4A67A',
            '--tz-v-placeholder-weight': '400',
            boxShadow: '0px 0px 2px 0px rgba(0,0,0,0.3) inset',
          }"
          :placeholder="accountConfig.inputTitle"
          :maxlength="maxLength"
        />
        <div
          class="absolute left-2 h-full flex items-center text-[#67E4D6] text-lg"
          v-if="accountConfig.prefix"
        >
          {{ accountConfig.prefix }}
        </div>
      </div>
      <button
        class="vbtn vbtn--primary w-full"
        :class="{ 'active:scale-95': isConfirmValid }"
        :disabled="!isConfirmValid"
        @click="onOkClicked"
      >
        {{ $t('Base.CONFIRM') }}
      </button>
    </main>
  </GameDlgUI>
</template>

<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Prop, Watch } from 'vue-property-decorator';
import { trim } from 'lodash-es';
import { checkAndForceUpdate } from '@/utils/dom/input';
import { tryMergeLocalesForVPrjBindMobile } from '@/locales/Page/VPrj/V_BM/init';
import { mobileBindingV2UserController } from '@/vservices/client/UserController';
import GameDlgUI from '@/modules/UI/GameDlgUI.vue';
import createGameToast from '@/modules/UI/createGameToast';

tryMergeLocalesForVPrjBindMobile();
@Component({
  components: { GameDlgUI },
})
export default class VBindMobileDlg extends mixins(PopupMixin) {
  @Prop({
    type: String,
    required: false,
  })
  phone: string;
  //#region Dlg Basic Setting
  dlgSound = true;

  // remove if not used
  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.txtAccount = this.phone || '';
    }
  }
  //#endregion

  // get title() {
  //   if (this.phone) {
  //     return this.$t('V_BM.modifyTitle');
  //   }
  //   return this.$t('V_BM.setTitle');
  // }

  get accountConfig() {
    return {
      inputTitle: this.$t('V_BM.enterPhoneNumber'),
      prefix: '+62',
      countryCode: 62,
      minLength: 5,
      maxLength: 12,
    };
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
    this.$tracev('click_headsculpture_modifynumber_edit', {
      oldnumber: this.phone || '',
      newnumber: this.txtAccount,
    });

    const formData = {
      countryCode: this.accountConfig.countryCode,
      mobile: this.txtAccount,
    };
    const res = await mobileBindingV2UserController(formData);
    if (res.success) {
      this.$emit('bindOK', formData);
      this.emitDlgVisible(false);
      createGameToast(this.$t('V_BM.changePhoneNumOK'));
    } else {
      createGameToast(res.message);
    }
  }
}
</script>
