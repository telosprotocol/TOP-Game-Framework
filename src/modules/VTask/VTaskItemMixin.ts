import { GameUserTaskStatus } from '@/modules/VTask/VTask.model';
import type { IVTaskItemBase } from '@/modules/VTask/VTask.model';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
@Component({
  components: {},
})
export default class VTaskItemMixin extends Vue {
  @Prop({
    type: Object,
    required: false,
  })
  taskInfo?: IVTaskItemBase;

  get taskStatus() {
    return this.taskInfo?.status;
  }
  get btnText() {
    const TEXTMAP = {
      [GameUserTaskStatus.doing]: this.$t('V.UNDERWAY'),
      [GameUserTaskStatus.claimable]: this.$t('V.AVAILABLE'),
      [GameUserTaskStatus.received]: this.$t('V.FINISHED'),
    };
    return (
      TEXTMAP[this.taskStatus as 'UNDERWAY' | 'AVAILABLE' | 'FINISHED'] ||
      'Unkown'
    );
  }
  get percent() {
    const taskInfo = this.taskInfo;
    if (!taskInfo) {
      return 0;
    }
    return Math.min(
      Number(taskInfo?.currentValue) / Number(taskInfo?.targetValue),
      1
    );
  }

  getPropNumText(pItem: API.PropRewardDetailVO) {
    if (pItem.minPropNum != null && pItem.maxPropNum > 0) {
      return `X${pItem.minPropNum}~${pItem.maxPropNum}`;
    }
    return `X${pItem.propNum}`;
  }
}
