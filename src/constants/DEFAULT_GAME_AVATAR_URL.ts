import { webpFilter } from '@/directives/webp';

export const DEFAULT_GAME_AVATAR_URL = webpFilter(
  require('@/assets/vcommon/DefaultAvatar.png?webp')
);
