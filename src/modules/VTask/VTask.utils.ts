import type { IVTaskItemBase } from './VTask.model';

export function getTaskFirstReward(info: IVTaskItemBase) {
  return info.propRewards?.[0];
}
