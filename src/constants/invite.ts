//#region tp

/**
 *  -Fission
 */
export const SHARE_TYPES_FISSION = 18;
/**
 *  -tiktok
 */
export const SHARE_TYPES_TIKTOK = 33;
/**
 *  -
 */
export const SHARE_TYPES_PLAYFORM = 16;

/**
 *  - Refer
 */
export const SHARE_TYPES_INVITE_REFERA = 1;

// /**
//  *
//  */
// export const SHARE_TYPES_INVITE_DC = 13;
/**
 *  -
 */
export const SHARE_TYPES_GAME_REFER = 15;
/**
 *  -V Game
 */
export const SHARE_TYPES_VGAME = 79;
// /**
//  *  -V
//  */
// export const SHARE_TYPES_VRIGHT = 80;

/**
 *  -
 */
export const SHARE_TYPES_LOTTERY = 17;
/**
 *  -whatsapp
 * @descpreted
 */
export const SHARE_TYPES_WHATSAPP = 19;

//#region  H5 TP
/**
 *  -TV
 */
export const SHARE_TYPES_TV_SHARE = 6;

/**
 *  -Video
 */
export const SHARE_TYPES_VIDEO_SHARE = 3;
/**
 *  -Movie
 */
export const SHARE_TYPES_MOVIE_SHARE = 11;

/**
 *  -Link( )
 * @despreted
 */
export const SHARE_TYPES_LINK = 12;

/**
 *  -WhatsGroup  --
 */
export const SHARE_TYPES_TO_WHATSAPPGROUP = 38;
/**
 *  -Whatsapp  --
 */
export const SHARE_TYPES_TO_WHATSAPP = 9;
/**
 *  -Whatsapp  --
 */
export const SHARE_TYPES_TO_FB = 10;

// #endregion

type TYPE_TP_SHARE_TYPES_ONLYH5 =
  | typeof SHARE_TYPES_INVITE_REFERA
  // | typeof SHARE_TYPES_INVITE_DC
  | typeof SHARE_TYPES_GAME_REFER
  | typeof SHARE_TYPES_PLAYFORM
  | typeof SHARE_TYPES_TIKTOK
  | typeof SHARE_TYPES_VGAME
  | typeof SHARE_TYPES_FISSION
  | typeof SHARE_TYPES_LOTTERY
  | typeof SHARE_TYPES_WHATSAPP;
type TYPE_TP_SHARE_TYPES_ONLYAPP =
  | typeof SHARE_TYPES_TV_SHARE
  | typeof SHARE_TYPES_MOVIE_SHARE
  | typeof SHARE_TYPES_VIDEO_SHARE
  | typeof SHARE_TYPES_TO_WHATSAPPGROUP
  | typeof SHARE_TYPES_TO_WHATSAPP
  | typeof SHARE_TYPES_TO_FB
  | typeof SHARE_TYPES_LINK;
export type TYPE_TP_SHARE_TYPES =
  | TYPE_TP_SHARE_TYPES_ONLYH5
  | TYPE_TP_SHARE_TYPES_ONLYAPP;

// #endregion

//#region nodejs

export const NODEJS_SHARE_CAMPAIGNPID = 10020;

/**
 * VGame
 */
export const NODEJS_SHARE_NUMBER_VGAME_FORVGAME_PKG = 10140;

export const NODEJS_SHARE_NUMBER_VGAME = NODEJS_SHARE_NUMBER_VGAME_FORVGAME_PKG;

export const NODEJS_SHARE_NUMBER_VRIGHT_CONT = 10133;
export const NODEJS_SHARE_NUMBER_VRIGHT_GAME = 10134;
export const NODEJS_SHARE_NUMBER_VRIGHT_MONEY = 10135;
export const NODEJS_SHARE_NUMBER_VRIGHT_RIGHT = 10136;
export const NODEJS_SHARE_NUMBER_VRIGHT_SLOT = 10137;

export const NODEJS_SHARE_NUMBER_PLAYFORM = 10126;
export const NODEJS_SHARE_NUMBER_TIKTOK = 10130;

export const NODEJS_SHARE_NUMBER_REFERMONEY =
  NODEJS_SHARE_NUMBER_VGAME_FORVGAME_PKG;

//   ，
export const NODEJS_SHARE_NUMBER_REFERGAME =
  NODEJS_SHARE_NUMBER_VGAME_FORVGAME_PKG;

export type INODEJS_SHARE_NUMBER_TYPE =
  | typeof NODEJS_SHARE_NUMBER_VGAME
  | typeof NODEJS_SHARE_NUMBER_VRIGHT_CONT
  | typeof NODEJS_SHARE_NUMBER_VRIGHT_GAME
  | typeof NODEJS_SHARE_NUMBER_VRIGHT_MONEY
  | typeof NODEJS_SHARE_NUMBER_VRIGHT_RIGHT
  | typeof NODEJS_SHARE_NUMBER_VRIGHT_SLOT
  | typeof NODEJS_SHARE_NUMBER_PLAYFORM
  | typeof NODEJS_SHARE_NUMBER_TIKTOK
  | typeof NODEJS_SHARE_NUMBER_REFERMONEY
  | typeof NODEJS_SHARE_NUMBER_REFERGAME
  | typeof NODEJS_SHARE_NUMBER_VGAME_FORVGAME_PKG;
//#endregion

/**
 *  （whatsapp/ / ）
 *  pf
 */
export enum SHARE_PLATFORM {
  INSTAGRAM = 1,
  FACEBOOK = 2,
  WHATSAPP = 3,
  MESSAGER = 4,
  TWITTER = 5,
  SYSTEMSHARE = 6,
  COPYLINK = 7,
  // QRCODE = 8,
  // SHARE_IT = 120,
  // AOTU = 121,
  // SNS = 122,

  TELEGRAM = 19,
  /**
   *
   */
  ADDRESSBOOK = 144,
}
