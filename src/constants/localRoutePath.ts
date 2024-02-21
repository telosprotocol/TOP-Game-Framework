/**
 *  :
 * /dialog  ！！！
 *
 *
 */

//#region App RouteName
export const ROUTENAME_INAPP_RequireLogin = 'RequireLogin';
export const ROUTENAME_INAPP_Wallet = 'Wallet';
export const ROUTENAME_INAPP_NOTFOUND = 'NotFound';
//
export const ROUTENAME_INAPP_VGAME = 'VGame';
//
export const ROUTENAME_INAPP_VRIGHT = 'VRight';
export const ROUTENAME_INAPP_VRIGHTWALLET = 'VRightWallet';
export const ROUTENAME_INAPP_VRIGHTLEVEL = 'VRightLevel';

export const ROUTENAME_INAPP_V_TOPUP_TUTORIAL = 'VTopupTutorial';
export const ROUTENAME_INAPP_VRIGHT_DSTEXCHANGE = 'VRightDSTExchange';
export const ROUTENAME_INAPP_V_DSTDETAIL = 'VDSTDetail';
export const ROUTENAME_INAPP_RIGHTTODAYPREDICTEDEARNING =
  'VRightTodayPredictedEarning';

/**
 *  -
 */
export const ROUTENAME_INAPP_VCHECKINNOITCE = 'VNotice';
/**
 *
 */
export const ROUTENAME_INAPP_VINVITE = 'VInvite';

export const ROUTENAME_INAPP_VGAMETASK = 'VGameTask';
export const ROUTENAME_INAPP_VMYPASSCARD = 'VMyPassCard';
export const ROUTENAME_INAPP_V_FAQ = 'VFAQ';
export const ROUTENAME_INAPP_V_CS = 'VCS';
// export const ROUTENAME_INAPP_V_FAQ_DETAIL = 'VFAQDetail';
export const ROUTENAME_INAPP_V_GAME_SETTLEMENT = 'VGameSettlement';
export const ROUTENAME_INAPP_V_INVEST_LIST = 'VInvestList';

export const ROUTENAME_INAPP_V_RECHARGE_TRANSITION = 'VRechargeTransition';

export const ROUTENAME_INAPP_V_INVEST_INTRO = 'VInvestIntro';

export const ROUTENAME_INAPP_V_TOPUP_RANKING = 'VTopupRanking';
export const ROUTENAME_INAPP_V_TOPUP_RANKING_DST_INTRO =
  'VTopupRankingDSTIntro';
export const ROUTENAME_INAPP_V_TOPUP_RANKING_INTRO = 'VTopupRankingIntro';

/**
 *
 */
export const ROUTENAME_INAPP_V_ACADEMY_CENTER = 'VAcademyCenter';

/**
 *
 */
export const ROUTENAME_INAPP_V_GOLDWITHDRAW = 'VGoldWithdraw';

/**
 *  --
 */
export const ROUTENAME_INAPP_V_PROMOTE_TEAM_MEMBERS = 'VPromoteTeamMembers';

/**
 *  --
 */
export const ROUTENAME_INAPP_V_PLAY_TO_EARN = 'VPlayToEarn';
/**
 *  --
 */
export const ROUTENAME_INAPP_V_PLAY_TO_EARN_NEWBIE = 'VPlayToEarnIntro';
/**
 *  --
 */
export const ROUTENAME_INAPP_V_PROMOTE_INCOME = 'VPromoteIncome';
/**
 *  -- ( )
 */
export const ROUTENAME_INAPP_V_PROMOTE_INCOME_NEWBIE = 'VPromoteIncomeIntro';
/**
 *  --
 */
export const ROUTENAME_INAPP_V_PROMOTE_INCOME_HISTORY = 'VPromoteIncomeHistory';
/**
 *  --
 */
export const ROUTENAME_INAPP_V_PROMOTE_INCOME_RULE = 'VPromoteRule';
/**
 *  --
 */
export const ROUTENAME_INAPP_V_PROMOTE_SHARE = 'VPromoteShare';

/**
 *
 */
export const ROUTENAME_INAPP_V_REFER_MONEY = 'VReferM';

/**
 *
 */
export const ROUTENAME_INAPP_V_REFER_GAME = 'VReferGame';

/**
 *  --
 */
export const ROUTENAME_INAPP_V_EARN_CASH = 'VEarnCash';

/**
 *
 */
