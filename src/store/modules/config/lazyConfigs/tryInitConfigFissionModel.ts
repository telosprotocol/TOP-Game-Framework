import type { UserGrade } from '@/store/modules-dynamic/fission/enums';

//#region       
export interface IConfigFissionModel {
  /**
   *       ，         
   */
  survey?: {
    opType: number;
    url: string;
  };

  /**
   *     :    level      x
   */
  levelScores: {
    level: UserGrade;
    score: number;
  }[];

  /**
   *     :        
   */
  dayScoreRules: {
    /**
     *         :15
     *     
     * @default: 15
     */
    onlineMinute: number;
    /**
     *         :40
     *     
     * @default: 40
     */
    watchMinute: number;
    /**
     *            :10
     *     
     * @default: 10
     */
    watchMoviesMinute: number;

    /**
     *           :10
     *    
     * @default: 10
     */
    shareTimes: number;
    /**
     *              {inviteOneFriendScore} 
     *    
     * @default: 5
     */
    inviteFriendPerScore: number;
    /**
     *              
     *    
     * @default: 20
     */
    inviteFriendScoreLimit: number;

    /**
     *          {likeVideoPerScore} 
     *    
     * @default: 1
     */
    likeVideoPerScore: number;
    /**
     *             
     *    
     * @default: 5
     */
    likeVideoScoreLimit: number;
  };
}
//#endregion
