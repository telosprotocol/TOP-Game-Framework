import type { RewardType } from '@/constants/RewardType';
import { MS_MINUTES_30 } from '@/constants/time';
import { getJsonConfigByRemote } from '@/http/api/config/configUtils';
import {
  FissionPropConfigMap,
  IPropConfig,
} from '@/store/modules-dynamic/fission/enums';
import { convertBgImageStyle } from '@/utils/styles';
import { tryInitConfigCommon } from './utils';

//#region       
export interface IPropConfigItem {
  /**
   *   Id
   */
  itemId: number;
  /**
   *     ，    itemId
   *   ：     skinId=   itemId(   skinId)
   *           skinId
   */
  skinId?: number;

  /**
   *     
   */
  type: RewardType;

  /**
   *      
   */
  name: string;
  /**
   *         （     ）
   */
  actionStr?: string;
  /**
   *   img,    skinId       ，    img   
   *     skinId    ，     
   */
  img?: string;

  /**
   *     ，    0 ，        
   *   :s
   */
  cd?: number;
}

/**
 *       
 */
export interface IConfigPropModel {
  list: IPropConfigItem[];
  updateAt: number;
}
//#endregion

export const CONFIGNUM_PROPCONFIG = 115;
export default function tryInitConfigPropConfig() {
  const Utils = tryInitConfigCommon(CONFIGNUM_PROPCONFIG, {
    initialValue: {},
    initMode: 'default',
    overtimeMs: MS_MINUTES_30,
    getConfig: function () {
      return getJsonConfigByRemote<Partial<IConfigPropModel>>(
        CONFIGNUM_PROPCONFIG
      );
    },
    watch: (propConfig) => {
      if (propConfig && propConfig.list) {
        propConfig.list.forEach((serverItem) => {
          // config  FissionPropConfigMap
          let oldPropConfig = FissionPropConfigMap[serverItem.itemId];
          if (!oldPropConfig) {
            const skinPropConfig =
              FissionPropConfigMap[serverItem.skinId] ||
              ({} as Partial<IPropConfig>);
            oldPropConfig = FissionPropConfigMap[serverItem.itemId] = {
              ...skinPropConfig,
              ...serverItem,
              text: '',
              imgStyle: skinPropConfig.imgStyle || {},
            } as IPropConfig;
          } else {
            oldPropConfig.name = serverItem.name;
            oldPropConfig.actionStr = serverItem.actionStr;
          }
          if (serverItem.img) {
            oldPropConfig.isWebp = false;
            oldPropConfig.img = serverItem.img;
            oldPropConfig.imgStyle = convertBgImageStyle(serverItem.img, false);
          }
          // if (
          //   serverItem.skinId == null ||
          //   serverItem.skinId === serverItem.itemId
          // ) {
          //   //skinId===itemId
          // } else {
          //   //   skinId
          // }
        });
      }
    },
  });
  return Utils;
}
