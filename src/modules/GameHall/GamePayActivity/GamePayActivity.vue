<template>
  <GameActivityDlgUI
    :value="value"
    @input="emitDlgVisible"
    v-bind="$attrs"
    @close="$emit('close')"
    :img-title="
      $ss.getters.translateImage({
        en: require('@/assets/gameActivity/activity-en.png'),
        id: require('@/assets/gameActivity/activity-id.png'),
      })
    "
  >
    <div
      class="overflow-auto box-content -mx-1"
      :style="
        $ss.getters.designPxsObjToReal({
          height: 287,
          paddingTop: 4,
        })
      "
    >
      <VWelfareItemUI
        v-for="item in bannerList"
        :key="item.type"
        :item="item"
        @click="onBannerClick(item.type)"
      ></VWelfareItemUI>
    </div>
  </GameActivityDlgUI>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Prop, Watch } from 'vue-property-decorator';
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
import GameActivityDlgUI from '@/modules/UI/GameActivityDlgUI.vue';
import VWelfareItemUI from '@/modules/VActivityList/VWelfareItemUI.vue';
import { waitUserIsLoginedAuth } from '@/store/modules/user.utils';
import { navigation_login_bridge } from '@/js_bridge/js_call_app_base';
import { BannerOpType } from '@/constants/BannerOpType';
import type { IActivityEntryFrom } from '@/modules/VHallActivitysBar/activity-logic.config';
import { VActivityHallListMixin } from '@/modules/VActivityList/activity-hall.state';
import { MS_SECOND } from '@/constants/time';
@Component({
  components: {
    GameActivityDlgUI,
    VWelfareItemUI,
  },
})
export default class GamePayActivity extends mixins(
  BaseDlgMixin,
  VActivityHallListMixin
) {
  //#region Dlg Basic Setting
  dlgSound = true;

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.refreshVActivityList(MS_SECOND);
    }
  }

  @Prop({
    type: String,
  })
  from: IActivityEntryFrom | 'VGame_pay_seq';
  //#endregion
  get bannerList() {
    // const activityMapRedpiont: Partial<
    //   Record<API.ActivitiesManagementVO['type'], boolean>
    // > = {};
    // this.VActivityList.map((item) => {
    //   activityMapRedpiont[item.type] = item.hasRedDot;
    // });
    return this.VActivityList.filter((item) => {
      return item.type === 'PAY' || item.type === 'GROWTH_PLAN';
    });
    // return [
    //   {
    //     name: this.$t('VG.topupEvent'),
    //     type: 'PAY' as const,
    //     image: webpFilter(
    //       this.$ss.getters.translateImage({
    //         en: require('@/assets/gameActivity/topup-en.png?webp'),
    //         id: require('@/assets/gameActivity/topup-id.png?webp'),
    //       })
    //     ),
    //   },
    //   {
    //     name: this.$t('VG.growthPlan'),
    //     type: 'GROWTH_PLAN' as const,
    //     image: webpFilter(
    //       this.$ss.getters.translateImage({
    //         en: require('@/assets/gameActivity/growthPlan-en.png?webp'),
    //         id: require('@/assets/gameActivity/growthPlan-id.png?webp'),
    //       })
    //     ),
    //   },
    // ].map((item) => {
    //   return {
    //     ...item,

    //   }
    // });
  }

  async onBannerClick(type: API.ActivitiesManagementVO['type']) {
    if (!ButtonLockController.Instance.tryGetLock('ac')) {
      return;
    }
    // type:'PAY' | 'GROWTH_PLAN'
    const isLogin = await waitUserIsLoginedAuth();
    if (isLogin) {
      this.$emit('openNext', type);
      this.emitDlgVisible(false);
    } else {
      navigation_login_bridge(
        ('gamehall_' + type) as 'gamehall_GROWTH_PLAN' | 'gamehall_PAY',
        {
          to: '/h5command/openGameHallDlg?type=' + type,
          opType: BannerOpType.AppLink,
        }
      );
    }
  }
}
</script>
