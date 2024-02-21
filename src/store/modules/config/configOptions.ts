import type { IConfigOptions } from './IConfigOptions';
import type { ConfigKey } from './IConfigState';

export const configOptionsMap: {
  [key in ConfigKey]?: IConfigOptions<unknown>;
} = {
  // 20: {
  //   throttleIns: new ThrottleController('Config20'),
  //   //       ，  countryCode  ，        ，
  //   initMode: 'clear',
  //   overtimeMs: MS_MINUTES_30,
  //   getConfig: function () {
  //     return getCountryCodeConfig();
  //   },
  // },
  // 52: {
  //   throttleIns: new ThrottleController('Config52'),
  //   initMode: 'default',
  //   overtimeMs: MS_MINUTES_30,
  //   getConfig: function () {
  //     return getCheckInConfig();
  //   },
  // },
};
