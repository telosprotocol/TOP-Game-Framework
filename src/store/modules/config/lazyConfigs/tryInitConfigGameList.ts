import { MS_MINUTES_30 } from '@/constants/time';
import { getJsonConfigByRemote } from '@/http/api/config/configUtils';
import { tryInitConfigCommon } from './utils';

//        41
/**
 *     
 * @returns
 */

export default function tryInitConfigGameList() {
  return tryInitConfigCommon(CONFIGNUM_GAMELIST, {
    initialValue: {
      list: [],
    },
    initMode: 'default',
    overtimeMs: MS_MINUTES_30,
    getConfig: function () {
      return getJsonConfigByRemote<IConfigGameListModel>(CONFIGNUM_GAMELIST);
    },
  });
}
/**
 *     
 */
export type IGameConfig = {
  /**
   *     （  ）
   */
  name: string;
  url: string;
  title: string;
  icon: string;
  /**
   *         ，     ，  #fff
   */
  statusBarColor?: string;

  /**
   *     
   */
  cardColor?: string;
};
/**
 *  ：       -->    
 */
export type IConfigGameListModel = {
  list: IGameConfig[];
};
export const CONFIGNUM_GAMELIST = 41;
