import type { BannerOpType } from '@/constants/BannerOpType';
import { MS_MINUTES_30 } from '@/constants/time';
import { getJsonConfigByRemote } from '@/http/api/config/configUtils';
import { tryInitConfigCommon } from './utils';

//#region banner   48
export const CONFIGNUM_BANNER = 48;

/**
 * 1 banner       
 */
export interface IConfigBannerModel {
  updateAt?: number;
  sections: IBannerConfigSectionItem[];
}

export interface IBannerConfigSectionItem {
  sectionName: string;
  /**
   *  banner      
   */
  groups?: IBannerConfigGroupItem[];
}

export interface IBannerConfigGroupItem {
  groupName: string;
  banners: IBannerConfigItem[];
}

export interface IBannerConfigItem {
  /**
   *     
   */
  opType: BannerOpType;

  /**
   * url       /  id
   */
  url: string;

  /**
   *       
   */
  image: string;

  // /**
  //  *    
  //  */
  // epNum?: string | number;

  /**
   *      app  (    )
   */
  traceType?: string;

  /**
   *     
   */
  traceTag?: string;

  /**
   *   (        ）
   */
  title?: string;

  /**
   *   ()
   */
  titleLocales?: Record<string, string>;
}
/**
 * Banner
 * @returns
 */
export default function tryInitConfigBanner() {
  return tryInitConfigCommon(CONFIGNUM_BANNER, {
    initialValue: {
      sections: [],
    },
    initMode: 'default',
    overtimeMs: MS_MINUTES_30,
    getConfig: function () {
      return getJsonConfigByRemote<IConfigBannerModel>(CONFIGNUM_BANNER);
    },
  });
}

//#endregion

export const CONFIGNUM_VBANNER = 126;
/**
 * Banner
 * @returns
 */
export function tryInitConfigVBanner() {
  return tryInitConfigCommon(CONFIGNUM_VBANNER, {
    initialValue: {
      sections: [],
    },
    initMode: 'default',
    overtimeMs: MS_MINUTES_30,
    getConfig: function () {
      return getJsonConfigByRemote<IConfigBannerModel>(CONFIGNUM_VBANNER);
    },
  });
}