export const ROUTENAME_INAPP_V_MINIGAME = 'VMiniGame';

export const ROUTENAME_INAPP_V_GAME_NOVICE_GUIDE_PRE = 'VGameNoviceGuidePre';
//#endregion

export type RouterNameInappType =
  | typeof ROUTENAME_INAPP_Wallet
  | typeof ROUTENAME_INAPP_RequireLogin
  | typeof ROUTENAME_INAPP_NOTFOUND
  | typeof ROUTENAME_INAPP_VGAME
  | typeof ROUTENAME_INAPP_VRIGHT
  // | typeof ROUTENAME_INAPP_VGAME_RECHARGE
  | typeof ROUTENAME_INAPP_VRIGHTWALLET
  | typeof ROUTENAME_INAPP_V_DSTDETAIL
  | typeof ROUTENAME_INAPP_RIGHTTODAYPREDICTEDEARNING
  | typeof ROUTENAME_INAPP_V_FAQ
  | typeof ROUTENAME_INAPP_V_ACADEMY_CENTER
  // | typeof ROUTENAME_INAPP_RIGHTUSERBIND
  // | typeof ROUTENAME_INAPP_VINVITE
  | typeof ROUTENAME_INAPP_VGAMETASK
  | typeof ROUTENAME_INAPP_V_GAME_SETTLEMENT
  | typeof ROUTENAME_INAPP_VRIGHT_DSTEXCHANGE
  | typeof ROUTENAME_INAPP_V_TOPUP_TUTORIAL
  | typeof ROUTENAME_INAPP_V_TOPUP_RANKING
  | typeof ROUTENAME_INAPP_V_TOPUP_RANKING_DST_INTRO
  | typeof ROUTENAME_INAPP_V_TOPUP_RANKING_INTRO
  | typeof ROUTENAME_INAPP_V_PROMOTE_TEAM_MEMBERS
  | typeof ROUTENAME_INAPP_V_PLAY_TO_EARN
  | typeof ROUTENAME_INAPP_V_PLAY_TO_EARN_NEWBIE
  | typeof ROUTENAME_INAPP_V_PROMOTE_INCOME
  | typeof ROUTENAME_INAPP_V_PROMOTE_INCOME_NEWBIE
  | typeof ROUTENAME_INAPP_V_PROMOTE_INCOME_HISTORY
  | typeof ROUTENAME_INAPP_V_PROMOTE_SHARE
  | typeof ROUTENAME_INAPP_V_PROMOTE_INCOME_RULE
  | typeof ROUTENAME_INAPP_V_REFER_MONEY
  | typeof ROUTENAME_INAPP_V_REFER_GAME
  | typeof ROUTENAME_INAPP_V_EARN_CASH
  | typeof ROUTENAME_INAPP_V_GOLDWITHDRAW
  | typeof ROUTENAME_INAPP_V_GAME_NOVICE_GUIDE_PRE;
// | typeof ROUTENAME_INAPP_FissionRule;

// //  Wallet
// Other = 'Other',
//#region index （ /Wallet ）
export const ROUTEPATH_WALLET = '/Wallet';

// game tab game
export const ROUTEPATH_V_GAME = '/v/game';

// export const ROUTEPATH_V_GAMERECHARGE = '/dialog/gameRecharge';
// game tab  task

//
export const ROUTEPATH_V_RIGHT = '/v/right';

//
export const ROUTEPATH_V_RIGHTWALLET = '/v/rightwallet';
/**
 * DST
 */
export const ROUTEPATH_V_RIGHT_DSTEXCHANGE = '/v/dstexchange';
// /**
//  *
//  */
// export const ROUTEPATH_V_WITHDRAW_HISTORY = '/v/withdrawhistory';
//
export const ROUTEPATH_V_RIGHTLEVEL = '/v/rightlevel';

// DST /
export const ROUTEPATH_V_DSTDETAIL = '/v/dstdetail';
/**
 *
 */
export const ROUTEPATH_V_TOPUP_TUTORIAL = '/v/topuptutorial';

export const ROUTEPATH_V_INVEST_INTRO = '/v/InvestIntro';
// // -
// export const ROUTEPATH_V_RIGHTTODAYPREDICTEDEARNING =
//   '/v/righttodaypredictedearning';
// /**
//  *
//  */
// export const ROUTEPATH_V_PROMOTEGAME = '/v/PromoteGame';
// /**
//  *
//  */
// export const ROUTEPATH_V_PLAYGAME = '/v/PlayGame';

