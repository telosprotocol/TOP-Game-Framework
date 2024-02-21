import { MS_MINUTES_30 } from '@/constants/time';
import { getJsonConfigByRemote } from '@/http/api/config/configUtils';
import { tryInitConfigCommon } from './utils';

/**
 *         
 * @returns
 */

export default function tryInitConfigUserInfoCompleteOptions() {
  return tryInitConfigCommon(CONFIGNUM_UserInfoCompleteOptions, {
    initialValue: {
      contentTypes: [],
      movieTypes: [],
      tvTypes: [],
    },
    initMode: 'default',
    overtimeMs: MS_MINUTES_30,
    getConfig: function () {
      return getJsonConfigByRemote<IConfigUserInfoCompleteOptions>(
        CONFIGNUM_UserInfoCompleteOptions
      );
    },
  });
}

export interface IKVEOptionItem {
  v: string;
  /**
   *    ，   ，=k
   */
  l?: string;

  /**
   * emoji  
   */
  e?: string;
}
/**
 *         
 */

export interface IConfigUserInfoCompleteOptions {
  /**
   *     
   */
  contentTypes: IKVEOptionItem[];

  /**
   *     
   */
  movieTypes: IKVEOptionItem[];

  /**
   *      
   */
  tvTypes: IKVEOptionItem[];
}
export const CONFIGNUM_UserInfoCompleteOptions = 46;
