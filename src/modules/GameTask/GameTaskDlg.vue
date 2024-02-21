<template>
  <transition name="tz-transwrap">
    <div
      class="tz-modal tz-transwrap-scale flex items-center justify-center"
      v-if="value"
      v-bind="$attrs"
    >
      <div class="tz-modal_mask"></div>

      <!-- DlgContent Include bg -->
      <div
        class="relative bg-contain bg-center bg-no-repeat mx-auto tz-transel-scaleInOut flex flex-col items-center"
        :style="
          $ss.getters.normalizeCss(
            {
              width: 354,
              height: 529,
              paddingTop: 98,
              paddingLeft: 44,
              paddingRight: 38,
              paddingBottom: 36,
            },
            require('@/assets/gametask2/bgDlg.png?webp'),
            true
          )
        "
      >
        <div
          class="absolute bg-contain bg-center bg-no-repeat w-full"
          :style="
            $ss.getters.normalizeCss(
              {
                top: 44,
                height: 36,
              },
              $ss.getters.translateImage({
                en: require('@/assets/gametask2/title-en.png?webp'),
                id: require('@/assets/gametask2/title-id.png?webp'),
              }),
              true
            )
          "
        ></div>
        <button
          @click="onCloseClicked"
          class="absolute bg-contain bg-center bg-no-repeat active:scale-95"
          :style="
            $ss.getters.normalizeCss(
              {
                width: 38,
                height: 38,
                top: 32,
                right: -2,
              },
              require('@/assets/gametask2/x.png?webp'),
              true
            )
          "
        ></button>
        <nav class="h-8 mb-3 w-full flex items-center justify-between px-0.5">
          <div
            v-for="item in groupNavList"
            class="flex items-center justify-center bg-contain bg-center bg-no-repeat text-xs font-robot-medium font-medium"
            @click="curGroupType = item.name"
            :key="item.name"
            :style="
              $ss.getters.normalizeCss(
                {
                  width: 130,
                  height: 30,
                  color: item.name === curGroupType ? '#6A1A1A' : '#F39B07',
                  textShadow:
                    item.name === curGroupType
                      ? '0px 1px 0px  rgba(255, 236, 168, 1)'
                      : undefined,
                },
                item.name === curGroupType
                  ? require('@/assets/gameCommon/groupSelect.png')
                  : require('@/assets/gameCommon/groupUnSelect.png')
              )
            "
          >
            {{ item.title }}
          </div>
        </nav>
        <div class="w-full flex-1 overflow-auto mb-1">
          <GameTaskGroupItem
            v-if="curGroupItem"
            :key="curGroupItem.taskType"
            :group-info="curGroupItem"
            :group-type="curGroupItem.taskType"
          ></GameTaskGroupItem>
        </div>
        <GameTaskExporeRight></GameTaskExporeRight>
        <div
          v-if="curGroupItem && curGroupItem.expirationClientTime != null"
          class="absolute bottom-2 rounded-full h-4 pr-3 pl-7 flex items-center justify-center bg-[#78460C] text-[#FFE173] text-xs leading-none shadow-sm shadow-[#FFE78E]"
        >
          <div
            class="bg-contain bg-center absolute"
            :style="
              $ss.getters.normalizeCss(
                { left: -7, top: -8.5, width: 32, height: 32 },
                require('@/assets/gameTaskNovice/iconTimer.png?webp'),
                true
              )
            "
          ></div>
          <VCountDown
            @end="onCountDownEnd"
            :expiration-client-time="curGroupItem.expirationClientTime"
          ></VCountDown>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { mixins } from 'vue-class-component';
import ButtonLockController from '@/controller/ButtonLockController';
import { Watch } from 'vue-property-decorator';
import GameTaskGroupItem from './GameTaskGroupItem.vue';
import GameTaskExporeRight from './GameTaskExporeRight.vue';
import { tryMergeLocalesForVPrjGameTaskPage } from '@/locales/Page/VPrj/VGT/init';
import { VGameUserTaskMixin } from './GameUserTask.state';
import BindEventMixinDefault from '../../mixins/BindEventMixin';
import { onGBus } from '@/utils/GBus';
import { startsWith } from 'lodash-es';
import BaseDlgMixin from '@/components/Modal/BaseDlgMixin';
import VCountDown from './VCountDown.vue';
import { MS_SECOND } from '@/constants/time';
tryMergeLocalesForVPrjGameTaskPage();
@Component({
  components: {
    GameTaskGroupItem,
    GameTaskExporeRight,
    VCountDown,
  },
})
export default class GameTaskDlg extends mixins(
  BaseDlgMixin,
  VGameUserTaskMixin,
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
            startsWith(payload.taskModuleType, 'TASK_CENTER_')) ||
          payload.type === 'behavior'
        ) {
          this.refreshVGameUserTask(10);
        }
      }
    });

    //          ，
    // const cb2 = onGameTaskInfoSyncForGameTaskPage();
    return () => {
      cb1();
      // cb2();
    };
  }
  //#region Dlg Basic Setting

  @Watch('value')
  onValueChange(isShow: boolean) {
    if (isShow) {
      this.refreshVGameUserTask(MS_SECOND * 10);
    }
  }

  onCloseClicked() {
    if (!ButtonLockController.Instance.tryGetLock('close', 0.5)) {
      return;
    }
    this.$tracev('click_close_mission', {});
    // closeDlg
    this.emitDlgVisible(false);
  }
  //#endregion

  onCountDownEnd() {
    //
    this.refreshVGameUserTask(0);
  }
  get groupList() {
    const gameUserTaskGroups = this.gameUserTaskGroups;
    if (!gameUserTaskGroups) {
      return [];
    }
    return gameUserTaskGroups;
  }

  get curGroupItem() {
    const curGroupType = this.curGroupType;
    return this.groupList.filter((item) => item.taskType === curGroupType)[0];
  }

  get groupNavList() {
    return [{ name: 'DAILY' }, { name: 'NEWHAND' }].map((item) => {
      return {
        ...item,
        title: this.$t('VGT.group_' + item.name),
      };
    });
  }

  curGroupType = 'DAILY';

  get bgMissionTitleStyle() {
    return this.$ss.getters.normalizeCss(
      {
        width: 328,
        height: 138,
      },
      this.$ss.getters.translateImage({
        en: require('@/assets/gametask/missionHead-en2.png?webp'),
        id: require('@/assets/gametask/missionHead-id.png?webp'),
      }),
      true
    );
  }
}
</script>
