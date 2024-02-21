import { reportVTask } from './VTask.api';
import { gBusEmitAndPenetrate } from '@/js_bridge/jsCallApp/utilsPenetrate';
import type { IVTaskItemBase } from './VTask.model';
import type { ITaskModuleType } from './VTask.controller';

export async function reportVTaskBehavior(
  taskId: string,
  taskInfo: IVTaskItemBase,
  taskModuleType: ITaskModuleType
) {
  await reportVTask(taskId);
  gBusEmitAndPenetrate('onVTaskUpdate', {
    type: 'single',
    taskId,
    old: taskInfo,
    taskModuleType,
    taskDealType: 'Compelete',
  });
}
