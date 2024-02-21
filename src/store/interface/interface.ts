import type { Store } from 'vuex';

import type {
  FeedbackState,
  IFeedbackGetters,
} from '../modules-dynamic/feedback';

import type { YoutuberState } from '../modules-dynamic/youtuber';
import type { AppState, IAppGeteter } from '../modules/app/app';
import type { BaseState, IBaseRootGetter } from '../modules/base';
import type {
  BridgeState,
  IBridgeGeteter,
  IBridgeRootGetter,
} from '../modules/bridge';
import type { IConfigRootGetter } from '../modules/config';
import type { ConfigState } from '../modules/config/IConfigState';
import type { TabState } from '../modules/tab';
import type {
  IUniverseRootGetter,
  UniverseState,
} from '../modules/universe/universe';
import type { IUserGetter, UserState } from '../modules/user';
// import type { ICarveUpGetter, ICarveUpState } from '../unused/carveup';

export interface IStoreStateType {
  user: UserState;
  base: BaseState;
  config: ConfigState;
  app: AppState;
  bridge: BridgeState;
  // message: MessageState
  tab: TabState;
  universe: UniverseState;
  // carveup?: ICarveUpState;
  youtuber: YoutuberState;
  feedback: FeedbackState;

  // fission: IFissionState;
}

export interface IRootGetter
  extends IConfigRootGetter,
    IBaseRootGetter,
    IBridgeRootGetter,
    IUniverseRootGetter,
    IUserGetter,
    // Partial<ICarveUpGetter>,
    IBridgeGeteter,
    IAppGeteter,
    IFeedbackGetters {}
export type StoreType = Omit<Store<IStoreStateType>, 'getters'> & {
  getters: IRootGetter;
};
