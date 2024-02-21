import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import Vue from 'vue';
import { onGBus } from '@/utils/GBus';
import { penetrateGBusOnly } from '@/js_bridge/jsCallApp/utilsPenetrate';
import { userStatForuneCenterController } from '@/vservices/client/ForuneCenterController';
import { updateCoins } from '../../js_bridge/js_call_app_base';

let isInited = false;
function tryInitUserAssetInfoUpdate() {
  if (isInited) {
    return;
  }
  isInited = true;
  //      server     ，
  onGBus('onVUserAssetInfoInfoSync', (newInfo) => {
    stateVRightStat.setSuccessResult(newInfo);
  });
}

const stateVRightStat = createHttpAsyncStateItem(
  () => {
    //    WalletInfo    ，
    tryInitUserAssetInfoUpdate();
    return userStatForuneCenterController().then((res) => {
      if (res.success && res.data) {
        updateCoins(String(res.data.goldTotalAmount));
      }
      return res;
    });
  },
  null,
  'RightStat'
);

export function onRightAssetInfoSync() {
  const cb = stateVRightStat.on2('updated', (res) => {
    if (res) {
      penetrateGBusOnly('onVUserAssetInfoInfoSync', res);
    }
  });
  const cancelGBus = onGBus('onVUserAssetInfoChanged', () => {
    stateVRightStat.tryUpdate(0);
  });
  return () => {
    stateVRightStat.off('updated', cb);
    cancelGBus();
  };
}
const REVALIDATION_MS = 500;

/**
 *     token
 */
export const VRightStatMixin = Vue.extend({
  data() {
    return {
      stateItemVRightStatRef: stateVRightStat.ref,
    };
  },
  computed: {
    VRightStat() {
      return this.stateItemVRightStatRef.current;
    },
  },
  methods: {
    /**
     *
     * @param timeout     ，       revalidation  ，   0
     */
    refreshVRightStat(timeout?: number) {
      return stateVRightStat.tryUpdate(
        timeout == null ? REVALIDATION_MS : timeout
      );
    },
  },
});

export default stateVRightStat;
