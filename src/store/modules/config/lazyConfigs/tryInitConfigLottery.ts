import { MS_MINUTES_30 } from '@/constants/time';
import { getJsonConfigByRemote } from '@/http/api/config/configUtils';
import { tryInitConfigCommon } from './utils';

export const CONFIGNUM_LOTTERY = 60;
//#region     

export interface ILotteryShareItem {
  icon: string;
  title: string;
  name: string;
  shareType: number;
  sharePlatform: number;
  /**
   *     （       ）
   */
  prePackageName?: string;

  /**
   *     
   */
  shareImage: string;

  /**
   *     
   */
  shareContent: string;
}
export interface ILotteryDisscountItem {
  //    
  ticket: number;
  //    
  free: number;
}
export type IConfig60Model = {
  /**
   *         
   */
  open: boolean;

  /**
   *         
   */
  entryTitle: string;

  /**
   *         
   */
  entryImg: string;

  /**
   *             （    ）(v2.1.7+)
   */
  firstGiftDlgHeadImg: string;

  /**
   *            （    ）
   */
  lotteryTitleImg: string;

  /**
   *        4     
   */
  prizeList: {
    image: string;
  }[];

  /**
   *     ，    
   */
  ticketPrice?: number;
  /**
   *        winner say（           ，    ）
   */
  winnerSay?: {
    //     
    url: string;
    // urlSchema  ，   
    urlSchema: string;
  };
  /**
   *        
   *   ticket   ，  free     
   */
  discount?: ILotteryDisscountItem[];
  /**
   *             
   */
  shareList?: ILotteryShareItem[];

  /**
   *                   
   */
  shareInfo: {
    shareImage: string;
    shareContent: string;
  };

  /**
   *        Whatsapp  
   */
  whatsappNum: string;

  /**
   *        Whatsapp UrlSchema
   */
  whatsappUrl: string;

  /**
   *        url(v2.1.7+)
   */
  showCaseGroupUrl: string;
  /**
   *        urlSchema,   (v2.1.7+)
   */
  showCaseGroupUrlSchema?: string;
};

//#endregion

export default function tryInitConfigLottery() {
  return tryInitConfigCommon(CONFIGNUM_LOTTERY, {
    initialValue: {},
    initMode: 'default',
    overtimeMs: MS_MINUTES_30,
    getConfig: function () {
      return getJsonConfigByRemote<Partial<IConfig60Model>>(CONFIGNUM_LOTTERY);
    },
  });
}
