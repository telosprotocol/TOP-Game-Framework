import type { BannerOpType } from '@/constants/BannerOpType';
import { MS_MINUTES_30 } from '@/constants/time';
import { getJsonConfigByRemote } from '@/http/api/config/configUtils';
import { tryInitConfigCommon } from './utils';

export interface IRedirectItemInfo {
  openType: BannerOpType;
  url: string;
  isEffective?: boolean;
}
export interface IConfigAdModel {
  redirectA?: IRedirectItemInfo;
  redirectB?: IRedirectItemInfo;
}
export const CONFIGNUM_ADCONFIG = 114;
/**
 * Banner
 * @returns
 */
export default function tryInitConfigAdConfig() {
  return tryInitConfigCommon(CONFIGNUM_ADCONFIG, {
    initialValue: {},
    initMode: 'default',
    overtimeMs: MS_MINUTES_30,
    getConfig: function () {
      return getJsonConfigByRemote<IConfigAdModel>(CONFIGNUM_ADCONFIG);
    },
  });
}
