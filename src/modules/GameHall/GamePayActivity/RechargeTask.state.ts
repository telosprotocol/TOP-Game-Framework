import { createModuleTaskState } from '../../VTask/ModuleTask.state';

export const {
  VModuleTasksMixin: VModuleTasksMixinForRechargeTask,
  stateItemVModuleTasks: stateItemVModuleTasksForRechargeTask,
} = createModuleTaskState({
  moduleType: 'RECHARGE',
  groupType: 'DAILY',
});
