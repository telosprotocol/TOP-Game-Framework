import { MS_SECOND } from '@/constants/time';
import { safePerformanceTimeNow } from '../utils/datetime';
export default class TimeReporter {
  private _options = {
    intervalMS: MS_SECOND * 60,
    //
    errorIntervalMs: 10 * MS_SECOND,
  };

  private _timer: ReturnType<typeof setTimeout>;
  private _onReport: (second: number) => Promise<boolean>;
  private _lastSuccessDt: number;
  /**
   *   reporter(     )
   * @param onReport
   */
  reStartReporter(onReport: (second: number) => Promise<boolean>) {
    this._lastSuccessDt = safePerformanceTimeNow();
    this._onReport = onReport;
    this.onReporterTimer(this._options.intervalMS);
  }

  private onReporterTimer(delayMS: number) {
    this.stopReporter();
    this._timer = setTimeout(async () => {
      const dtNow = safePerformanceTimeNow();
      //
      if (this._onReport) {
        const second = Math.floor((dtNow - this._lastSuccessDt) / 1000);
        const res = await this._onReport(second);
        if (res) {
          this._lastSuccessDt = safePerformanceTimeNow(); //
          this.onReporterTimer(this._options.intervalMS);
        } else {
          //
          this.onReporterTimer(this._options.errorIntervalMs);
        }
      }
    }, delayMS);
  }

  stopReporter() {
    if (this._timer) {
      clearTimeout(this._timer);
    }
  }
}
