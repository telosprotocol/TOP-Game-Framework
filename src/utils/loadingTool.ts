let isLoading = false;

let loadingEl: HTMLDivElement;
export function hideLoading() {
  isLoading = false;
  if (loadingEl) {
    loadingEl.style.display = 'none';
  }
}
export function showLoading(isLock: boolean) {
  isLoading = true;
  if (!loadingEl) {
    loadingEl = document.createElement('div');
    loadingEl.style.zIndex = '30000';
    loadingEl.style.display = 'none';
    loadingEl.style.color = '#ffd039';
    loadingEl.innerHTML =
      '<div class="iconfont icon-loading text-4xl fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>';
    document.body.appendChild(loadingEl);
  }

  if (isLock) {
    loadingEl.setAttribute('class', '');
  } else {
    loadingEl.removeAttribute('class');
  }
  loadingEl.style.display = 'block';
}

//#region     loading(        Hide)
let delayLoadingTimer: ReturnType<typeof setTimeout> = null;
export function showDelayLoading(isLock: boolean, _timeout?: number) {
  if (getIsLoading()) {
    return false;
  }
  if (delayLoadingTimer) {
    clearTimeout(delayLoadingTimer);
  }
  delayLoadingTimer = setTimeout(function () {
    if (delayLoadingTimer != null) {
      showLoading(isLock);
    }
  }, _timeout || 200);
  // console.log('[PREFAB] showDelayLoading', _timeout, delayLoadingTimer)
}
export function hideDelayLoading() {
  // console.log('[PREFAB] hideDelayLoading', delayLoadingTimer)
  if (delayLoadingTimer) {
    //         loading
    clearTimeout(delayLoadingTimer);
    delayLoadingTimer = null;
    hideLoading();
  }
}
//    hideBodyLoading hideLoading  clear
export function clearDelayLoadingTimer() {
  if (delayLoadingTimer) {
    clearTimeout(delayLoadingTimer);
    delayLoadingTimer = null;
  }
}

export function getIsLoading() {
  return isLoading;
}
