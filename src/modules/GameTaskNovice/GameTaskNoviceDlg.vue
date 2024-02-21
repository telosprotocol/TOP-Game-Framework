<template>
  <GameWoodDlgUI
    :value="value"
    @input="emitDlgVisible"
    @close="onDlgClose"
    v-bind="$attrs"
    :img-title="
      $ss.getters.translateImage({
        en: require('@/assets/gametask2/title-en.png'),
        id: require('@/assets/gametask2/title-id.png'),
      })
    "
  >
    <nav
      slot="header"
      class="h-8 mb-3 w-full flex items-center justify-between px-0.5 mt-1.5"
    >
      <div
        v-for="item in groupList"
        class="flex items-center justify-center bg-contain bg-center bg-no-repeat text-xs font-robot-medium font-medium relative"
        @click="onSelectGroup(item)"
        :key="item.group"
        :style="
          $ss.getters.normalizeCss(
            {
              width: 50,
              height: 30,
              color: curGroupIdx !== item.idx ? '#6A1A1A' : '#F39B07',
              textShadow:
                curGroupIdx !== item.idx
                  ? '0px 1px 0px  rgba(255, 236, 168, 1)'
                  : undefined,
            },
            curGroupIdx === item.idx
              ? require('@/assets/gameTaskNovice/groupSelected.png')
              : require('@/assets/gameTaskNovice/groupUnSelect.png')
          )
        "
      >
        {{ item.name }}
        <div
          v-if="item.status === 'NOT_STARTED'"
          class="absolute inset-0 bg-black bg-opacity-60 rounded-md"
        >
          <div
            class="bg-contain bg-center bg-no-repeat -right-0.5 absolute -top-0.5"
            :style="
              $ss.getters.normalizeCss(
                { width: 12, height: 17 },
                require('@/assets/gameTaskNovice/iconLock.png?webp'),
                true
              )
            "
          ></div>
        </div>
      </div>
    </nav>
    <div
      slot="default"
      class="w-full overflow-auto mb-1"
      :style="$ss.getters.normalizeCss({ height: 206 })"
    >
      <GameTaskNoviceGroupItem
        v-if="curGroupItem"
        :key="curGroupItem.group"
        :group-info="curGroupItem"
        :group-type="curGroupItem.group"
      ></GameTaskNoviceGroupItem>
    </div>
    <div class="flex items-center justify-center h-full" slot="bottom">
      <div
        v-if="curClientEndTime"
        class="rounded-full h-4 pr-3 pl-7 flex items-center justify-center bg-[#78460C] text-[#FFE173] text-xs leading-none shadow-sm shadow-[#FFE78E] relative"
      >
        <div
          class="bg-contain bg-center absolute"
          :style="
            $ss.getters.normalizeCss(
              { left: -7, top: -8, width: 31, height: 32 },
              require('@/assets/gameTaskNovice/iconTimer.png?webp'),
              true
            )
          "
        ></div>
        <TimeCountDown
          @countdownEnd="onCountDownEnd"
          :show-second="true"
          :client-end-time="curClientEndTime"
        ></TimeCountDown>
      </div>
    </div>
  </GameWoodDlgUI>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Watch } from 'vue-property-decorator';
import GameTaskNoviceGroupItem from './GameTaskNoviceGroupItem.vue';

import { VGameTaskNoviceMixin } from './GameTaskNovice.state';
import BindEventMixinDefault from '../../mixins/BindEventMixin';
import { onGBus } from '@/utils/GBus';
import { startsWith } from 'lodash-es';
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
import { MS_SECOND } from '@/constants/time';
import TimeCountDown from '@/components/CountDownTimer/TimeCountDown.vue';
import { getClientTimestampByAsyncStateItemRef } from '@/controller/AsyncStateItem';
import createGameToast from '../UI/createGameToast';
import GameWoodDlgUI from '../UI/GameWoodDlgUI.vue';
@Component({
  components: {
    GameTaskNoviceGroupItem,
    TimeCountDown,
    GameWoodDlgUI,
  },
})
export default class GameTaskNoviceDlg extends mixins(
  BaseDlgMixin,
  VGameTaskNoviceMixin,
  BindEventMixinDefault
) {
  useInited() {
    const cb1 = onGBus('onVTaskUpdate', (payload) => {
      if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
        console.log('[DEBUG] onVTaskUpdate', payload);
      }
      if (this.value) {
        if (
          (payload.type === 'single' &&
            startsWith(payload.taskModuleType, 'VGAME_NOVICE_FIVE_DAYS_')) ||
          payload.type === 'behavior'
        ) {
          this.isTaskChanged = true;
          this.refreshVGameTaskNovice(10);
        }
      }
    });
    return () => {
      cb1();
    };
  }

  //#region Dlg Basic Setting
  dlgSound = true;

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.isTaskChanged = false;
      this.tryAutoSetGroupIdx();
      this.refreshVGameTaskNovice(MS_SECOND * 10).then(() => {
        this.tryAutoSetGroupIdx();
      });
    }
  }

  onDlgClose() {
    this.$tracev('click_close_mission', {});
    this.$emit('close', this.isTaskChanged);
  }
  isTaskChanged?: boolean;
  //#endregion

  //#region
  get groupList() {
    const gameUserTaskGroups = this.GameTaskNovice;
    if (!gameUserTaskGroups) {
      return [];
    }
    const serverTime = this.stateItemVGameTaskNoviceRef.lastServerDt || 0;
    return gameUserTaskGroups.map((item, idx) => {
      const endTime = Number(item.endTime);
      const startTime = Number(item.startTime);
      const status: 'NOT_STARTED' | 'TIME_OUT' | 'CUR' =
        serverTime <= startTime
          ? 'NOT_STARTED'
          : serverTime >= endTime
          ? 'TIME_OUT'
          : 'CUR';
      return {
        ...item,
        idx,
        name: this.$t('VG.Dayx', [idx + 1]),
        status: status,
      };
    });
  }

  /**
   *
   */
  curGroupIdx = 0;

  tryAutoSetGroupIdx() {
    const groupList = this.groupList;
    if (groupList) {
      let toIdx = 0;
      for (let i = 0; i < groupList.length; i++) {
        const status = groupList[i].status;
        if (status !== 'NOT_STARTED') {
          toIdx = i;
        }
      }
      this.curGroupIdx = toIdx;
    }
  }
  get curGroupItem() {
    const curGroupIdx = this.curGroupIdx;
    return this.groupList.filter((_, idx) => idx === curGroupIdx)[0];
  }

  onSelectGroup(groupItem: typeof GameTaskNoviceDlg.prototype.groupList[0]) {
    if (!ButtonLockController.Instance.tryGetLock('group', 0.5)) {
      return;
    }
    if (groupItem.status === 'NOT_STARTED') {
      createGameToast(this.$t('VG.comeBackTomorrow'));
      return;
    }

    this.curGroupIdx = groupItem.idx;
  }
  //#endregion

  //#region

  onCountDownEnd() {
    //
    this.refreshVGameTaskNovice(0);
  }
  get curClientEndTime() {
    const curGroupItem = this.curGroupItem;
    if (curGroupItem?.status !== 'CUR') {
      return 0;
    }
    return getClientTimestampByAsyncStateItemRef(
      curGroupItem.endTime,
      this.stateItemVGameTaskNoviceRef
    );
  }

  //#endregion
}
</script>
