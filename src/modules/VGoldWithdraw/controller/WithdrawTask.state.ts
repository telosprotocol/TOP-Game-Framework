import { createModuleTaskState } from '../../VTask/ModuleTask.state';

export const {
  VModuleTasksMixin: VModuleTasksMixinForSmallWithdraw,
  stateItemVModuleTasks: stateItemVModuleTasksForSmallWithdraw,
} = createModuleTaskState({
  moduleType: 'WITHDRAW',
  groupType: 'SMALL_WITHDRAW',
});

export const {
  VModuleTasksMixin: VModuleTasksMixinForLimitWithdraw,
  stateItemVModuleTasks: stateItemVModuleTasksForLimitWithdraw,
} = createModuleTaskState({
  moduleType: 'WITHDRAW',
  groupType: 'LIMIT_TIME',
});
