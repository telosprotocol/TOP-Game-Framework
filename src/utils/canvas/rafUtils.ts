export class RafTimer {
  lastTime: number;
  step: number;
  frame: number;
  /**
   *      ms, reset
   */
  span: number;

  /**
   *            (ms)
   */
  delta: number;
  startTime: number;
  // shouldAnim: number;
  constructor() {
    this.frame = 0;
    this.step = 0;
    this.span = 0;
    this.delta = 0;
    // this.shouldAnim = 0;
  }
  reset() {
    this.lastTime = Date.now();
    this.startTime = this.lastTime;
    this.step = 0;
    this.frame = 0;
    this.span = 0;
    this.delta = 0;
  }

  update() {
    this.step = (this.step + 1) % 60;
    const dtNow = Date.now();
    if (!this.lastTime) {
      this.delta = 0;
    } else {
      this.delta = dtNow - this.lastTime;
    }
    this.lastTime = dtNow;
    if (!this.startTime) {
      this.startTime = this.lastTime;
    }
    this.span = this.lastTime - this.startTime;
    this.frame++;
  }
}

export function startRaf(
  /**
   *   false     raf
   */
  perFrameUpdate: (rafTimer: RafTimer) => void | boolean
) {
  const rafTimer = new RafTimer();
  let isStoped = false;
  let lastRAFNum: number;
  startRafRrame();
  function startRafRrame() {
    perFrameUpdate(rafTimer);
    rafTimer.update();
    if (!isStoped) {
      lastRAFNum = window.requestAnimationFrame(startRafRrame);
    }
  }
  function stop() {
    isStoped = true;
    if (lastRAFNum != null) {
      window.cancelAnimationFrame(lastRAFNum);
      lastRAFNum = null;
    }
  }
  return {
    stop,
    resume() {
      if (isStoped) {
        isStoped = false;
        startRafRrame();
      }
    },
    restart() {
      stop();
      isStoped = false;
      rafTimer.reset();
      startRafRrame();
    },
  };
}
