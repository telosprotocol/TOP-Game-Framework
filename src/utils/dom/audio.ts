export function initAudio(audio: HTMLAudioElement) {
  if (audio) {
    audio.load();
  }
}

export function audioPlay(audio: HTMLAudioElement, volume?: number) {
  if (audio) {
    try {
      audio.currentTime = 0;
      if (volume) {
        audio.volume = volume;
      }
      audio.play();
    } catch (ex) {
      console.log('Error', 'audioPlay');
    }
  }
}
