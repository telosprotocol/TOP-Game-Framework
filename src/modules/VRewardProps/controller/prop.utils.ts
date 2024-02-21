import type { IVGettedRewardDlgInfo } from '@/modules/VRewardProps/VGettedRewardsDlg.vue';
import type {
  IUserPropItem,
  IUserPropRewardItem,
  IUserPropRewardItemBase,
  IVPropType,
} from './prop.model';

export function getRewardDlgInfoByPropReward(
  prop: IUserPropRewardItemBase,
  useNum: number
) {
  return {
    icon: prop.imageUrl,
    text: `${prop.nameText}x${useNum}`,
  } as IVGettedRewardDlgInfo;
}

/**
 *
 */
const CommonPropUsable: IVPropType[] = [
  'GOLD',
  'VTOKEN',
  'PHONE_CHARGE_TICKET',
  'FLOW_CARD',
];
/**
 *
 * @param prop
 */
export function getIsPropUsableForCommonUse(prop: IUserPropItem) {
  if (
    prop.stackNum >= 1 &&
    prop.propProductVo.usable &&
    !prop.propProductVo.autoUse
  ) {
    const propType = prop.propProductVo.type;
    if (CommonPropUsable.indexOf(propType) !== -1) {
      return true;
    }
    return false;
  } else {
    return false;
  }
}
/**
 *
 * @param prop
 */
export function getIsPropRewardUsableForCommonUse(
  prop: IUserPropRewardItemBase
) {
  if (prop.propNum >= 1 && prop.usable && !prop.autoUse) {
    const propType = prop.type;
    if (CommonPropUsable.indexOf(propType as 'GOLD') !== -1) {
      return true;
    }
    return false;
  } else {
    return false;
  }
}

export function convertPropBagItemToPropReward(bagItem: IUserPropItem) {
  if (!bagItem) {
    return;
  }
  const propInfo = bagItem.propProductVo || {};
  return {
    propBagId: bagItem.id,
    propId: propInfo.id,
    nameText: propInfo.nameText,
    imageUrl: propInfo.imageUrl,
    type: propInfo.type,
    num: propInfo.num,
    autoUse: propInfo.autoUse,
    usable: propInfo.usable,
    propNum: bagItem.stackNum,
    descriptionText: propInfo.descriptionText,
  } as IUserPropRewardItem;
}
