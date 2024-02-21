import { paddingLeft } from '@/utils/string';
import Component from 'vue-class-component';
import { Prop, Watch, Vue } from 'vue-property-decorator';
import { MS_MINUTE, MS_SECOND } from '@/constants/time';
import { convertMsSecond2TimeInfo, TimeUnit } from '@/utils/datetime';

/**
 *    ，hour:minute  or   hour:minute:second
 */
@Component({
  components: {},
})
export default class TimeCountDownMixin extends Vue {
  @Prop({
    type: Boolean,
    default: false,
  })
  showSecond: boolean;
  @Prop({
    type: Number,
    required: true,
  })
  clientEndTime: number;

  deactivated() {
    this.stopUpdateCountDown();
  }
  beforeDestroy() {
    this.stopUpdateCountDown();
  }
  lastInterval: ReturnType<typeof setInterval>;

  get propStrForChange() {
    return `${this.clientEndTime}_${this.showSecond}`;
  }

  @Watch('propStrForChange', { immediate: true })
  onLeftMsSecondChange() {
    const clientEndTime = this.clientEndTime;
    if (isNaN(clientEndTime) || !clientEndTime) {
      return;
    }
    const showSecond = this.showSecond;
    this.stopUpdateCountDown();
    this.onCountDownTick();
    this.lastInterval = setInterval(
      () => {
        this.onCountDownTick();
      },
      showSecond ? MS_SECOND : MS_MINUTE / 2
    );
  }
  curLeftMsSecond = 0;
  private onCountDownTick() {
    const dtNow = new Date().getTime();
    const leftMsSecond = this.clientEndTime - dtNow;
    if (leftMsSecond <= 0) {
      this.curLeftMsSecond = 0;
      this.stopUpdateCountDown();
      this.$emit('countdownEnd');
      return;
    }
    this.curLeftMsSecond = leftMsSecond;
  }

  stopUpdateCountDown() {
    if (this.lastInterval) {
      clearInterval(this.lastInterval);
      this.lastInterval = null;
    }
  }

  get leftCountDownInfo() {
    const curLeftMsSecond = this.curLeftMsSecond;
    const info = convertMsSecond2TimeInfo(curLeftMsSecond, {
      maxUnit: TimeUnit.hour,
    });
    return info;
  }
  get leftCountDownTxt() {
    const info = this.leftCountDownInfo;
    const timeList = [info.hour, info.minute];
    if (this.showSecond) {
      timeList.push(info.second);
    } else {
      if (info.second > 0) {
        const toMinute = timeList[1] + 1;
        timeList[1] = toMinute % 60;
        timeList[0] = info.hour + (toMinute >= 60 ? 1 : 0);
      }
    }
    return timeList
      .map((item) => {
        return paddingLeft(item + '', 2, '0');
      })
      .join(':');
  }
}
