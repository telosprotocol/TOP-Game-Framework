/**
 *  :
 */
export enum GameUserTaskStatus {
  /**
   *
   */
  doing = 'UNDERWAY',

  /**
   *
   */
  claimable = 'AVAILABLE',

  /**
   *    /
   */
  received = 'FINISHED',
  // TIMEOUT
}
/**
 *
 */
export type IVTaskItemBase = API.TaskItemVO;

// #region

/**
 *
 */
export type IGAME_TASK_TYPE = 'NEWHAND' | 'DAILY';

//#endregion

// #region

/**
 *
 */
export type IVGameTaskItem = IVTaskItemBase;

// #endregion
