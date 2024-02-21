import type { AnimationItem } from 'lottie-web';

const lottieReadyCallbackList: (() => void)[] = [];
let isLoadingLottie = false;
function loadLottie(cb: () => void) {
  const dom1 = document.createElement('script');
  dom1.src = './lottie.min.js';
  dom1.async = true;
  dom1.onload = cb;
  document.body.appendChild(dom1);
}
function startLoadLottie() {
  if (isLoadingLottie) {
    return;
  }
  isLoadingLottie = true;
  loadLottie(function () {
    console.log('[PREFAB]', 'lottie loaded', !!window.lottie);
    while (lottieReadyCallbackList.length > 0) {
      const cb = lottieReadyCallbackList.pop();
      if (cb) {
        cb();
      }
    }
  });
}

export function getLottieReady(cb: () => void) {
  if (typeof window.lottie === 'undefined') {
    lottieReadyCallbackList.push(cb);
    startLoadLottie();
  } else {
    cb();
  }
}

export function initLottieAnimation(
  container: HTMLElement,
  animationData: any,
  cb: (anim: AnimationItem) => void
) {
  if (typeof window.lottie === 'undefined') {
    getLottieReady(function () {
      const anim = initLottieAnimationAtOnce(container, animationData);
      cb && cb(anim);
    });
  } else {
    const anim = initLottieAnimationAtOnce(container, animationData);
    cb && cb(anim);
    return anim;
  }
  function initLottieAnimationAtOnce(
    container: HTMLElement,
    animationData: any
  ) {
    return window.lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData,
    });
  }
}
