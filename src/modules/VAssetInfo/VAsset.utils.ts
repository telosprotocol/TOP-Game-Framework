import stateVRightStat from './RightStat.state';
import { penetrateGBusOnly } from '@/js_bridge/jsCallApp/utilsPenetrate';
import type { IVPropType } from '@/modules/VRewardProps/controller/prop.model';
// import { ROUTENAME_INAPP_VRIGHT } from '@/constants/localRoutePath';

export function updateVAssetInfo(timeout: number) {
  stateVRightStat.tryUpdate(timeout);
}

export function updateRewardsByPropTypes(type: IVPropType | 'BONUS_GOLD') {
  if (!type) {
    return;
  }
  if (type === 'BONUS_GOLD' || type === 'GOLD' || type === 'VTOKEN') {
    penetrateGBusOnly('onVUserAssetInfoChanged', {});
    //
  } else if (type === 'PHONE_CHARGE_TICKET' || type === 'FLOW_CARD') {
  } else if (type === 'HIGGS_CARD_CHANCE' || type === 'HIGGS_EXCHANGE_TICKET') {
  }
}
