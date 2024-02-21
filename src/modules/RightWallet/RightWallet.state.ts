import { MS_MINUTE } from '@/constants/time';
import { createHttpAsyncStateItem } from '@/controller/AsyncStateItem';
import Vue from 'vue';
import { VCoinEnum } from '@/modules/VAssetInfo/VCoinEnum';
import { onGBus } from '@/utils/GBus';
import Component from 'vue-class-component';
import { formatVGold, formatVToken } from '@/modules/vFormatter';
import { infoUserWalletController } from '@/vservices/client/UserWalletController';

/**
 *   Token          (      )
 */
const stateItemVRightWalletInfo = createHttpAsyncStateItem(
  () => {
    return infoUserWalletController();
  },
  null,
  'RightWalletInfo'
);

export function onAssetInfoSyncForWalletInfo() {
  // const cb = stateVRightStat.on2('updated', (res) => {
  //   if (res) {
  //     penetrateGBusOnly('onVUserAssetInfoInfoSync', res);
  //   }
  // });
  const cancelGBus = onGBus('onVUserAssetInfoChanged', () => {
    stateItemVRightWalletInfo.tryUpdate(0);
  });
  return () => {
    cancelGBus();
  };
}

const REVALIDATION_MS = MS_MINUTE * 5;

const PRECISIONMAP = {
  [VCoinEnum.GOLD]: formatVGold,
  [VCoinEnum.VTOKEN]: formatVToken,
};
/**
 *         -    （            ）
 */

@Component({})
export class VRightWalletInfoMixin extends Vue {
  stateItemVRightWalletInfoRef = stateItemVRightWalletInfo.ref;

  get RightWalletInfo() {
    return this.stateItemVRightWalletInfoRef.current;
  }
  get UserAssetInfoMap() {
    const assetList = this.RightWalletInfo?.userCoinItems || [];
    const assetMap: Partial<Record<VCoinEnum, API.UserBalanceItemVO>> = {};
    assetList.map((item) => {
      assetMap[item.coin as VCoinEnum] = item;
    });
    return assetMap;
  }

  getCoinAssetText(coin: VCoinEnum, defaultStr?: string) {
    const assetItem = this.UserAssetInfoMap[coin];
    const amount = assetItem?.amount;
    if (amount == null) {
      return defaultStr || '-';
    }
    // Number(assetItem.freezeAmount ?? 0)
    return PRECISIONMAP[coin](Number(amount));
  }

  /**
   *      RP
   * @param coin
   * @param defaultStr
   * @returns
   */
  getCoinAssetRp(coin: VCoinEnum, defaultStr?: string) {
    const assetItem = this.UserAssetInfoMap[coin];
    const amount = assetItem?.amount;
    if (amount == null) {
      return defaultStr || '-';
    }
    //+ Number(assetItem.freezeAmount ?? 0)
    return PRECISIONMAP[coin](Number(amount) * Number(assetItem.tokenPriceRp));
  }
  /**
   *
   * @param timeout     ，       revalidation  ，   0
   */
  refreshVRightWalletInfo(timeout?: number) {
    return stateItemVRightWalletInfo.tryUpdate(
      timeout == null ? REVALIDATION_MS : timeout
    );
  }
}

export default stateItemVRightWalletInfo;
