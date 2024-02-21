import { openAppH5LinkPreferLocal } from '@/utils/navigator/openAppH5LinkPreferLocal';
import ButtonLockController from '@/controller/ButtonLockController';

let catEl: HTMLDivElement | null = null;
export function showDebugTool() {
  if (!catEl) {
    catEl = document.createElement('div');
    catEl.className =
      'fixed z-10 left-0  rounded-full opacity-60 text-white flex items-center flex-col justify-center text-xs leading-none';
    catEl.style.width = '42px';
    catEl.style.height = '42px';
    catEl.style.bottom = '42px';
    catEl.style.background = window.GC.appName === 'wallet' ? 'green' : 'red';
    const h5VersionCode = (window.GC.h5Version || '').split('-')[1];
    catEl.innerHTML = `<div>DEBUG</div><div>${h5VersionCode}</div>`;
    document.body.appendChild(catEl);
    catEl.addEventListener('click', () => {
      if (!ButtonLockController.Instance.tryGetNavLock()) {
        return;
      }
      openAppH5LinkPreferLocal(`/v/debugpage`, {});
    });
  }
  // catEl.style.display = 'flex';
}
