import type { IConfigStatusInfo } from './configInitialState';
import type {
  IConfigLazyKey,
  ILazyConofigMapType,
} from './lazyConfigs/ILazyConofigTypes';

export type ConfigKey = IConfigLazyKey;

export type ConfigState = {
  configMap: ILazyConofigMapType;
  configStatusMap: { [configNum in ConfigKey]: IConfigStatusInfo };
};
