//  app
function checkOpen(cb: (isopened: 0 | 1) => void) {
  const _clickTime = +new Date();

  //
  function check(elsTime: number) {
    if (elsTime > 3000 || document.hidden || (document as any).webkitHidden) {
      cb(1);
    } else {
      cb(0);
    }
  }
  let _count = 0;
  const intHandle = setInterval(function () {
    _count++;
    const elsTime = +new Date() - _clickTime;
    if (_count >= 100 || elsTime > 3000) {
      clearInterval(intHandle);
      check(elsTime);
    }
  }, 20);
}
/**
 *   APP
 * @param openUrl    app url
 * @param callback (isOpened)=>void
 */
export default function openApp(
  openUrl: string,
  callback: (opened: 1 | 0) => void
) {
  window.location.href = openUrl;
  if (callback) {
    checkOpen(function (opened) {
      callback && callback(opened);
    });
  }
}
