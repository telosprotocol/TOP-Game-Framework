import { MS_MINUTES_30 } from '@/constants/time';
import { getJsonConfigByRemote } from '@/http/api/config/configUtils';
import type { IConfig20Model } from '../globalConfigs/Config20CountryCodeConfig';
import { tryInitConfigCommon } from './utils';

export const CONFIGNUM_20 = 20;
/**
 * Banner
 * @returns
 */
export default function tryInitConfig20() {
  return tryInitConfigCommon(CONFIGNUM_20, {
    initialValue: {
      installMoney: null,
      // redeemImmediateList: [],

      referRangeDesc: '',

      referList: [],

      dcRangeDesc: '',
      dcGetMoney: '',
      dcIsOpened: false,
      dcProductConfigs: {},

      //  config15    
      friendMinCheckins: '', //   checkins  ,      3
    },
    initMode: 'default',
    overtimeMs: MS_MINUTES_30,
    getConfig: function () {
      return getJsonConfigByRemote<IConfig20Model>(CONFIGNUM_20);
    },
  });
}
