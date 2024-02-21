import { tryInitOnGameSettingSoundEffectChange } from '@/js_bridge/appCallJs/onGameSettingSoundEffectChange';
import { getGameSettingSoundEffectIsOpen } from '@/js_bridge/js_call_app_base';
import GlobalAudioController from './GlobalAudioController';

export async function initGlobalAudio() {
  GlobalAudioController.Instance.init();
  tryInitOnGameSettingSoundEffectChange((isOpen) => {
    GlobalAudioController.Instance.setAudioMute(!isOpen);
  });
  const isSoundOpen = await getGameSettingSoundEffectIsOpen();
  if (isSoundOpen.Result === 1) {
    GlobalAudioController.Instance.setAudioMute(!isSoundOpen.data);
  }
}
