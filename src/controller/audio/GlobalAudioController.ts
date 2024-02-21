import { audioPlay } from '@/utils/dom/audio';

const AUDIO_RESOURCE_MAP = {
  dlgClose: require('@/assets/audio/btn_close_sound.mp3'),
  dlgOpen: require('@/assets/audio/btn_open_sound.mp3'),
};
export type AudioType = keyof typeof AUDIO_RESOURCE_MAP;
export default class GlobalAudioController {
  private static _Ins: GlobalAudioController;
  static get Instance() {
    if (!GlobalAudioController._Ins) {
      GlobalAudioController._Ins = new GlobalAudioController();
    }
    return GlobalAudioController._Ins;
  }
  private constructor() {}

  private _audioMap: Partial<Record<AudioType, HTMLAudioElement>> = {};

  init() {
    this.initAudioType('dlgClose');
    this.initAudioType('dlgOpen');
  }

  setAudioMute(mute: boolean) {
    this.mute = mute;
  }

  private mute = true;
  tryPlayAudio(audioType: AudioType, volume?: number) {
    if (this.mute) {
      return;
    }
    this.playAudio(audioType, volume);
  }
  private playAudio(audioType: AudioType, volume?: number) {
    const el = this.getAudioByType(audioType);
    audioPlay(el, volume);
  }

  private getAudioByType(audioType: AudioType) {
    const el = this._audioMap[audioType];
    if (el) {
      return el;
    }
    return this.initAudioType(audioType);
  }
  private initAudioType(audioType: AudioType) {
    const src = AUDIO_RESOURCE_MAP[audioType];
    if (!src) {
      return null;
    }
    const el = document.createElement('audio');
    el.hidden = true;
    el.autoplay = false;
    el.src = src;
    this._audioMap[audioType] = el;
    document.body.append(el);
    el.load();
    return el;
  }
}