/**
 *
 */
export const ROUTEPATH_V_RECHARGE_TRANSITION = '/v/RechargeTransition';

/**
 *
 */
export const ROUTEPATH_V_TOPUP_RANKING_MIX = '/mix/TopupRanking';
/**
 *
 */
export const ROUTEPATH_V_TOPUP_RANKING_MIX2 = '/mix2/TopupRanking';
/**
 *  DST
 */
export const ROUTEPATH_V_TOPUP_RANKING_DST_INTRO_MIX =
  '/mix/TopupRankingDSTIntro';

/**
 *
 */
export const ROUTEPATH_V_TOPUP_RANKING_INTRO_MIX = '/mix/TopupRankingIntro';
/**
 *
 */
export const ROUTEPATH_V_TOPUP_RANKING_INTRO_MIX2 = '/mix2/TopupRankingIntro';
/**
 *
 */
export const ROUTEPATH_V_ACADEMY_CENTER = '/v/AcademyCenter';
/**
 *
 */
export const ROUTEPATH_V_GOLDWITHDRAW = '/v/GoldWithdraw';

/**
 *  --
 */
export const ROUTEPATH_V_PROMOTE_TEAM_MEMBERS = '/v/PromoteTeamMembers';

/**
 *  --
 */
export const ROUTEPATH_V_PLAY_TO_EARN = '/v/PlayToEarn';
/**
 *  --
 */
export const ROUTEPATH_V_PLAY_TO_EARN_NEWBIE = '/v/PlayToEarnIntro';
/**
 *  --
 */
export const ROUTEPATH_V_PROMOTE_INCOME = '/v/PromoteIncome';
/**
 *  -- ( )
 */
export const ROUTEPATH_V_PROMOTE_INCOME_NEWBIE = '/v/PromoteIncomeIntro';
/**
 *  --
 */
export const ROUTEPATH_V_PROMOTE_INCOME_HISTORY = '/v/PromoteIncomeHistory';
/**
 *  --
 */
export const ROUTEPATH_V_PROMOTE_INCOME_RULE = '/v/PromoteIncomeRule';
/**
 *  --
 *  getInvitePageUrl
 */
export const ROUTEPATH_V_PROMOTE_SHARE = '/v/PromoteShare';

export const ROUTEPATH_V_REFER_MONEY = '/v/ReferM';
export const ROUTEPATH_V_REFER_GAME = '/v/ReferGame';

//  -
// export const ROUTEPATH_V_RIGHTUSERBIND = '/v/rightuserbind';

// /**
//  *  ( getInvitePageUrl )
//  */
// export const ROUTEPATH_V_INVITE = '/v/invite';

/**
 *  --
 */
export const ROUTEPATH_V_EARN_CASH = '/v/EarnCash';

/**
 * Feedback & faq
 */
export const ROUTEPATH_V_FAQ = '/v/faq';
export const ROUTEPATH_V_CS = '/v/cs';
export const ROUTEPATH_TASKDETAIL = '/Wallet/TaskDetail';

export const ROUTEPATH_INAPP_RANKLIST = '/Wallet/RankList'; //
// export const ROUTEPATH_CHECKIN_RULE = '/Wallet/CheckInRule'

//Activity
export const ROUTEPATH_MOVIESHARE = '/Wallet/MovieShare';
export const ROUTEPATH_TIKTOK = '/Wallet/TIKTOK';

/**
 *
 */
export const ROUTEPATH_V_MINIGAME = '/v/MiniGame';

//#endregion

// Dialog  ： dialog /dialog
// export const ROUTEPATH_DIALOG_VGAMETASK = '/Dialog/VGameTask';

export const ROUTEPATH_DIALOG_V_GAME_SETTLEMENT = '/Dialog/GameSettlement';

// export const ROUTEPATH_DIALOG_V_GAME_NOVICE_GUIDE_PRE =
//   '/Dialog/GameNoviceGuidePre';

//#region mix
export const ROUTEPATH_MIX_PLAYFORM = '/mix/PlayForm';
export const ROUTEPATH_MIX_PFINDEX = '/mix/PFIndex';
//#endregion

//#region game
export const ROUTENAME_INAPP_PP_ZOUSI = 'GameZS';
export const ROUTEPATH_GAME_PP_ZOUSI = '/g/ppzs';
//#endregion
