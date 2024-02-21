/* eslint-disable */
import { simpleProgressReportTaskController } from '@/vservices/client/TaskController';

/**
 * V
 * @returns
 */
export function reportVTask(taskId: string) {
  return simpleProgressReportTaskController({ taskId });
}
