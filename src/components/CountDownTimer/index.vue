<template>
  <div class="inline-block">
    <slot
      :count-down-list="countDownListDetail"
      :count-down-info="countDownInfoDetail"
    >
      <span
        class="countdown-item"
        v-for="(item, idx) in countDownListDetail"
        :key="idx"
      >
        <span class="countdown-item-num">{{ item.text }}</span>
        <span v-if="idx !== countDownList.length - 1">:</span>
      </span>
    </slot>
  </div>
</template>

<script lang="ts">
import {
  convertSecond2TimeInfo,
  safePerformanceTimeNow,
  TimeUnit,
} from '@/utils/datetime';
import { paddingLeft } from '@/utils/string';
import Component from 'vue-class-component';
import Vue from 'vue';

export const CountDownTimerBase = Vue.extend({
  props: {
    //
    serverSecond: {
      type: Number,
      default: null,
    },
    //
    updateAt: {
      type: Number,
      default: null,
    },
    /**
     *
     */
    onClientSeconodUpdate: {
      type: Function,
      default: null,
    },
    /**
     *     (  )，ms
     *          serverSecond>   ,     maxTolerance，
     *     1，   1s
     */
    maxTolerance: {
      type: Number,
      default: 1,
    },
    //#region
    /**
     *
     */
    maxUnit: {
      type: Number,
      default: TimeUnit.hour,
    },
    /**
     *  maxIgnoreUnit  ，    0，
     */
    maxIgnoreUnit: {
      type: Number,
      default: TimeUnit.day,
    },
    //#endregion
  },
});

/**
 *
 * @returns     0
 */
function getCurCountDownTime(
  serverCountDownTime: number,
  serverUpdateAt: number
) {
  const dtNow = safePerformanceTimeNow();
  let spanSecond = Math.floor((dtNow - serverUpdateAt) / 1000);
  if (spanSecond < 0) {
    spanSecond = 0;
    console.warn('time span is neg');
  }
  const realCountDownSecond = serverCountDownTime - spanSecond;
  if (realCountDownSecond < 0) {
    return 0;
  }
  return realCountDownSecond;
}
type CountDownUnitInfo = { text: string; unit: TimeUnit; num: number | null };
type RefreshTimeFrom = 'server' | 'timer' | 'init';
@Component<CountDownTimer>({
  watch: {
    serverSecond() {
      this.refreshTime('server');
    },
  },
})
export default class CountDownTimer extends CountDownTimerBase {
  mounted() {
    this.refreshTime('init');
    // //
    // const timer = setInterval(() => {
    //   this.refreshTime()
    // }, 1000)
    // this.$on('hook:beforeDestroy', () => {
    //   clearInterval(timer)
    // })
  }

  get countDownInfo() {
    if (!this.noCountDown) {
      return {
        second: null,
        day: null,
        minute: null,
        hour: null,
      };
    }
    const countDownInfo = convertSecond2TimeInfo(this.curCountDownTime, {
      maxUnit: this.maxUnit,
    });
    return countDownInfo;
  }

  get countDownInfoDetail() {
    const res: {
      [key in 'second' | 'number' | 'second' | 'day']?: CountDownUnitInfo;
    } = {};
    if (this.noCountDown) {
      for (let i = this.maxUnit; i >= TimeUnit.second; i--) {
        const fieldName = TimeUnit[i];
        res[fieldName] = {
          text: '--',
          unit: i,
          num: null,
        };
      }
      return res;
    }
    const countDownInfo = convertSecond2TimeInfo(this.curCountDownTime, {
      maxUnit: this.maxUnit,
    });
    let canBeIgnored = true;
    for (let i = this.maxUnit; i >= TimeUnit.second; i--) {
      const fieldName = TimeUnit[i];
      const num = countDownInfo[fieldName];
      const curItem = {
        text: '--',
        unit: i,
        num,
      };
      res[fieldName] = curItem;
      if (canBeIgnored && i >= this.maxIgnoreUnit) {
        if (num !== 0) {
          canBeIgnored = false;
        } else {
          curItem.text = '';
          continue;
        }
      }
      curItem.text = paddingLeft(num + '', 2, '0');
    }
    return res;
  }

  get noCountDown() {
    return this.curCountDownTime == null;
  }

  get countDownListDetail() {
    const countDownInfoDetail = this.countDownInfoDetail;
    const list: { text: string; unit: TimeUnit; num: number | null }[] = [];
    for (let i = this.maxUnit; i >= TimeUnit.second; i--) {
      const fieldName = TimeUnit[i];
      list.push(countDownInfoDetail[fieldName]);
    }
    return list;
  }
  get countDownList() {
    return this.countDownListDetail.map((item) => {
      return item.text;
    });
  }
  //#region

  /**
   *      ， null ，
   */
  curCountDownTime: number = null;

  private _refreshTime(_from?: RefreshTimeFrom) {
    if (this.serverSecond == null) {
      this.curCountDownTime = null;
      return;
    }
    const realCountDownSecond = getCurCountDownTime(
      this.serverSecond,
      this.updateAt
    );
    const toCountDownSecond = realCountDownSecond;
    if (toCountDownSecond != 0 && this.curCountDownTime != null) {
      const gap = toCountDownSecond - this.curCountDownTime;
      if (gap > 0 && gap <= this.maxTolerance) {
        return; //   ，           ，
      }
    }
    this.curCountDownTime = toCountDownSecond;
    if (this.onClientSeconodUpdate) {
      // realCountDownSecond:
      this.onClientSeconodUpdate(
        this.curCountDownTime,
        realCountDownSecond,
        _from === 'server'
      );
    }
  }
  _timer: number;
  refreshTime(_from: RefreshTimeFrom) {
    if (this._timer) {
      clearTimeout(this._timer);
    }
    this._refreshTime(_from);
    if (this.serverSecond != null) {
      this._timer = setTimeout(() => {
        this.refreshTime('timer');
      }, 1000);
    }
  }

  beforeDestroy() {
    if (this._timer) {
      clearTimeout(this._timer);
    }
  }
  //#endregion
}
</script>
