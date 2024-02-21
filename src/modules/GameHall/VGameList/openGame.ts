import { navigation } from '@/js_bridge/js_call_app_base';
import { ROUTENAME_INAPP_VGAME } from '@/constants/localRoutePath';
import { navigation_login_bridge } from '@/js_bridge/js_call_app';
import { waitUserIsLoginedOnly } from '@/store/modules/user.utils';
import { convert2QueryStr } from '../../../utils/url';
import { BannerOpType } from '@/constants/BannerOpType';

/**
 *   ：gamehall，  ：floating_bar，  :subscript，   ：item_detail
 * gamehall_err_exit:  app      ，
 */
export type IOpenGameSource =
  | 'gamehall_COLLECTION'
  | 'gamehall'
  | 'floating_bar'
  | 'subscript'
  | 'item_detail'
  | 'gamehall_err_exit'
  | 'game_spin'
  | 'game_guide'
  | 'VEarnCash'
  | 'gamehall_guideclaim';

export async function openVGame(
  gameId: string,
  orientation: 'HORIZONTAL' | 'VERTICAL',
  from: IOpenGameSource,
  openAfterCloseUrl?: string
) {
  const url = `vv://webGame?${convert2QueryStr({
    gameId: gameId,
    orientation: orientation,
    from: from,
    __OPEN_AFTER_CLOSE: openAfterCloseUrl,
  })}`;
  const isLogined = await waitUserIsLoginedOnly();
  if (!isLogined) {
    navigation_login_bridge(ROUTENAME_INAPP_VGAME, {
      to: url,
      opType: BannerOpType.AppLink,
    });
    return false;
  }
  navigation({
    url: url,
  });
  return true;
}
// /**
//  * Wallet Tab      GBus
//  */
// export function initOpenGameByOtherPageForWalletTab() {
//   if (process.env.VUE_APP_ENV_SERVER === 'development') {
//     console.log('[GAME] waiting for open game command');
//   }
//   return onGBus('onOpenGame', async (payload) => {
//     const { gameId, from } = payload;
//     const gameListRes = await stateItemVGameList.tryUpdate(MS_MINUTE * 5);
//     if (!gameListRes.ok) {
//       console.log('[GAME] cant openGame,load list error', gameId);
//       return;
//     }
//     const gameList = gameListRes.result;
//     const gameItem = gameList.find((item) => item.id === gameId);
//     if (!gameItem) {
//       console.log('[GAME] game not exists', gameId);
//       return;
//     }
//     openVGame(gameId, gameItem.content, from);
//   });
// }

// openGameByGBus('1106600803113631744','game_spin');
// /**
//  *  WalletTab
//  */
// export function openGameByGBus(gameId: string, from: IOpenGameSource) {
//   penetrateGBusOnly('onOpenGame', { gameId, from }, ROUTENAME_INAPP_VRIGHT);
// }
