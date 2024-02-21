import { MS_MINUTES_30 } from '@/constants/time';
import { getJsonConfigByRemote } from '@/http/api/config/configUtils';
import { tryInitConfigCommon } from './utils';

type IProveItem = {
  url: string;
  image: string;
};
/**
 *       ,refer    
 */
export type IConfig14Model = {
  howToSayLinks: IProveItem[];
  proveLinks: IProveItem[];
  /**
   *    ，   3
   */
  limitCountForWhatsappSecret?: number;
};
export const CONFIGNUM_REFERAINFO = 14 as const;
/**
 * refer    
 * @returns
 */
export default function tryInitConfigReferAInfo() {
  return tryInitConfigCommon(CONFIGNUM_REFERAINFO, {
    initialValue: {
      howToSayLinks: [],
      proveLinks: [],
      // limitCountForWhatsappSecret: 3,
    },
    initMode: 'default',
    overtimeMs: MS_MINUTES_30,
    getConfig: function () {
      return getJsonConfigByRemote<IConfig14Model>(CONFIGNUM_REFERAINFO);
    },
  });
}
