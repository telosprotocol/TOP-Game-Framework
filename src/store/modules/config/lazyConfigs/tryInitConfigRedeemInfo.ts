import { MS_MINUTES_30 } from '@/constants/time';
import { getJsonConfigByRemote } from '@/http/api/config/configUtils';
import { tryInitConfigCommon } from './utils';

/**
 *       
 */
export type IConfig13Model = {
  redeemTips: string[];
};
export const CONFIGNUM_REDEEMINFO = 13;
//          13
/**
 *     
 * @returns
 */

export default function tryInitConfigRedeemInfo() {
  return tryInitConfigCommon(CONFIGNUM_REDEEMINFO, {
    initialValue: {
      redeemTips: [],
    },
    initMode: 'default',
    overtimeMs: MS_MINUTES_30,
    getConfig: function () {
      return getJsonConfigByRemote<IConfig13Model>(CONFIGNUM_REDEEMINFO);
    },
  });
}
