import { TransTool } from '@/init/i18n';

/**
 *        （n 、n )
 * @param second
 * @returns
 */
export function formatSecondTxt(second: number) {
  if (second == null) {
    return '';
  }
  if (second < 60) {
    return TransTool.Instance.$t('Base.xSec', [second]);
  }
  return TransTool.Instance.$t('Base.xMin', [Math.floor(second / 60)]);
}
