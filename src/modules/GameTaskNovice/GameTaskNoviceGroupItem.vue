<template>
  <div>
    <GameTaskNoviceItem
      v-for="(item, idx) in taskList"
      :class="{ 'mb-1.5': idx !== taskList.length - 1 }"
      :task-info="item"
      :task-module-type="taskModuleType"
      :key="item.taskId"
    ></GameTaskNoviceItem>
    <NoDataIcon
      v-if="taskList.length === 0"
      class="px-2 text-[#F39B07] mt-6 text-center"
    >
      {{ $t('VGT.groupMissionDone') }}
    </NoDataIcon>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Prop, Mixins } from 'vue-property-decorator';
import GameTaskNoviceItem from './GameTaskNoviceItem.vue';
import { convertBgImageStyle } from '@/utils/styles';
import NoDataIcon from '@/components/NoData/NoDataIcon.vue';
import { VGameTaskNoviceMixin } from './GameTaskNovice.state';

@Component({
  components: {
    GameTaskNoviceItem,
    NoDataIcon,
  },
})
export default class GameTaskNoviceGroupItem extends Mixins(
  VGameTaskNoviceMixin
) {
  @Prop({
    type: Object,
  })
  groupInfo?: API.TaskGroupStatusVO;

  @Prop({
    type: String,
  })
  groupType:
    | 'VGAME_NOVICE_FIRST_DAY'
    | 'VGAME_NOVICE_SECOND_DAY'
    | 'VGAME_NOVICE_THIRD_DAY'
    | 'VGAME_NOVICE_FOURTH_DAY'
    | 'VGAME_NOVICE_FIFTH_DAY';

  get taskModuleType() {
    return 'VGAME_NOVICE_FIVE_DAYS_' + this.groupType;
  }

  // onCountDownEnd() {
  //   //
  //   this.refreshVGameUserTask(0);
  // }
  get taskList() {
    return this.groupInfo?.tasks || [];
  }
  get bgTitleStyle() {
    return convertBgImageStyle(
      require('@/assets/gametask/bgGroupTitle.png?webp'),
      true,
      {
        height: this.$ss.getters.designPxToReal(37) + 'px',
        textStroke: '1px #710804',
      } as any
    );
  }
}
</script>
