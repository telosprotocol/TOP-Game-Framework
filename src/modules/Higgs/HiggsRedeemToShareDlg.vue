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
            class="rounded-[20px] bg-gradient-to-b from-[#60286D] to-[#232358] pt-10 pb-8 min-h-full px-6 flex items-center justify-center flex-col"
          >
            <HiggsHeaderSimpleUI
              :title="$t('V_HG.lastStep')"
              @close="onCloseClicked"
            ></HiggsHeaderSimpleUI>
            <h3
              class="text-sm font-rubik font-extrabold vgradient-text-outline leading-4 mb-3 mx-6 text-center"
              :date-text="$t('V_HG.shareTip')"
            >
              {{ $t('V_HG.shareTip') }}
            </h3>
            <button
              @click="onBtnShareClick"
              class="h-8 w-[100px] rounded-full font-rubik font-bold box-content border text-white border-[#C3711E] vshadow-stroke shadow-[#B14A01] flex items-center justify-center active:scale-95 mx-auto mt-4 text-sm"
              :style="{
                background:
                  'linear-gradient(180deg, #FC7700 0%, #FB7400 26%, #FB6800 48%, #FB6B00 72%, #FFCCA5 100%)',
              }"
            >
              {{ $t('V_HG.share') }}
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
import { Prop, Watch } from 'vue-property-decorator';

import HiggsHeaderSimpleUI from './HiggsHeaderSimpleUI.vue';
import { Toast } from 'vant';
import { VInviteMixin } from '@/modules/VInvite/VInviteMixin';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import { NODEJS_SHARE_NUMBER_VGAME } from '@/constants/invite';
import { reportVTask } from '@/modules/VTask/VTask.api';
import type { IShareInfo } from '@/controller/ReferUtils';

@Component({
  components: { HiggsHeaderSimpleUI },
})
export default class HiggsRedeemToShareDlg extends mixins(
  PopupMixin,
  VInviteMixin,
  BindEventMixinDefault
) {
  useInited() {
    return this.initInviteByTp([NODEJS_SHARE_NUMBER_VGAME], this.getShareInfo);
  }

  @Prop({
    type: String,
  })
  taskId: string;
  //#region Dlg Basic
  dlgSound = true;
  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$tracev('higgs_coin_reedem_invite_exposure');
    } else {
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$tracev('close_higgs_coin_reedem_invite');
    this.emitDlgVisible(false);
  }
  //#endregion

  async getShareInfo() {
    return {
      shareImage:
        'https://sparta-vgame.sgp1.cdn.digitaloceanspaces.com/higgs-share.png',
      shareContent: this.$t('V.gameShareContent'),
    } as IShareInfo;
  }

  async onBtnShareClick() {
    if (!ButtonLockController.Instance.tryGetLock('higgs-share', 1)) {
      return;
    }
    this.$tracev('click_higgs_coin_reedem_invite');
    const shareRes = await this.onQuickShareClick(
      {
        shareNumber: NODEJS_SHARE_NUMBER_VGAME,
        subTitle: this.$t('V_HG.shareContent') as string,
        traceParams: {
          share_type: 'higgs_share',
          share_initialfrom: 'game',
          pkg_name: 'vGame',
        },
      },
      this.getShareInfo
    );

    if (shareRes.Result === 1) {
      const res = await reportVTask(this.taskId);
      if (res.success) {
        this.$emit('ok');
        this.emitDlgVisible(false);
      } else {
        Toast(res.message);
        this.emitDlgVisible(false);
      }
    }
  }
}
</script>
