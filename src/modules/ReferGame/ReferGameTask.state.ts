import { createModuleTaskState } from '../VTask/ModuleTask.state';

export const {
  VModuleTasksMixin: VModuleTasksMixinForReferGame,
  stateItemVModuleTasks: stateItemVModuleTasksForReferGame,
} = createModuleTaskState({
  moduleType: 'INVITE',
  groupType: 'CONTINUITY',
});
