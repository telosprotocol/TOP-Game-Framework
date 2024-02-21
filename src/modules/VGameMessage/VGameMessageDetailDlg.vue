<template>
  <transition name="tz-transwrap">
    <div
      class="tz-modal tz-transwrap-scale flex items-center justify-center"
      v-if="value"
      v-bind="$attrs"
    >
      <div class="tz-modal_mask"></div>
      <!-- Dlg Container: FullScreen -->
      <div class="relative max-h-screen tz-transel-scaleInOut">
        <button
          @click="onCloseClicked"
          :style="
            $ss.getters.normalizeCss(
              {
                top: 20,
                right: 10,
              },
              require('@/assets/gameMsg/bgMailClose.png?webp'),
              true
            )
          "
          class="absolute w-9 h-9 bg-contain bg-center bg-no-repeat active:scale-95 z-20"
        ></button>
        <!-- DlgContent Include bg -->
        <main
          class="relative mx-auto bg-contain bg-no-repeat bg-center flex flex-col items-center"
          :style="
            $ss.getters.normalizeCss(
              {
                width: 571 / 2,
                height: 898 / 2,
                paddingTop: 29,
                paddingBottom: 26,
              },
              require('@/assets/gameMsg/bgMailDlg.png?webp'),
              true
            )
          "
        >
          <section class="relative px-12 mb-3">
            <!-- Title -->
            <div class="text-center px-2 mb-4">
              <h3
                class="text-[18px] leading-none text-[#333] robot-medium mb-0.5 tz-ellipsis-break-1"
                v-html="info.title"
              ></h3>
              <div class="text-[#333] robot text-[10px]">
                {{ textDate }}
              </div>
            </div>
            <!-- Content -->
            <div
              class="overflow-y-auto text-[#666] text-left"
              :style="
                $ss.getters.designPxsObjToReal({
                  height: mode === 'reward' ? 230 : 270,
                })
              "
            >
              <div class="text-sm leading-none" v-html="info.content"></div>
            </div>
            <!-- Reward -->
            <div v-if="mode === 'reward'" class="pt-2">
              <div
                class="bg-contain bg-center mb-2"
                :style="
                  $ss.getters.normalizeCss(
                    { width: 200, height: 4 },
                    require('@/assets/gameMsg/hrGift.png'),
                    false
                  )
                "
              ></div>
              <div class="h-6 overflow-y-visible">
                <div class="flex items-center justify-center">
                  <div
                    v-for="(reward, idx) in rewardList"
                    :key="idx"
                    class="rounded-md bg-contain w-9 h-9 flex flex-col items-center justify-center mx-1.5 px-1 relative"
                    v-webp="require('@/assets/gameMsg/giftBg.png?webp')"
                  >
                    <div
                      class="bg-contain bg-center bg-no-repeat"
                      :style="
                        $ss.getters.convertBgImageStyle(
                          reward.icon,
                          false,
                          $ss.getters.designPxsObjToReal({
                            width: 30,
                            height: 30,
                          })
                        )
                      "
                    ></div>
                    <div class="absolute scale-[0.7] top-5">
                      <div
                        class="robot-bold text-xs vshadow-stroke-1 text-white"
                      >
                        +{{ reward.txtAmount }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <button
            :class="{
              invisible: !mode,
              'vbtn--primary mt-2': mode !== 'delete',
              'vbtn--danger mt-3': mode === 'delete',
            }"
            @click="onDelOrClaimClick"
            class="shrink-0 mx-auto active:scale-95 vbtn flex items-center justify-center"
          >
            {{ bottomBtnConfig.text }}
          </button>
          <div
            class="text-[#8397B8] text-center font-rubik font-xs leading-4 scale-[0.8] w-[120%]"
          >
            {{ $t('VG.preserveMsgTip') }}
          </div>
        </main>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import { formatDate, formatTime } from '@/utils/datetime';
import { getCoinConfig } from '@/modules/VAssetInfo/VCoin.config';
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import ButtonLockController from '@/controller/ButtonLockController';
import { Toast } from 'vant';
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
import { collectRewardMessageController } from '@/vservices/client/MessageController';

@Component({
  components: {},
})
export default class VGameMessageDetailDlg extends mixins(BaseDlgMixin) {
  @Prop({
    type: Object,
    required: false,
  })
  info: API.UserMessageVO;

  get textDate() {
    const pushDateTime = this.info?.pushDateTime;
    if (!pushDateTime) {
      return '';
    }
    const dt = Number(pushDateTime);
    return `${formatDate(dt)} ${formatTime(dt)}`;
  }

  //#region Dlg Basic Setting
  dlgSound = true;

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
    }
  }

  get commonTraceParam() {
    const info = this.info;
    if (!info) {
      return {};
    }

    return {
      email_name: info.title,
      email_id: info.id,
    };
  }
  onCloseClicked() {
    this.$tracev('close_app_in_message_email', this.commonTraceParam);

    this.emitDlgVisible(false);
  }
  //#endregion

  get mode() {
    const info = this.info;

    if (info?.hasReward) {
      return 'reward';
    } else {
      return 'delete';
    }
  }

  get bottomBtnConfig() {
    const mode = this.mode;
    if (!mode) {
      return {};
    }
    if (mode === 'delete') {
      return {
        text: this.$t('VG.IKnown'),
      };
    } else {
      return {
        text: this.$t('VG.RevAll'),
      };
    }
  }
  get rewardList() {
    const info = this.info;
    if (!info) {
      return null;
    }
    return info.rewards.map((item) => {
      const config = getCoinConfig(item.rewardType);
      return {
        icon: config.icon,
        amount: item.amount,
        txtAmount: config.format
          ? config.format(Number(item.amount))
          : item.amount,
      };
    });
  }

  async onDelOrClaimClick() {
    const info = this.info;
    if (!info) {
      return;
    }
    if (!ButtonLockController.Instance.tryGetLock('msg-click', 0.5)) {
      return;
    }
    const commonTraceParam = this.commonTraceParam;
    if (this.mode === 'delete') {
      this.$tracev('delete_app_in_message_email', commonTraceParam);
      // const res = await removeMessageController([this.info.id] as any);
      // if (res.success) {
      this.emitDlgVisible(false);
      //   this.$emit('deleted', this.info);
      // } else {
      //   Toast(res.message);
      // }
    } else {
      this.$tracev('click_app_in_message_emailreward', {
        ...commonTraceParam,
        reward_coins: info.rewards[0]?.amount + '',
      });
      const res = await collectRewardMessageController({
        messageIds: [this.info.id],
      });
      if (res.success) {
        this.emitDlgVisible(false);
        this.$emit('deleted', this.info);
        if (res.data && res.data.length > 0) {
          this.$emit('openRewards', res.data);
        }
      } else {
        Toast(res.message);
      }
    }
  }
}
</script>
