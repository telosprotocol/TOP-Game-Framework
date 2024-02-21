import {
  ROUTEPATH_V_RIGHT,
  ROUTEPATH_V_RIGHTWALLET,
  ROUTEPATH_V_DSTDETAIL,
  ROUTENAME_INAPP_VRIGHT,
  ROUTENAME_INAPP_VRIGHTWALLET,
  ROUTEPATH_V_GAME,
  ROUTENAME_INAPP_VGAME,
  ROUTENAME_INAPP_V_DSTDETAIL,
  ROUTEPATH_V_FAQ,
  ROUTENAME_INAPP_V_FAQ,
  ROUTENAME_INAPP_V_RECHARGE_TRANSITION,
  ROUTEPATH_V_RECHARGE_TRANSITION,
  ROUTEPATH_V_RIGHTLEVEL,
  ROUTENAME_INAPP_VRIGHTLEVEL,
  ROUTEPATH_V_INVEST_INTRO,
  ROUTENAME_INAPP_V_INVEST_INTRO,
  ROUTEPATH_V_RIGHT_DSTEXCHANGE,
  ROUTENAME_INAPP_VRIGHT_DSTEXCHANGE,
  ROUTEPATH_V_TOPUP_TUTORIAL,
  ROUTENAME_INAPP_V_TOPUP_TUTORIAL,
  ROUTEPATH_V_ACADEMY_CENTER,
  ROUTENAME_INAPP_V_ACADEMY_CENTER,
  ROUTEPATH_V_GOLDWITHDRAW,
  ROUTENAME_INAPP_V_GOLDWITHDRAW,
  ROUTENAME_INAPP_V_PROMOTE_TEAM_MEMBERS,
  ROUTEPATH_V_PROMOTE_TEAM_MEMBERS,
  ROUTEPATH_V_PLAY_TO_EARN,
  ROUTENAME_INAPP_V_PLAY_TO_EARN,
  ROUTEPATH_V_PLAY_TO_EARN_NEWBIE,
  ROUTENAME_INAPP_V_PLAY_TO_EARN_NEWBIE,
  ROUTEPATH_V_PROMOTE_INCOME,
  ROUTENAME_INAPP_V_PROMOTE_INCOME,
  ROUTEPATH_V_PROMOTE_INCOME_NEWBIE,
  ROUTENAME_INAPP_V_PROMOTE_INCOME_NEWBIE,
  ROUTEPATH_V_PROMOTE_INCOME_HISTORY,
  ROUTENAME_INAPP_V_PROMOTE_INCOME_HISTORY,
  ROUTEPATH_V_PROMOTE_SHARE,
  ROUTENAME_INAPP_V_PROMOTE_SHARE,
  ROUTEPATH_V_PROMOTE_INCOME_RULE,
  ROUTENAME_INAPP_V_PROMOTE_INCOME_RULE,
  ROUTEPATH_V_REFER_MONEY,
  ROUTENAME_INAPP_V_REFER_MONEY,
  ROUTEPATH_V_EARN_CASH,
  ROUTENAME_INAPP_V_EARN_CASH,
  ROUTENAME_INAPP_V_MINIGAME,
  ROUTEPATH_V_MINIGAME,
  ROUTEPATH_V_CS,
  ROUTENAME_INAPP_V_CS,
} from './../../constants/localRoutePath';
/**
 * add by Seavey in 2020/04/22
 */
import {
  ROUTENAME_INAPP_NOTFOUND,
  ROUTENAME_INAPP_RequireLogin,
} from '@/constants/localRoutePath';
import Router from 'vue-router';
import { initRouterHook } from '../common/router-init';

/** Wallet Sub Routes */
let IndexList: IBaseRouteOption[] = [];
if (process.env.VUE_APP_ENV_NAME2 === 'sim') {
  //|| process.env.VUE_APP_ENV_SERVER === 'development'
  const { SimRoutes, DebugRoutes } = require('../common/routes-sim');
  if (process.env.VUE_APP_ENV_NAME2 === 'sim') {
    require('../sim/sim-init');
    IndexList = [
      {
        path: '/',
        redirect: '/SimIndex',
      },
      ...SimRoutes,
      ...DebugRoutes,
    ];
  }
  // else if (process.env.VUE_APP_ENV_SERVER === 'development') {
  //   IndexList = [...Home, ...DebugRoutes]
  // }
}

