<template>
  <div class="bg-white rounded-2xl px-3 py-4 relative">
    <RibbonTitleUI class="absolute left-0 -top-3.5">
      {{ taskGroupTitle }}
    </RibbonTitleUI>

    <div>
      <EarnTaskItem
        class="mb-3"
        :task-group-type="taskGroupType"
        v-for="task in taskList"
        :key="task.taskId"
        :task-info="task"
      >
      </EarnTaskItem>
      <EarnTaskItem
        :task-group-type="taskGroupType"
        :task-info="bannerTask"
        :task-click="onBannerClick"
      ></EarnTaskItem>
    </div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Mixins } from 'vue-property-decorator';
import { Swipe, SwipeItem } from 'vant';
import EarnTaskItem from './EarnTaskItem.vue';
import type { ITaskModuleType } from '@/modules/VTask/VTask.controller';
import { VFissionTaskMixin } from './VFissionTask.state';
import RibbonTitleUI from './RibbonTitleUI.vue';
import { webpFilter } from '@/directives/webp';
import { openAppH5LinkPreferLocal } from '@/utils/navigator';
import ButtonLockController from '@/controller/ButtonLockController';
import { waitUserIsLoginedAuth } from '@/store/modules/user.utils';
import { APP_ROUTE_TAB_GAME } from '@/constants/APP_SCHEMA_URLS';
@Component({
  components: { Swipe, SwipeItem, EarnTaskItem, RibbonTitleUI },
})
export default class VEarnMission extends Mixins(VFissionTaskMixin) {
  get taskList() {
    return this.VFissionTask || [];
  }

  get taskGroupType() {
    return (
      this.VFissionIsNovice ? 'EARN_CASH_NOVICE' : 'EARN_CASH_DAILY'
    ) as ITaskModuleType;
  }

  get taskGroupTitle() {
    return this.$t('VEC.MissionTitle');
    // return this.VFissionIsNovice
    //   ? this.$t('VEC.MissionNew')
    //   : this.$t('VEC.MissionDaily');
  }
  curIdx = 0;
  onChange(index: number) {
    this.curIdx = index;
  }

  get bannerTask() {
    return {
      icon: require('@/assets/earncash/winCash.png'),
      name: this.$t('VEC.gameTaskTitle') as string,
      propRewards: [
        {
          imageUrl: webpFilter(require('@/assets/vcommon/CoinGold.png?webp')),
          propNum: 100000,
        },
      ],
      status: 'AVAILABLE',
    };
  }

  async onBannerClick() {
    if (!ButtonLockController.Instance.tryGetNavLock()) {
      return;
    }
    const isLogined = await waitUserIsLoginedAuth();
    this.$trace('click_earn_entrance_gametask', {
      is_logined: isLogined ? '1' : '0',
    });
    if (!isLogined) {
      openAppH5LinkPreferLocal(APP_ROUTE_TAB_GAME, {});
      return;
    }
    openAppH5LinkPreferLocal(
      '/h5command/openGameHallDlg?type=NOVICE_FIVE_DAYS&from=earncash_gametask',
      {}
    );
  }
}
</script>
@/constants/APP_SCHEMA_URLS
