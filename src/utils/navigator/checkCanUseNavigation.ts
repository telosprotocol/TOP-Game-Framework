import { startsWith } from 'lodash-es';

export function checkCanUseNavigation(url: string) {
  const origin = location.origin;
  const list = ['/', origin, 'vv://', 'https://vgameapp.deshare.net'];

  for (let i = 0; i < list.length; i++) {
    if (startsWith(url, list[i])) {
      return true;
    }
  }
  return false;
}
