// import { store } from '@/store/index';
// import { carveup } from '@/store/unused/carveup';

export const DebugRoutes: IBaseRouteOption[] = [
  {
    path: '/SimIndex',
    name: 'SimIndex',
    meta: { title: 'SimIndexPageList' },
    component: () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return import(`@/views/SimIndex`);
    },
  },
  {
    path: '/SimDebug',
    name: 'SimDebug',
    meta: { title: 'SimDebug' },
    component: () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return import(`@/views/SimDebug/SimDebug`);
    },
  },
];

export const SimRoutes: IBaseRouteOption[] = [
  // despreted pages ,only for debugger
  // {
  //   path: '/Guide/Premium',
  //   name: 'Guide_Premium',
  //   meta: { title: 'Guide Premium', },
  //   component: () => import(`@/views/Guide/Premium/index.vue`),
  // },
  // {
  //   path: ROUTEPATH_CARVEUP_INDEX,
  //   name: 'CARVEUP',
  //   meta: { title: 'CarveUP', requireLogined: true },
  //   component: () => import(`@/views-index/CarveUp/index.vue`),
  // }, {
  //   path: ROUTEPATH_CARVEUP_PREINDEX,
  //   name: 'CARVEUP PRE',
  //   meta: { title: 'CarveUP', requireLogined: true },
  //   component: () => import(`@/views-index/CarveUp/CarveUpPre.vue`),
  // }, {
  //   path: ROUTEPATH_CARVEUP_RULE,
  //   name: 'CARVEUP RULE',
  //   meta: { title: 'CarveUP', requireLogined: true },
  //   component: () => import(`@/views-index/CarveUp/Rule.vue`),
  // }, {
  //   path: ROUTEPATH_CARVEUP_REDEEM,
  //   name: 'CARVEUP REDEEM',
  //   meta: { title: 'CarveUP' },
  //   component: () => import(`@/views-index/CarveUpRedeem/index.vue`),
  // }, {
  //   path: ROUTEPATH_CARVEUP_VIOLATION,
  //   name: 'CARVEUP VIOLATION',
  //   meta: { title: 'CarveUP', },
  //   component: () => import(`@/views-index/CarveUp/CarveUpViolation.vue`),
  // },
];

// store.registerModule('carveup', carveup);
