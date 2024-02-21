import { MS_MINUTES_30 } from '@/constants/time';
import { getJsonConfigByRemote } from '@/http/api/config/configUtils';
import { tryInitConfigCommon } from './utils';

export const CONFIGNUM_PLAYFORMCATEGORY = 107;
export type IShortLvConfigItem = { l: string; v: string };
/**
 *       
 */
export interface IConfig107Model {
  list: IShortLvConfigItem[];
}
export default function tryInitConfigPlayformCategory() {
  return tryInitConfigCommon(CONFIGNUM_PLAYFORMCATEGORY, {
    initialValue: {},
    initMode: 'default',
    overtimeMs: MS_MINUTES_30,
    getConfig: function () {
      return getJsonConfigByRemote<Partial<IConfig107Model>>(
        CONFIGNUM_PLAYFORMCATEGORY
      );
    },
  });
}
