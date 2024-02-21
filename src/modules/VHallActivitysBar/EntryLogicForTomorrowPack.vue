<template>
  <div></div>
</template>

<script lang="ts">
import { getClientTimestampByAsyncStateItemRef } from '@/controller/AsyncStateItem';
import { waitUserIsLoginedAuth } from '@/store/modules/user.utils';
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { VTomorrowPackTaskMixin } from '../GameHall/VGameTomorrowPack/VTomorrowPackTask.state';

import { VActivityHallListMixin } from '../VActivityList/activity-hall.state';
@Component({
  components: {},
})
export default class EntryLogicForTomorrowPack extends mixins(
  VTomorrowPackTaskMixin,
  VActivityHallListMixin
) {
  @Prop({
    type: Boolean,
  })
  hasEntry: boolean;

  get isLogined() {
    return this.$ss.getters['user/isRealLogined'];
  }
  @Watch('isLogined')
  onLogined() {
    this.tryUpdateEntryInfo();
  }
  @Watch('$ss.state.bridge.appTabName', {
    immediate: true,
  })
  async onAppTabNameChange(appTabName: string, _fromTabName: string) {
    if (appTabName !== 'bounds') {
      return;
    }
    this.tryUpdateEntryInfo();
  }
  @Watch('hasEntry', { immediate: true })
  async onEntryChange(hasEntry: boolean) {
    if (hasEntry) {
      this.refreshVTomorrowPackTask(300);
    }
  }
  async tryUpdateEntryInfo() {
    // update bankruptcyItem
    const isLogined = await waitUserIsLoginedAuth();
    if (isLogined) {
      await this.refreshVActivityList();
      if (this.hasEntry) {
        this.refreshVTomorrowPackTask();
      }
    }
  }
  onEntryCountDownEnd() {
    if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
      console.log('[DEBUG] tomorrow count end', this.hasEntry);
    }
    if (this.hasEntry) {
      this.refreshVActivityList(10);
    }
  }

  @Watch('entryClientEndTime')
  forceParentUpdate() {
    if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
      console.log('[DEBUG] trigger forceUpdate tomorrow', arguments[0]);
    }
    this.$emit('forceUpdate');
  }
  get entryClientEndTime() {
    const taskItem = this.TomorrowPackTask;
    if (taskItem && taskItem.status === 'NOT_STARTED' && taskItem.startTime) {
      return getClientTimestampByAsyncStateItemRef(
        Number(taskItem.startTime),
        this.stateItemVTomorrowPackTaskRef
      );
    }
    return 0;
  }
}
</script>
