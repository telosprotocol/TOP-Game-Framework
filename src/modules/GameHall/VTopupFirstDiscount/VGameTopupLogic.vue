<template>
  <portal to="modal">
    <VGameTopupFirstDiscountDlg
      :from="from"
      v-model="isDlgOpen"
      ref="dlg1"
    ></VGameTopupFirstDiscountDlg>
    <VGameTopupFirstDiscountV2Dlg ref="dlg2" :from="from" v-model="isDlgV2Open">
    </VGameTopupFirstDiscountV2Dlg>
  </portal>
</template>

<script lang="ts">
import ButtonLockController from '@/controller/ButtonLockController';
import Component from 'vue-class-component';
import VGameTopupFirstDiscountDlg from './VGameTopupFirstDiscountDlg.vue';
import { Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { VIsGameFirstRechargedMixin } from './VGameRecharge.state';
import { Toast } from 'vant';
import { onGBus } from '@/utils/GBus';
import type {
  IActivityEntryFrom,
  IActivityType,
} from '@/modules/VHallActivitysBar/activity-logic.config';
import BindEventMixinDefault from '@/mixins/BindEventMixin';
import ImagePreloader from '@/controller/ImagePreloader';
import { checkMinVersionName } from '../../../store/modules/app/checkMinVersionName';
import VGameTopupFirstDiscountV2Dlg from './VGameTopupFirstDiscountV2Dlg.vue';
import { VActivityHallReady } from '@/modules/VActivityList/activity-hall.state';
@Component({
  components: { VGameTopupFirstDiscountDlg, VGameTopupFirstDiscountV2Dlg },
})
export default class VGameTopupLogic extends mixins(
  VIsGameFirstRechargedMixin,
  BindEventMixinDefault
) {
  $refs: {
    dlg1: VGameTopupFirstDiscountDlg;
    dlg2: VGameTopupFirstDiscountV2Dlg;
  };
  useInited() {
    return onGBus('onVUserRechargeGameGold', async () => {
      /**
       *     
       */
      this.$emit('updateActivity', { type: 'FIRST_CHARGE' as IActivityType });
      // //  
      // stateItemVIsGameFirstRecharged.tryUpdate(0);
      // //  
      // stateItemVGameUserTask.tryUpdate(0);
    });
  }

  get isLogined() {
    return this.$ss.getters['user/isRealLogined'];
  }

  @Watch('isLogined', { immediate: true })
  onLoginded(isLogined: boolean) {
    if (isLogined) {
      this.refreshVIsGameFirstRecharged();
    }
  }
  from = '';

  async onButtonClick(from: IActivityEntryFrom) {
    if (!ButtonLockController.Instance.tryGetLock('topup', 1)) {
      return;
    }
    this.tryOpenDlg(from, true);
    // openAppH5LinkPreferLocal(ROUTEPATH_V_GAMERECHARGE, {});
  }

  /**
   *  
   * @param from
   * @param dontWaitDlgImageReady
   * return false  ，true:  ,payopened:  
   */
  async tryOpenDlg(
    from: IActivityEntryFrom | 'VGame_pay_seq',
    dontWaitDlgImageReady?: boolean
  ) {
    const res = await this.refreshVIsGameFirstRecharged(); //  
    this.$tracev('click_gamehall_first_topup', {
      activity_type: from,
    });
    if (res.error) {
      Toast(res.error.message);
      return false;
    }
    if (true !== dontWaitDlgImageReady) {
      const isReady = await this.waitDlgImageReady();
      if (process.env.VUE_APP_ENV_SERVER === 'development') {
        console.log('[FirstTopup] load image error ignore open', from);
      }
      if (!isReady) {
        return false;
      }
    }
    this.from = from;
    if (checkMinVersionName('2.8.8.0')) {
      this.isDlgV2Open = true;
      return this.$refs.dlg2.waitDlgClose().then(() => {
        if (this.$refs.dlg2.isOpenedPay) {
          return 'payopened';
        } else {
          return true;
        }
      });
    } else {
      this.isDlgOpen = true;
      return this.$refs.dlg1.waitDlgClose().then(() => {
        return true;
      });
    }
  }

  @Watch('GameFirstTopupDlgImageList')
  onPreloadImage(picList: API.ActivityPicVO[]) {
    if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
      console.log('[Topup] start preload image', picList);
    }
    VActivityHallReady.FIRST_CHARGE = false;
    this.waitDlgImageReady().then((isOk) => {
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.log('[Topup] end preload image', isOk);
      }
      VActivityHallReady.FIRST_CHARGE = isOk;
    });
  }
  waitDlgImageReady() {
    return this.refreshVIsGameFirstRecharged()
      .then((res) => {
        if (res.ok) {
          return this.GameFirstTopupDlgImageList;
        } else {
          return null;
        }
      })
      .then((list) => {
        if (list && list.length > 0) {
          return Promise.all(
            list.map((item) => {
              return ImagePreloader.Instance.waitImageLoaded(item.url);
            })
          )
            .then(() => {
              return true;
            })
            .catch((_ex) => {
              if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
                console.log('[Topup] waitImageReady error', _ex);
              }
              return false;
            });
        } else {
          return false;
        }
      });
  }

  isDlgV2Open = false;

  isDlgOpen = false;

  closeAll() {
    this.isDlgOpen = false;
    this.isDlgV2Open = false;
  }
}
</script>
