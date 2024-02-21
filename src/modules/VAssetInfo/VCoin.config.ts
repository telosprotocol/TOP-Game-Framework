import { webpFilter } from '@/directives/webp';
import { formatFloatG } from '@/store/modules/universe/universe';
import type { IFormatFloatOption } from '@/utils/string';

import { formatVGold, formatVToken } from '../vFormatter';

const VTOKEN_ICON = webpFilter(require('@/assets/vcommon/CoinVToken.png?webp'));
const GOLD_ICONS = [
  [500, require('@/assets/vcommon/goldList/1.png?webp')],
  [2000, require('@/assets/vcommon/goldList/2.png?webp')],
  [10000, require('@/assets/vcommon/goldList/3.png?webp')],
  [50000, require('@/assets/vcommon/goldList/4.png?webp')],
  [150000, require('@/assets/vcommon/goldList/7.png?webp')],
  [Number.MAX_SAFE_INTEGER, require('@/assets/vcommon/goldList/8.png?webp')],
].map((item) => {
  return [item[0], webpFilter(item[1])];
}) as [number, string][];

const CoinConfigMap = {
  GOLD: {
    icon: webpFilter(require('@/assets/vcommon/CoinGold.png?webp')),
    rewardIcon: GOLD_ICONS[0][1],
    format: formatVGold,
  },
  VTOKEN: {
    icon: VTOKEN_ICON,
    rewardIcon: VTOKEN_ICON,
    format: formatVToken,
  },
  DEFAULT: {
    icon: '',
    rewardIcon: '',
    format: function formatNum(num: number, _option?: IFormatFloatOption) {
      let rOption = {
        precision: 6,
        reserveZeroDecimal: false,
      };
      if (_option) {
        rOption = {
          ...rOption,
          ..._option,
        };
      }
      return formatFloatG(num, rOption);
    },
  },
};

/**
 *   Coin
 * @param type
 * @param num num  ，      rewardIcon，      rewardIcon
 * @returns
 */
export function getCoinConfig(
  type: 'GOLD' | 'VTOKEN' | 'BONUS_GOLD',
  num?: number | string
) {
  let config = CoinConfigMap[type as 'GOLD' | 'VTOKEN'];
  if (!config && type === 'BONUS_GOLD') {
    config = CoinConfigMap.GOLD;
  }

  if (num != null && (type === 'GOLD' || type === 'BONUS_GOLD')) {
    const iNum = typeof num === 'string' ? parseInt(num, 10) : num;
    let rewardIcon = GOLD_ICONS[0][1];
    if (!isNaN(iNum)) {
      for (let i = 0; i < GOLD_ICONS.length; i++) {
        const goldItem = GOLD_ICONS[i];
        rewardIcon = goldItem[1];
        if (iNum <= goldItem[0]) {
          break;
        }
      }
    }
    config = {
      ...config,
      rewardIcon,
    };
  }

  return config || CoinConfigMap.DEFAULT;
}
