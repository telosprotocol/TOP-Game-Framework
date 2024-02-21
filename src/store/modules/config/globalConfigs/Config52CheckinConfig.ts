import { getJsonConfigByRemote } from '@/http/api/config/configUtils';

// 52    
export async function getCheckInConfig() {
  const res = await getJsonConfigByRemote<IConfig52Model>(52);

  return res;
}
export interface ICheckInAwardRule {
  day: number;
  coin: number;
  /**
   * >0       
   */
  ad?: number;
  // //        ，     
  // ad: number;
  // //          subCategory
  // task: number;
  //     
  second: number;
}
/**
 *       
 */
export interface IConfig52Model {
  /**
   *    
   */
  list: ICheckInAwardRule[];
  /**
   *    
   */
  list2: ICheckInAwardRule[];
}
