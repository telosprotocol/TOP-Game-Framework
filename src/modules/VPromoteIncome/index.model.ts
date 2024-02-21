/**
 * PromotionIncomeData
 */
export interface IPromotionIncomeProcessBarData {
  /**       */
  directSameLevelCount: number;
  /**              */
  nextLevelNeedSameLevelUser: number;
  /**       */
  directRechargeCount: number;
  /**            */
  nextLevelNeedRechargeUser: number;
  /**     */
  currentLevel: string;
}
