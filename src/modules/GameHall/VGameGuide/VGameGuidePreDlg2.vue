<template>
  <transition name="tz-transwrap">
    <div class="tz-modal tz-transwrap-scale" v-show="value" v-bind="$attrs">
      <div class="tz-modal_mask"></div>
      <!-- Dlg Container: FullScreen -->
      <div
        class="absolute inset-0 flex flex-col items-center justify-center tz-transel-scaleInOut"
      >
        <div class="absolute inset-0"></div>
        <div class="relative">
          <div
            class="w-full bg-top bg-no-repeat bg-contain"
            :style="
              $ss.getters.normalizeCss(
                {
                  width: 350,
                  height: 689 / 2,
                  marginTop: -30,
                },
                $ss.getters.translateImage({
                  en: require('@/assets/gameHall/gameGuide/noviceGuide-en.png?webp'),
                  id: require('@/assets/gameHall/gameGuide/noviceGuide-id.png?webp'),
                }),
                true
              )
            "
          ></div>
          <div
            class="text-[18px] font-robot-bold text-center -mt-4 mb-1.5 font-bold text-[#FFFD1B]"
          >
            {{ $t('VG.hoursAnyTime') }}
          </div>
          <button
            class="vbtn-topup mx-auto flex items-center justify-center mb-2"
            :style="
              $ss.getters.normalizeCss(
                { width: 220, height: 63, fontSize: 19, paddingBottom: 8 },
                require('@/assets/gameHall/gameGuide/btn2.png?webp'),
                true
              )
            "
            @click="onClaimClick"
          >
            <div>
              {{ $t('VG.revCashx', ['700']) }}
            </div>
          </button>
          <i18n
            tag="div"
            path="VG.coinRpEq"
            class="text-center flex items-center justify-center text-2xl leading-tight font-robot-bold font-bold text-white mb-2"
          >
            <div
              class="shrink-0 w-[30px] h-[30px] box-content bg-contain bg-center bg-no-repeat"
              v-webp="require('@/assets/vcommon/CoinGold.png?webp')"
            ></div
          ></i18n>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Watch } from 'vue-property-decorator';
import VHandGuide from '@/components/VHandGuide.vue';
import GameDlgUI from '@/modules/UI/GameDlgUI.vue';
import stateItemVNoviceGuideTask, {
  VNoviceGuideTaskMixin,
} from './NoviceGuideTask.state';
import PopupMixin from '@/components/Modal/PopupMixin';
import { waitUserIsLoginedAuth } from '@/store/modules/user.utils';
import { navigation_login_bridge } from '@/js_bridge/js_call_app_base';
import { vGameClaimNoviceTaskController } from '@/vservices/client/TaskController';
import { updateVAssetInfo } from '@/modules/VAssetInfo/VAsset.utils';
import { emitGBus } from '@/utils/GBus';
import { Toast } from 'vant';
import type { IUserPropRewardItemBase } from '@/modules/VRewardProps/controller/prop.model';

@Component({
  components: { VHandGuide, GameDlgUI },
})
export default class VGameGuidePreDlg2 extends mixins(
  PopupMixin,
  VNoviceGuideTaskMixin
) {
  cantReturn = true;
  //#region Dlg Basic Setting

  // remove if not used
  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.$tracev('vgame_gamenovice_guidance_welcome_exposure');
    }
  }

  get isLogined() {
    return this.$ss.getters['user/isRealLogined'];
  }

  async onClaimClick() {
    if (!ButtonLockController.Instance.tryGetLock('claimguide', 1)) {
      return;
    }
    this.$tracev('vgame_click_gamenovice_guidance_welcome');

    const isLogined = await waitUserIsLoginedAuth();
    if (!isLogined) {
      navigation_login_bridge('gamehall_guideclaim');
      //     
      this.$emit('notLoginClose');
      this.isOpenNext = false;
      this.emitDlgVisible(false);
      return;
    }
    this.claimTaskReward();
  }

  get taskId() {
    return this.VNoviceGuideTaskInfo?.list?.[0]?.taskId;
  }
  async claimTaskReward() {
    if (!this.taskId) {
      await this.refreshVNoviceGuideTask();
    }
    const taskId = this.taskId;
    const propRewards = this.VNoviceGuideTaskInfo?.list?.[0]?.propRewards;
    if (!taskId || !propRewards) {
      this.$trace('gameguide_claim_end', {
        step_status: 'notaskget',
        task_id: taskId,
      });
      this.isOpenNext = false;
      this.emitDlgVisible(false); //  
      return false;
    }
    const res = await vGameClaimNoviceTaskController({ taskId });
    this.$trace('gameguide_claim_end', {
      step_status: res.success ? 'success' : res.code,
      result_msg: res.message,
    });
    updateVAssetInfo(0);
    stateItemVNoviceGuideTask.clearResult();
    if (res.success) {
      emitGBus('openGameHallGetPropDlg', {
        propList: propRewards as IUserPropRewardItemBase[],
        onPropClosed: () => {
          this.onGuidePreClose();
        },
      });
      return true;
    } else {
      Toast(res.message);
      this.onGuidePreClose();
      return false;
    }
  }

  isOpenNext?: boolean;
  /**
   * Step2
   */
  async onGuidePreClose() {
    this.isOpenNext = true;
    //  
    this.emitDlgVisible(false);
    this.$emit('goNext');
  }
  //#endregion
}
</script>
