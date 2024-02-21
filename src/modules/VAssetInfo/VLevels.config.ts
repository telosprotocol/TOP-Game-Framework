import { convertBgImageStyle } from '@/utils/styles';
import { TransTool } from '@/init/i18n';
export const VGameLevelsConfig = {
  DEFAULT: {
    icon: require(`@/assets/vcommon/agentLevelBadge/agent_lv4.png?webp`),
  },
  0: {
    icon: require(`@/assets/vcommon/agentLevelBadge/agent_lv0.png?webp`),
  },
  1: {
    icon: require(`@/assets/vcommon/agentLevelBadge/agent_lv1.png?webp`),
  },
  2: {
    icon: require(`@/assets/vcommon/agentLevelBadge/agent_lv2.png?webp`),
  },
  3: {
    icon: require(`@/assets/vcommon/agentLevelBadge/agent_lv3.png?webp`),
  },
  4: {
    icon: require(`@/assets/vcommon/agentLevelBadge/agent_lv4.png?webp`),
  },
} as Record<string, { icon: string }>;

/**
 *
 * @param gameLevel 0-n
 */
export function getVGameLevelConfigByGameLevel(gameLevel: number | string) {
  const gameLevelConfigItem =
    VGameLevelsConfig[gameLevel] || VGameLevelsConfig.DEFAULT;
  return {
    title: TransTool.Instance.$t('V.gameLevel_' + gameLevel) as string,
    //
    levelStr: Number(gameLevel) + 1 + '',
    ...gameLevelConfigItem,
    iconStyle: convertBgImageStyle(gameLevelConfigItem.icon, true),
  };
}

// /**
//  *
//  * @param teamLevel 0-n
//  */
// export function getVTeamLevelConfigByTeamLevel(teamLevel: number) {
//   return {
//     title: TransTool.Instance.$t('V.teamLevel_' + teamLevel),
//     // ...(VGameLevelsConfig[gameLevel] || VGameLevelsConfig.DEFAULT),
//   };
// }

export function getVGameLevelConfigByTeamLevel2(gameLevel: string) {
  let _gameLevel: string | number = 'DEFAULT';
  switch (gameLevel) {
    case 'zero':
      _gameLevel = 0;
      break;
    case 'one':
      _gameLevel = 1;
      break;
    case 'two':
      _gameLevel = 2;
      break;
    case 'three':
      _gameLevel = 3;
      break;
    case 'four':
      _gameLevel = 4;
      break;
    default:
      _gameLevel = gameLevel;
      break;
  }
  const gameLevelConfigItem = VGameLevelsConfig[_gameLevel];
  return {
    title: TransTool.Instance.$t('V.gameLevel_' + _gameLevel),
    icon: gameLevelConfigItem.icon,
    // ...(VGameLevelsConfig[gameLevel] || VGameLevelsConfig.DEFAULT),
  };
}