// console.log('IndexList => ', IndexList)
const router = new Router({
  routes: [
    ...IndexList, //
    {
      path: ROUTEPATH_V_GAME,
      name: ROUTENAME_INAPP_VGAME,
      meta: { noKeepAlive: true }, // noWebviewBack: true
      component: () => import('@/V/VGamePage.vue'),
    },
    {
      path: ROUTEPATH_V_RIGHT,
      name: ROUTENAME_INAPP_VRIGHT,
      meta: { noKeepAlive: true }, // noWebviewBack: true
      component: () => import('@/V/VRightPage.vue'),
    },
    {
      path: ROUTEPATH_V_TOPUP_TUTORIAL,
      name: ROUTENAME_INAPP_V_TOPUP_TUTORIAL,
      meta: { noKeepAlive: true },
      component: () => import('@/V/VTopupTutorialPage.vue'),
    },
    {
      path: ROUTEPATH_V_RIGHTWALLET,
      name: ROUTENAME_INAPP_VRIGHTWALLET,
      meta: { noKeepAlive: true }, // noWebviewBack: true
      component: () => import('@/V/VRightWalletPage.vue'),
    },
    {
      path: ROUTEPATH_V_RIGHT_DSTEXCHANGE,
      name: ROUTENAME_INAPP_VRIGHT_DSTEXCHANGE,
      meta: { noKeepAlive: true },
      component: () => import('@/V/VRightDSTExchange.vue'),
    },
    {
      path: ROUTEPATH_V_RIGHTLEVEL,
      name: ROUTENAME_INAPP_VRIGHTLEVEL,
      meta: { noKeepAlive: true }, // noWebviewBack: true
      component: () => import('@/V/VRightLevelPage.vue'),
    },
    {
      path: ROUTEPATH_V_DSTDETAIL,
      name: ROUTENAME_INAPP_V_DSTDETAIL,
      meta: { noKeepAlive: true }, // noWebviewBack: true
      component: () => import('@/V/VRightDSTDetailPage.vue'),
    },
    {
      path: ROUTEPATH_V_INVEST_INTRO,
      name: ROUTENAME_INAPP_V_INVEST_INTRO,
      meta: { noKeepAlive: true },
      component: () => import('@/V/VInvestIntroPage.vue'),
    },
    {
      path: ROUTEPATH_V_RECHARGE_TRANSITION,
      name: ROUTENAME_INAPP_V_RECHARGE_TRANSITION,
      meta: { noKeepAlive: true },
      component: () => import('@/V/VGameRechargeTransitionPage.vue'),
    },
    {
      path: ROUTEPATH_V_ACADEMY_CENTER,
      name: ROUTENAME_INAPP_V_ACADEMY_CENTER,
      meta: { noKeepAlive: true },
      component: () => import('@/V/VAcademyPage.vue'),
    },
    {
      path: ROUTEPATH_V_GOLDWITHDRAW,
      name: ROUTENAME_INAPP_V_GOLDWITHDRAW,
      meta: { noKeepAlive: true },
      component: () => import('@/V/VGoldWithdrawPage.vue'),
    },
    {
      path: ROUTEPATH_V_PROMOTE_TEAM_MEMBERS,
      name: ROUTENAME_INAPP_V_PROMOTE_TEAM_MEMBERS,
      meta: { noKeepAlive: true },
      component: () => import('@/V/VPromoteTeamMembersPage.vue'),
    },
    {
      path: ROUTEPATH_V_PLAY_TO_EARN,
      name: ROUTENAME_INAPP_V_PLAY_TO_EARN,
      meta: { noKeepAlive: true },
      component: () => import('@/V/VPlayToEarnPage.vue'),
    },
    {
      path: ROUTEPATH_V_PLAY_TO_EARN_NEWBIE,
      name: ROUTENAME_INAPP_V_PLAY_TO_EARN_NEWBIE,
      meta: { noKeepAlive: true },
      component: () => import('@/V/VPlayToEarnNewbiePage.vue'),
    },
    {
      path: ROUTEPATH_V_PROMOTE_INCOME,
      alias: ['/v/PromoteGame'], //        2.8.2.0 + n
      name: ROUTENAME_INAPP_V_PROMOTE_INCOME,
      meta: { noKeepAlive: true },
      component: () => import('@/V/VPromoteIncomePage.vue'),
    },
    {
      path: ROUTEPATH_V_PROMOTE_INCOME_NEWBIE,
      name: ROUTENAME_INAPP_V_PROMOTE_INCOME_NEWBIE,
      meta: { noKeepAlive: true },
      component: () => import('@/V/VPromoteIncomeNewbiePage.vue'),
    },
    {
      path: ROUTEPATH_V_PROMOTE_INCOME_HISTORY,
      name: ROUTENAME_INAPP_V_PROMOTE_INCOME_HISTORY,
      meta: { noKeepAlive: true },
      component: () => import('@/V/VPromoteIncomeHistoryPage.vue'),
    },
    {
      path: ROUTEPATH_V_PROMOTE_INCOME_RULE,
      name: ROUTENAME_INAPP_V_PROMOTE_INCOME_RULE,
      meta: { noKeepAlive: true },
      component: () => import('@/V/VPromoteIncomeRulePage.vue'),
    },
    {
      path: ROUTEPATH_V_PROMOTE_SHARE,
      name: ROUTENAME_INAPP_V_PROMOTE_SHARE,
      meta: { noKeepAlive: true },
      component: () => import('@/V/VPromoteSharePage.vue'),
    },
    {
      path: ROUTEPATH_V_REFER_MONEY,
      name: ROUTENAME_INAPP_V_REFER_MONEY,

      meta: { noKeepAlive: true },
      component: () => import('@/V/VReferMoneyPage.vue'),
    },
    // {
    //   path: ROUTEPATH_V_REFER_GAME,
    //   name: ROUTENAME_INAPP_V_REFER_GAME,

    //   meta: { noKeepAlive: true },
    //   component: () => import('@/V/VReferGamePage.vue'),
    // },
    {
      path: ROUTEPATH_V_EARN_CASH,
      name: ROUTENAME_INAPP_V_EARN_CASH,

      meta: { noKeepAlive: true },
      component: () => import('@/V/VEarnCashPage.vue'),
    },
    {
      path: ROUTEPATH_V_MINIGAME,
      name: ROUTENAME_INAPP_V_MINIGAME,
      meta: { noKeepAlive: true },
      component: () => import('@/V/VMiniGamePage.vue'),
    },

    {
      path: ROUTEPATH_V_CS,
      name: ROUTENAME_INAPP_V_CS,
      meta: {},
      component: () => import('@/V/VCSPage.vue'),
    },
    {
      path: ROUTEPATH_V_FAQ,
      name: ROUTENAME_INAPP_V_FAQ,
      meta: {},
      component: () => import('@/V/VFAQPage.vue'),
    },

    {
      path: '/RequireLogin',
      name: ROUTENAME_INAPP_RequireLogin,
      meta: { noKeepAlive: true },
      component: () => import(`@/views-index/RequireLogin.vue`),
    },
    {
      path: '*',
      name: ROUTENAME_INAPP_NOTFOUND,
      meta: {
        // to: 'remote.html',
      },
      component: () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return import(`@/views/NotFound`);
      },
    },
  ],
});

if (process.env.VUE_APP_ENV_SIM) {
  //    ,
  router.getRoutes().map((item) => {
    if (item.path === '*') {
      return;
    }
    const pathLowerCase = item.path.toLowerCase();
    if (
      pathLowerCase.indexOf('/mix2/') === 0 ||
      pathLowerCase.indexOf('/mix/') === 0 ||
      pathLowerCase.indexOf('/dialog/') === 0
    ) {
      console.log('ROUTE ERROR', item);
      throw new Error(
        'The route path invalid,can not startwith:/mix/ ,/dialog/ !!!'
      );
    }
  });
}
initRouterHook(router);
export default router;
