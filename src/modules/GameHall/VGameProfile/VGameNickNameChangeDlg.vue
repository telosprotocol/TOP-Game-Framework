<template>
  <GameDlgUI
    :value="value"
    @input="emitDlgVisible"
    :img-title="
      $ss.getters.translateImage({
        en: require('@/assets/gameProfile/Edit-Nickname.png'),
        id: require('@/assets/gameProfile/Ubah-Nama.png'),
      })
    "
  >
    <main class="px-3 pt-7">
      <div class="mx-1 mb-1.5 flex">
        <input
          type="text"
          ref="input"
          :value="nickName"
          @input="onInputChange"
          @change="onInputChange"
          class="flex-1 border border-solid bg-[#A58464] border-[#D2AE82] rounded-full h-8 w-full flex items-center justify-center px-2 text-[#FFE1B6] text-lg leading-none vplaceholder"
          :placeholder="$t('VG.changeNameInputTip')"
          :style="
            $ss.getters.normalizeCss({
              '--tz-v-placeholder-color': '#D4A67A',
              '--tz-v-placeholder-weight': '400',
              boxShadow: '0px 0px 2px 0px rgba(0,0,0,0.3) inset',
            })
          "
          :maxlength="maxLength"
        />
      </div>
      <div class="text-[#EB7D4C] mb-6 px-1">
        {{ $t('VG.nameCanOnlyEditOnce') }}
      </div>
      <button
        class="vbtn vbtn--primary block w-full mb-2"
        :class="{ 'active:scale-95': isFormValid }"
        :disabled="!isFormValid || !isEditable"
        @click="onEditClick"
      >
        {{ $t('Base.CONFIRM') }}
      </button>
    </main>
    <portal to="modal">
      <VGameNickNameConfirm
        v-model="isConfirmShow"
        @confirm="onConfirmClick"
      ></VGameNickNameConfirm>
    </portal>
  </GameDlgUI>
</template>

<script lang="ts">
import PopupMixin from '@/components/Modal/PopupMixin';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Prop, Watch } from 'vue-property-decorator';
import { checkAndForceUpdate } from '@/utils/dom/input';
import { editUserNickName, getUserNicknameIsEditable } from './NickName.api';
import VGameNickNameConfirm from './VGameNickNameConfirmDlg.vue';
import GameDlgUI from '@/modules/UI/GameDlgUI.vue';
import createGameToast from '@/modules/UI/createGameToast';
@Component({
  components: { VGameNickNameConfirm, GameDlgUI },
})
export default class VGameNickNameChangeDlg extends mixins(PopupMixin) {
  $refs: { input: HTMLInputElement; dlgWrap: HTMLDivElement };
  //#region Dlg Basic Setting

  dlgSound = true;

  @Prop({
    type: String,
    required: false,
  })
  initalValue: string;
  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$nextTick(() => {
        this.$refs.input?.focus();
      });
      this.isEditable = false;
      this.nickName = this.initalValue;
      getUserNicknameIsEditable().then((res) => {
        this.isEditable = res.data;
      });
    }
  }

  isEditable = false;
  //#endregion

  get maxLength() {
    return 32;
  }
  nickName = '';

  get isFormValid() {
    return this.nickName.length > 0 && this.nickName.length <= this.maxLength;
  }

  onEditClick() {
    if (!ButtonLockController.Instance.tryGetLock('edit', 1)) {
      return;
    }
    this.isConfirmShow = true;
  }

  isConfirmShow = false;

  async onConfirmClick() {
    if (!ButtonLockController.Instance.tryGetLock('confirm-edit', 1)) {
      return;
    }
    const res = await editUserNickName(this.nickName);
    if (res.Result === 1) {
      createGameToast(this.$t('VG.changeNameOK'));
      this.emitDlgVisible(false);
      this.$emit('success', this.nickName);
    } else {
      createGameToast(res.Reason);
    }
  }

  onInputChange(e: Event) {
    const inputValue = (e.target as HTMLInputElement).value || '';
    const preValue = this.nickName;
    let newValue = inputValue.replace(/[^a-zA-Z0-9]/gi, '');
    if (newValue.length > this.maxLength) {
      newValue = newValue.substring(0, this.maxLength);
    }
    this.nickName = newValue;
    checkAndForceUpdate(this, {
      preValue,
      newValue,
      inputValue,
    });
  }
}
</script>
