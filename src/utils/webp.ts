let _isSupportWebp: boolean;

function checkWebpFeatureForIOS(callback: (isSupport: boolean) => void) {
  const img = new Image();
  img.onload = function () {
    const result = img.width > 0 && img.height > 0;
    callback(result);
  };
  img.onerror = function () {
    callback(false);
  };
  img.src =
    'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==';
}
export function isSupportWebp() {
  if (_isSupportWebp != null) {
    return _isSupportWebp;
  }
  _isSupportWebp =
    !![].map &&
    typeof window !== 'undefined' &&
    window.document
      .createElement('canvas')
      .toDataURL('image/webp')
      .indexOf('data:image/webp') === 0;

  if (!_isSupportWebp) {
    const ua = navigator.userAgent.toLowerCase();
    const isIOS =
      /(ios|ipad|iphone)/.test(ua) ||
      (ua.indexOf('macintosh') > -1 && 'ontouchend' in document);
    // const isAndroid = /android/.test(ua);
    if (isIOS) {
      checkWebpFeatureForIOS((isSupport) => {
        if (isSupport) {
          _isSupportWebp = true;
        }
      });
    }
  }
  return _isSupportWebp;
}
