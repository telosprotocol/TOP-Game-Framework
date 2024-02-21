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
          class="relative w-80 p-2 pt-2 pb-6 bg-gradient-to-b from-[#AA76F1] to-[#8153DD] text-[#333333] rounded-xl"
        >
          <button
            class="absolute right-1 -top-2 -translate-y-full w-[30px] h-[30px] bg-contain bg-center bg-no-repeat active:scale-95"
            @click="onCloseClicked"
            v-webp="require('@/assets/vcommon/close/btnPurpleClose.png?webp')"
          ></button>
          <h3
            class="robot-medium text-center text-base mb-2 text-white flex items-center"
          >
            {{ $t('VPIN.bindDlgTitle') }}
          </h3>
          <main class="rounded-xl bg-[#FFFFFF] p-3 pt-7 text-[14px]">
            <div class="mx-1 mb-7 flex relative font-semibold">
              <input
                type="text"
                :value="txtInput"
                @input="onInputChange"
                @change="onInputChange"
                class="flex-1 border border-solid border-[#F3EAFF] bg-[#F6F1FD] h-12 flex items-center justify-center px-3 text-[#333] robot-medium leading-none vplaceholder rounded-[10px]"
                :placeholder="$t('VPIN.careCaseSensetive')"
                :style="
                  $ss.getters.designPxsObjToReal({
                    '--tz-v-placeholder-color': '#D4B6FF',
                    '--tz-v-placeholder-size': 14,
                    '--tz-v-placeholder-weight': '400',
                  })
                "
                :maxlength="maxLength"
              />
            </div>
            <button
              class="bg-gradient-to-r from-[#C886FF] to-[#F768FF] rounded-[10px] text-white font-rubik font-bold text-[18px] w-full h-12 mb-3"
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
import { Watch } from 'vue-property-decorator';
import { trim } from 'lodash-es';
import { checkAndForceUpdate } from '@/utils/dom/input';
import { Toast } from 'vant';
import { createInviteRelationshipUserInviteController } from '@/vservices/client/UserInviteController';

@Component({
  components: {},
})
export default class VPromoteIncomeInviteCodeDlg extends mixins(PopupMixin) {
  //#region Dlg Basic Setting

  // remove if not used
  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.txtInput = '';

      // this.$trace('address_book_writeauth_exposure', {
      //   open_type: from,
      // });
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }

    this.emitDlgVisible(false);
  }
  //#endregion

  txtInput = '';

  get maxLength() {
    return 8;
  }
  onInputChange(e: Event) {
    const inputValue = (e.target as HTMLInputElement).value || '';
    const preValue = this.txtInput;
    let newValue = trim(inputValue);
    if (newValue.length > this.maxLength) {
      newValue = newValue.substring(0, this.maxLength);
    }
    this.txtInput = newValue;
    checkAndForceUpdate(this, {
      preValue,
      newValue,
      inputValue,
    });
  }

  get isConfirmValid() {
    const txtAccountLength = this.txtInput.length;
    return txtAccountLength > 0 && txtAccountLength <= this.maxLength;
  }
  async onOkClicked() {
    if (!this.isConfirmValid) {
      return;
    }
    if (!ButtonLockController.Instance.tryGetLock('bindCode', 0.5)) {
      return;
    }
    this.$trace('click_promotion_invite_handin');
    const res = await createInviteRelationshipUserInviteController({
      type: 1,
      inviteKey: this.txtInput,
    });
    if (res.success) {
      //
      this.emitDlgVisible(false);
      Toast(this.$t('VPIN.bindOK'));
      this.$emit('bindOK');
    } else {
      //
      Toast(res.message);
    }
  }
}
</script>
