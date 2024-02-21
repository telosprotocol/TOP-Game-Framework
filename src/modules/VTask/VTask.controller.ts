import type { IVTaskItemBase } from './VTask.model';
import { dealVNavTask } from './task-nav.controller';

import { Toast } from 'vant';
import { TransTool } from '@/init/i18n';
import { startsWith } from 'lodash-es';
import { dealH5Command } from '@/utils/navigator/dealH5Command';
import { reportVTaskBehavior } from './reportVTaskBehavior';

/**
 * TaskGroupQueryAO  moduleType groupType
 */
export type ITaskModuleType =
  | 'TASK_CENTER_DAILY' //despreted
  | 'TASK_CENTER_NOVICE' //despreted
  | 'WITHDRAW_SMALL_WITHDRAW'
  | 'WITHDRAW_LIMIT_TIME'
  | 'SEVEN_DAY_ACTIVITY_DAY'
  | 'HIGGS_DAY'
  | 'EARN_CASH_DAILY'
  | 'EARN_CASH_NOVICE'
  | 'INVITE_CONTINUITY'
  | 'RECHARGE_DAILY'
  | 'VGAME_TOMORROW_GIFT_VGAME_TOMORROW_GIFT'
  | 'VGAME_NOVICE_VGAME_NOVICE'
  | 'VGAME_WELCOME_VGAME_WELCOMEE'
  //
  | 'VGAME_NOVICE_FIVE_DAYS_VGAME_NOVICE_FIRST_DAY'
  | 'VGAME_NOVICE_FIVE_DAYS_VGAME_NOVICE_SECOND_DAY'
  | 'VGAME_NOVICE_FIVE_DAYS_VGAME_NOVICE_THIRD_DAY'
  | 'VGAME_NOVICE_FIVE_DAYS_VGAME_NOVICE_FOURTH_DAY'
  | 'VGAME_NOVICE_FIVE_DAYS_VGAME_NOVICE_FIFTH_DAY'
  | 'GROWTH_PLAN_GROWTH_PLAN';
export function getTaskTraceParams(
  taskInfo: IVTaskItemBase,
  taskModuleType: ITaskModuleType
) {
  const traceParams = {
    mission_type: taskModuleType,
    mission_reward: taskInfo.propRewards?.length + '',
    // mission_dict: taskInfo.taskDict,
    mission_dict: taskInfo.taskId,
    mission_name: taskInfo.name,
    mission_source: taskModuleType,
  };
  return traceParams;
}
/**
 *    V
 * @param taskConfig
 * @returns
 */
export async function dealVTaskToDo(
  taskInfo: IVTaskItemBase,
  taskModuleType: ITaskModuleType
) {
  switch (taskInfo.behaviorType) {
    case 'NAVIGATION':
    case 'BET':
    case 'WIN':
    case 'RECHARGE':
    case 'WATCH':
    case 'INVITE':
    case 'ACTIVITY': //
    case 'PLAY': //
    case 'LOGIN': //
      if (startsWith(taskInfo.url, '/h5command/share')) {
        const res = await dealH5Command(taskInfo.url, {
          shareType: 'TaskShare',
          share_initialfrom: 'Task-' + taskInfo.taskId,
        });
        if (taskInfo.autoReport && res.Result === 1) {
          reportVTaskBehavior(taskInfo.taskId, taskInfo, taskModuleType);
        }
        return res.Result === 1;
      } else {
        await dealVNavTask(taskInfo, taskModuleType);
      }
      return true;
    default:
      Toast(TransTool.Instance.$t('Base.NotSupport'));
      return false;
  }
}
