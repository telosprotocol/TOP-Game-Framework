<template>
  <transition name="tz-transwrap">
    <div class="tz-modal tz-transwrap-scale" v-show="value" v-bind="$attrs">
      <div class="tz-modal_mask"></div>
      <div
        class="absolute inset-0 flex items-center justify-center tz-transel-scaleInOut"
      >
        <div
          class="relative text-[#A14F08] bg-contain bg-center bg-no-repeat"
          :style="bgDlgStyle"
        >
          <div
            class="text-center flex justify-center text-[21px] leading-none font-rubik font-black z-0 relative mb-5"
          >
            <span
              class="vgradient-text-outline relative"
              :data-text="$t('VG.fz_title')"
            >
              {{ $t('VG.fz_title') }}
            </span>
          </div>
          <div
            :style="iconStyle"
            class="bg-center bg-contain bg-no-repeat mx-auto mb-1"
          ></div>
          <div
            class="font-rubik font-black text-[15px] leading-5 text-center text-[#9D3817] mb-2.5"
          >
            {{ $t('VG.fz_desc') }}
          </div>
          <i18n
            path="VG.fz_timedesc"
            tag="div"
            class="bg-[#F4CD9A] h-[26px] rounded-[4px] mx-2 flex items-center justify-center robot-medium text-[13px] mb-3"
          >
            <span class="ml-1"> {{ txtFrozenTime }}</span>
          </i18n>
          <i18n
            path="VG.fz_contactdesc"
            tag="div"
            class="mx-2 text-center text-xs"
          >
            <span @click="openSystemEmail(email)">{{ email }}</span>
          </i18n>
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
import { convertBgImageStyle } from '@/utils/styles';
import { openSystemEmailBridge } from '@/js_bridge/js_call_app_base';
import { Prop, Watch } from 'vue-property-decorator';
import { convertMsSecond2TimeInfo, TimeUnit } from '@/utils/datetime';
import { pasteStr } from '@/js_bridge/js_call_app_base';
import { Toast } from 'vant';
@Component({
  components: {},
})
export default class VFrozenDlg extends mixins(PopupMixin) {
  @Prop({
    type: Object,
    required: false,
  })
  info: { freezeDuration: number; customerEmail: string } | null;
  //#region Dlg Basic Setting
  dlgSound = true;

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      const info = this.info;
      this.$tracev('gamehall_waring_exposure', {
        freezing_time: info?.freezeDuration + '',
        freeze_email: info?.customerEmail,
      });
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }

    this.emitDlgVisible(false);
  }
  //#endregion

  //#region UI

  get bgDlgStyle() {
    return convertBgImageStyle(
      require('@/assets/gameHall/frozenDlg/bgDlg.png?webp'),
      true,
      this.$ss.getters.designPxsObjToReal({
        width: 338,
        height: 288,
        paddingTop: 45, //90,
        paddingLeft: 52,
        paddingRight: 52,
      })
    );
  }

  get iconStyle() {
    return convertBgImageStyle(
      require('@/assets/gameHall/frozenDlg/warning.png?webp'),
      true,
      this.$ss.getters.designPxsObjToReal({
        width: 72,
        height: 65,
      })
    );
  }

  //#endregion

  get email() {
    return this.info?.customerEmail || '';
  }

  get txtFrozenTime() {
    const time = this.info?.freezeDuration;
    if (time == null) {
      return ' ';
    }
    if (time === -1) {
      return this.$t('VG.fz_permanent');
    } else {
      const info = convertMsSecond2TimeInfo(time, { maxUnit: TimeUnit.hour });
      return `${info.hour}:${info.minute}:${info.second}`;
    }
  }
  openSystemEmail(email: string) {
    if (!ButtonLockController.Instance.tryGetLock('email', 1)) {
      return;
    }
    if (!email) {
      return;
    }
    const info = this.info;
    this.$tracev('click_gamehall_waring_email', {
      freezing_time: info?.freezeDuration + '',
      freeze_email: info?.customerEmail,
    });
    pasteStr({ content: email });
    Toast(this.$t('Base.CopySucceeded'));
    openSystemEmailBridge(email);
  }
}
</script>
