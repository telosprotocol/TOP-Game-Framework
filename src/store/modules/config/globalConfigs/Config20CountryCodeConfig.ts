import type { IActivityNameTypes } from '../../../../http/api/dailychallenge';

/**
 *       
 */
export type IConfig20Model = {
  /**
   *       
   */
  installMoney?: number;

  // //#region     
  // /**
  //  * v1.7.3   
  //  *         (    :configNum=13)
  //  * [1,3,5]
  //  */
  // redeemImmediateList: number[]
  // //#endregion
  //#region       
  /**
   *        
   */
  referRangeDesc: string;
  /**
   *         
   */
  referList: { friend: number; money: string }[];

  //#endregion
  //#region       
  /**
   *         
   */
  dcIsOpened: boolean;

  /**
   *            
   * e.g Rp 20.000
   * Get xxx every day
   */
  dcGetMoney: string;

  /**
   *            
   * e.g Rp 20.000
   * Get xxx every day
   */
  dcRangeDesc: string;
  /**
   *            
   */
  dcProductConfigs: {
    [key in IActivityNameTypes]?: {
      /**
       *                  
       */
      userPrice: string;
    };
  };
  //#endregion
  // //#region      -1.7.1  
  // /**
  //  *             
  //  */
  // mvshareIsOpened: boolean
  // /**
  //  *         
  //  */
  // mvshareGetMoney: string
  // //#endregion
  //#region whatsapp        
  /**
   *        
   */
  waRequiredStartMoneyForRefer?: number; //10000,

  /**
   *        
   */
  waRequiredStartMoneyForDC?: number; //120000,
  //  config15     referA    checkins  ，  3
  friendMinCheckins: string;
};
