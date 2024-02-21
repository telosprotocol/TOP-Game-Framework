import { createActivityMixin } from './activity.factory';

const { VActivityListMixin, stateItemVActivityList } = createActivityMixin(
  'VActivityPageListMixin',
  {
    showInList: true,
  }
);

export const VActivityPageListMixin = VActivityListMixin;
export const stateItemVActivityPageList = stateItemVActivityList;
