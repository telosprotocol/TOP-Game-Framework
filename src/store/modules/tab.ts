import type { Module } from 'vuex';
import type { IStoreStateType } from '../interface/interface';

const initialState = {
  // Wallet: {
  //   tabCount: 3,
  //   currentTabIdx: 0,
  // },
  refer: {
    tabCount: 3,
    currentTabIdx: 0,
  },
  MyWallet: {
    tabCount: 2,
    currentTabIdx: 0,
  },
} as TabState;

type ITabStateItem = {
  tabCount: number;
  currentTabIdx: number;
  // tabIdx       ，  tabCount
  toTabIdx: number;
};

export enum TabsType {
  Wallet = 'Wallet',
  MyWallet = 'MyWallet',
  refer = 'refer',
}
export type TabState = Record<TabsType, ITabStateItem>;
/* Tab      tab     */
export const tab: Module<TabState, IStoreStateType> = {
  namespaced: true,
  state: initialState,
  mutations: {
    setCurrentSelectedTabIdx(
      state,
      payload: { type: keyof TabState; index: number; from?: 'bridge' }
    ) {
      const tabState = state[payload.type];
      if (!tabState) {
        if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log('Error Tab', payload);
        }
      }
      tryUpdateTabIdx(tabState, payload.index);
    },
    setTabCount(state, payload: { type: keyof TabState; count: number }) {
      const tabState: ITabStateItem = state[payload.type];
      if (!tabState) {
        if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
          console.log('Error Tab', payload);
        }
      }
      tabState.tabCount = payload.count;
      tryUpdateTabIdx(tabState, tabState.toTabIdx);
    },
  },
  actions: {},
};
function tryUpdateTabIdx(tabState: ITabStateItem, toTabIdx: number) {
  tabState.toTabIdx = toTabIdx;
  if (toTabIdx < tabState.tabCount && toTabIdx >= 0) {
    tabState.currentTabIdx = toTabIdx;
  }
}
