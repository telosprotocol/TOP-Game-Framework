import type {
  SHARE_TYPES_VGAME,
  TYPE_TP_SHARE_TYPES,
} from '@/constants/invite';
import { ReferUtils } from '@/controller/ReferUtils';
import { getCurrentLang, TransTool } from '@/init/i18n';
const rUtilMap: { [tp: number]: ReferUtils } = {};
//TODO: channelName
const VGAMEPKG_SHARECONFIG = {
  shareImage: {
    en: 'https://sparta-vgame.sgp1.cdn.digitaloceanspaces.com/10140-en.jpg',
    id: 'https://sparta-vgame.sgp1.cdn.digitaloceanspaces.com/10140-id.jpg',
  },
};
const GAME_SHARECONFIG = VGAMEPKG_SHARECONFIG;
const EARN_SHARECONFIG = VGAMEPKG_SHARECONFIG;

export async function waitShareInfoForGame() {
  const SHAREIMG = GAME_SHARECONFIG.shareImage;
  return {
    shareImage: SHAREIMG[getCurrentLang() as 'en' | 'id'] || SHAREIMG.en,
    shareContent: TransTool.Instance.$t('V.gameShareContent') as string,
  };
}

export async function waitShareInfoForEarn() {
  const SHAREIMG = EARN_SHARECONFIG.shareImage;
  return {
    shareImage: SHAREIMG[getCurrentLang() as 'en' | 'id'] || SHAREIMG.en,
    shareContent: TransTool.Instance.$t('V.gameShareContent') as string,
  };
}
function tryGetReferUtilIns(tp: typeof SHARE_TYPES_VGAME) {
  if (!rUtilMap[tp]) {
    rUtilMap[tp] = new ReferUtils(tp as TYPE_TP_SHARE_TYPES);
    rUtilMap[tp].waitShareInfo = waitShareInfoForGame;
  }
  return rUtilMap[tp];
}
export function getVReferUtils(type: typeof SHARE_TYPES_VGAME) {
  const rUtil = tryGetReferUtilIns(type);
  return rUtil;
}
