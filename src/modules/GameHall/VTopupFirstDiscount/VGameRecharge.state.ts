import { checkMinVersionName } from '@/store/modules/app/checkMinVersionName';
import { penetrateGBusOnly } from '@/js_bridge/jsCallApp/utilsPenetrate';
import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import Vue from 'vue';
import Component from 'vue-class-component';
import { updateVAssetInfo } from '@/modules/VAssetInfo/VAsset.utils';
import {
  firstRechargeActivityLogController,
  firstRechargeV2ActivityLogController,
} from '@/vservices/client/ActivityLogController';

/**
 *       (         )
 */
const stateItemVIsGameFirstRecharged = createHttpAsyncStateItem(
  () => {
    if (!checkMinVersionName('2.8.8.0')) {
      return firstRechargeActivityLogController();
    }
    return firstRechargeV2ActivityLogController();
  },
  null,
  'VIsGameFirstRecharged'
);

/**
 *   app
 */
export function onUserHasRechargedGameGoldForMainActivity() {
  // +         ，
  // +
  penetrateGBusOnly('onVUserRechargeGameGold', {});
  //
  penetrateGBusOnly('onVTaskUpdate', {
    type: 'behavior',
    behavior: 'RECHARGE',
  });

  //       ，
  updateVAssetInfo(0);
}

// export function onInitForVGameTab() {
//   return onGBus('onVUserRechargeGameGold', async () => {
//     // //
//     // stateItemVIsGameFirstRecharged.tryUpdate(0);
//     // //
//     // stateItemVGameUserTask.tryUpdate(0);
//   });
// }

//   revalidation for tab active
const REVALIDATION_MS = MS_MINUTE * 30;

/**
 *
 */
@Component({})
export class VIsGameFirstRechargedMixin extends Vue {
  stateItemVIsGameFirstRechargedRef = stateItemVIsGameFirstRecharged.ref;

  get IsGameFirstRechargedInfo() {
    return this.stateItemVIsGameFirstRechargedRef.current;
  }

  get GameFirstTopupDlgImageList() {
    const isNewVersion = checkMinVersionName('2.8.8.0');
    return this.IsGameFirstRechargedInfo?.picList
      ?.filter((item) => {
        if (isNewVersion) {
          return item.name === 'HOME_ACTIVITY_NEW';
        } else {
          return item.name === 'HOME_ACTIVITY';
        }
      })
      .slice(0, isNewVersion ? 3 : 1);
  }

  /**
   *
   * @param timeout     ，       revalidation  ，   0
   */
  refreshVIsGameFirstRecharged(timeout?: number) {
    return stateItemVIsGameFirstRecharged.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
}

export default stateItemVIsGameFirstRecharged;
