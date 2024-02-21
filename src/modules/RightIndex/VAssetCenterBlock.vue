<template>
  <div>
    <div
      v-for="item in assetList"
      :key="item.id"
      @click="item.onClick"
      class="bg-center bg-[length:100%_auto] bg-no-repeat mb-2 overflow-hidden mx-auto"
      :style="item.bgStyle"
    ></div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { convertBgImageStyle } from '@/utils/styles';

import ButtonLockController from '@/controller/ButtonLockController';
import { openAppH5LinkPreferLocal } from '@/utils/navigator/index';
import { ROUTEPATH_V_INVEST_INTRO } from '@/constants/localRoutePath';
import { ROUTENAME_INAPP_VRIGHT } from '@/constants/localRoutePath';

import Vue from 'vue';
import { MS_MINUTE } from '@/constants/time';
import { Watch } from 'vue-property-decorator';
import { waitUserIsLoginedOnly } from '@/store/modules/user.utils';
import {
  ROUTEPATH_V_PROMOTE_INCOME,
  ROUTEPATH_V_PROMOTE_INCOME_NEWBIE,
} from '@/constants/localRoutePath';
import { navigation_login_bridge } from '@/js_bridge/js_call_app_base';

import { recordGameInviteController } from '@/vservices/client/GameInviteController';
@Component({
  components: {},
})
export default class VAssetCenterBlock extends Vue {
  get assetList() {
    // const VRightStat = this.VRightStat;

    return [
      // {
      //   id: '1',
      //   bg: this.$ss.getters.translateImage({
      //     en: require('./imgs/asset-center/01-en.png?webp'),
      //     id: require('./imgs/asset-center/01-id.png?webp'),
      //   }),
      //   // bg2: require('./imgs/asset-center/hasData/01.png?webp'),
      //   // value: VRightStat?.playGameDstToRpTotalAmount,
      //   type: 'playGame',
      //   traceType: 'game_card',
      //   // iconWebp: require('@/assets/vcommon/CoinVToken.png?webp'),
      //   //            DST,   RP，
      //   onClick: async () => {
      //     if (!ButtonLockController.Instance.tryGetNavLock()) {
      //       return;
      //     }
      //     this.$trace('click_passcard', {
      //       passcard_type: 'game_card',
      //     });

      //     const isLogined = await waitUserIsLoginedOnly();
      //     if (!isLogined) {
      //       navigation_login_bridge(ROUTENAME_INAPP_VRIGHT);
      //     }
      //     const res = await userPlayGameStatForuneCenterController();
      //     const url =
      //       res.success && res.data.hasDstRecord === true
      //         ? ROUTEPATH_V_PLAY_TO_EARN
      //         : ROUTEPATH_V_PLAY_TO_EARN_NEWBIE;

      //     openAppH5LinkPreferLocal(url, {});
      //   },
      // },
      {
        id: '2',
        type: 'promteGame',
        traceType: 'promote_card',
        bg: this.$ss.getters.translateImage({
          en: require('./imgs/asset-center/02-en.png?webp'),
          id: require('./imgs/asset-center/02-id.png?webp'),
        }),
        // bg2: require('./imgs/asset-center/hasData/02.png?webp'),
        // value: VRightStat?.promoteGameToRpEarnAmount,
        // iconWebp: require('@/assets/vcommon/CoinGold.png?webp'),
        //
        onClick: async () => {
          if (!ButtonLockController.Instance.tryGetNavLock()) {
            return;
          }
          this.$trace('click_passcard', {
            passcard_type: 'promote_card',
          });

          const isLogined = await waitUserIsLoginedOnly();
          if (!isLogined) {
            navigation_login_bridge(ROUTENAME_INAPP_VRIGHT);
            return;
          }

          const res = await recordGameInviteController();
          const url =
            res.success && res.data === true
              ? ROUTEPATH_V_PROMOTE_INCOME + '?from=right'
              : ROUTEPATH_V_PROMOTE_INCOME_NEWBIE + '?from=right';
          openAppH5LinkPreferLocal(url, {});
        },
      },
      {
        id: '3',
        bg: this.$ss.getters.translateImage({
          en: require('./imgs/asset-center/03-en.png?webp'),
          id: require('./imgs/asset-center/03-id.png?webp'),
        }),
        // bg2: require('./imgs/asset-center/hasData/03.png?webp'),
        // value: VRightStat?.investDstToRpTotalAmount,
        type: 'investDst',
        traceType: 'invest_card',
        //       TODO:        ，
        onClick: async () => {
          if (!ButtonLockController.Instance.tryGetNavLock()) {
            return;
          }
          this.$trace('click_passcard', {
            passcard_type: 'invest_card',
          });
          openAppH5LinkPreferLocal(ROUTEPATH_V_INVEST_INTRO, {
            checkLogin: {
              traceEvent: ROUTENAME_INAPP_VRIGHT,
            },
          });
        },
      },
    ].map((item) => {
      // const hasAmount = item.value && item.value !== '0';
      return {
        ...item,
        bgStyle: convertBgImageStyle(
          item.bg,
          true,
          this.$ss.getters.designPxsObjToReal({
            width: 328,
            height: 108,
          })
        ),
        // txtValue: hasAmount ? formatVRp(Number(item.value)) : '',
      };
    });
  }
  @Watch('$ss.state.bridge.appTabName', {
    immediate: false,
  })
  onAppTabNameChange(appTabName: string) {
    if (appTabName === 'wallet') {
      this.onExpose();
    }
  }
  lastExposeDt = 0;
  onExpose() {
    const dtNow = new Date().getTime();
    if (dtNow - this.lastExposeDt > MS_MINUTE * 5) {
      this.assetList.forEach((item) => {
        this.$trace('passcard_exposure', { passcard_type: item.traceType });
      });
    }
  }
}
</script>
